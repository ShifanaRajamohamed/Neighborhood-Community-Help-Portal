import { Database } from '../config/db';
import { User } from '../../../shared/types';

export class UserRepository {
  private db = Database.getInstance();

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.db.users);
  }

  async findById(id: number): Promise<User | null> {
    const user = this.db.users.find(u => u.id === id);
    return Promise.resolve(user || null);
  }

  async findByContactInfo(contactInfo: string): Promise<User | null> {
    const user = this.db.users.find(u => u.contact_info === contactInfo);
    return Promise.resolve(user || null);
  }

  async findByRole(role: string): Promise<User[]> {
    const users = this.db.users.filter(u => u.role === role);
    return Promise.resolve(users);
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const newId = Math.max(...this.db.users.map(u => u.id), 0) + 1;
    const newUser: User = { id: newId, ...userData };
    this.db.users.push(newUser);
    return Promise.resolve(newUser);
  }

  async update(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return Promise.resolve(null);
    this.db.users[userIndex] = { ...this.db.users[userIndex], ...updates };
    return Promise.resolve(this.db.users[userIndex]);
  }

  async delete(id: number): Promise<boolean> {
    const userIndex = this.db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return Promise.resolve(false);
    this.db.users.splice(userIndex, 1);
    return Promise.resolve(true);
  }
}
