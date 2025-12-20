import pool from '../config/database';
import { User, CreateUserDTO } from '../types';
import { AppError } from '../middleware/errorHandler';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  async createUser(userData: CreateUserDTO): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { name, contact_info, location, role, password } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO Users (name, contact_info, location, role, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute<ResultSetHeader>(query, [
        name,
        contact_info,
        location,
        role,
        hashedPassword
      ]);

      const userId = result.insertId;

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );

      const user: Omit<User, 'password'> = {
        id: userId,
        name,
        contact_info,
        location,
        role,
        created_at: new Date()
      };

      return { user, token };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('User with this contact info already exists', 409);
      }
      throw error;
    }
  }

  async getUserById(id: number): Promise<Omit<User, 'password'>> {
    const query = `
      SELECT id, name, contact_info, location, role, created_at
      FROM Users
      WHERE id = ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return rows[0] as Omit<User, 'password'>;
  }

  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at' | 'password'>>): Promise<Omit<User, 'password'>> {
    const allowedFields = ['name', 'contact_info', 'location'];
    const updateFields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    values.push(id);

    const query = `
      UPDATE Users
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw new AppError('User not found', 404);
    }

    return this.getUserById(id);
  }

  async login(contact_info: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const query = `
      SELECT id, name, contact_info, location, role, password, created_at
      FROM Users
      WHERE contact_info = ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [contact_info]);

    if (rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = rows[0] as User;
    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
