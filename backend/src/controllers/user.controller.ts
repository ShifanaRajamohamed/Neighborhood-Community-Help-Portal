import { Database } from '../config/db';
import { User } from '../../../shared/types';

export class UserController {
  private db = Database.getInstance();

  getAll(): User[] {
    return this.db.users;
  }

  login(email: string, pass: string): User | undefined {
    // Simulate SQL: SELECT * FROM users WHERE email = ? AND password = ?
    return this.db.users.find(u => u.email === email && u.password === pass);
  }

  create(userData: Omit<User, 'id'>): User {
    // Simulate SQL: INSERT INTO users ...
    const newId = Math.max(...this.db.users.map(u => u.id), 0) + 1;
    const newUser = { ...userData, id: newId };
    
    this.db.users.push(newUser);
    return newUser;
  }

  approveHelper(helperId: number): void {
    // Simulate SQL: UPDATE users SET is_approved = TRUE WHERE id = ?
    const user = this.db.users.find(u => u.id === helperId && u.role === 'helper');
    if (user) {
      user.isApproved = true;
    }
  }
}
