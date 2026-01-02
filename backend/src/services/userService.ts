import pool from '../config/database';
import { User, CreateUserDTO, UserRole } from '../types';
import { AppError } from '../middleware/errorHandler';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  async createUser(userData: CreateUserDTO): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { name, contact_info, email, location, full_address, abstract_address, role, password } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Auto-approve requesters and admins, helpers need manual approval
    const isApproved = role === UserRole.REQUESTER || role === UserRole.ADMIN;

    const query = `
      INSERT INTO Users (name, contact_info, email, location, full_address, abstract_address, role, password, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute<ResultSetHeader>(query, [
        name,
        contact_info,
        email || contact_info,
        location,
        full_address || location,
        abstract_address || location,
        role,
        hashedPassword,
        isApproved
      ]);

      const userId = result.insertId;

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, role, name },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );

      const user: Omit<User, 'password'> = {
        id: userId,
        name,
        contact_info,
        email: email || contact_info,
        location,
        full_address: full_address || location,
        abstract_address: abstract_address || location,
        role,
        is_approved: isApproved,
        isApproved: isApproved,
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
      SELECT id, name, contact_info, email, location, full_address, abstract_address, role, is_approved, created_at
      FROM Users
      WHERE id = ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = rows[0];
    const result: Omit<User, 'password'> = {
      id: user.id,
      name: user.name,
      contact_info: user.contact_info,
      email: user.email,
      location: user.location,
      full_address: user.full_address,
      abstract_address: user.abstract_address,
      role: user.role as UserRole,
      is_approved: user.is_approved,
      isApproved: user.is_approved,
      created_at: user.created_at
    };

    return result;
  }

  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at' | 'password'>>): Promise<Omit<User, 'password'>> {
    const allowedFields = ['name', 'contact_info', 'email', 'location', 'full_address', 'abstract_address'];
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
      SELECT id, name, contact_info, email, location, full_address, abstract_address, role, password, is_approved, created_at
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
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    const result: Omit<User, 'password'> = {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      contact_info: userWithoutPassword.contact_info,
      email: userWithoutPassword.email,
      location: userWithoutPassword.location,
      full_address: userWithoutPassword.full_address,
      abstract_address: userWithoutPassword.abstract_address,
      role: userWithoutPassword.role as UserRole,
      is_approved: userWithoutPassword.is_approved,
      isApproved: userWithoutPassword.is_approved,
      created_at: userWithoutPassword.created_at
    };

    return {
      user: result,
      token
    };
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const query = `
      SELECT id, name, contact_info, email, location, full_address, abstract_address, role, is_approved, created_at
      FROM Users
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query);

    return (rows as any[]).map(user => ({
      ...user,
      isApproved: user.is_approved,
      fullAddress: user.full_address,
      abstractAddress: user.abstract_address
    }));
  }

  async approveHelper(id: number): Promise<Omit<User, 'password'>> {
    const query = `
      UPDATE Users
      SET is_approved = TRUE
      WHERE id = ? AND role = 'helper'
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [id]);

    if (result.affectedRows === 0) {
      throw new AppError('Helper not found or already approved', 404);
    }

    return this.getUserById(id);
  }
}
