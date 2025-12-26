
import { Database } from '../config/db';
import { User } from '../../shared/types';

export class UserController {
  private db = Database.getInstance();

  getAll() {
    return this.db.users.asReadonly();
  }

  login(email: string, pass: string): User | undefined {
    // Simulate SQL: SELECT * FROM users WHERE email = ? AND password = ?
    return this.db.users().find(u => u.email === email && u.password === pass);
  }

  create(userData: Omit<User, 'id'>): User {
    // Simulate SQL: INSERT INTO users ...
    const currentUsers = this.db.users();
    const newId = Math.max(...currentUsers.map(u => u.id), 0) + 1;
    const newUser = { ...userData, id: newId };
    
    this.db.users.update(users => [...users, newUser]);
    return newUser;
  }

  approveHelper(helperId: number) {
    // Simulate SQL: UPDATE users SET is_approved = TRUE WHERE id = ?
    this.db.users.update(users => users.map(u => {
        if (u.id === helperId && u.role === 'helper') {
            return { ...u, isApproved: true };
        }
        return u;
    }));
  }
}
