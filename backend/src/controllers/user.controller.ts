import { UserService } from '../services/user.service';
import { User } from '../../../shared/types';

export class UserController {
  constructor(private userService: UserService) {}

  async getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  async login(contactInfo: string, password: string): Promise<User | null> {
    return this.userService.authenticateUser(contactInfo, password);
  }

  async create(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const newUser = {
      ...userData,
      created_at: new Date().toISOString()
    };
    return this.userService.createUser(newUser);
  }

  async approveHelper(helperId: number): Promise<void> {
    // This would typically be an admin-only operation
    const helper = await this.userService.getUserById(helperId);
    if (helper && (helper.role === 'Helper' || helper.role === 'helper')) {
      // In a real app, you'd update the user in the repository
      // For now, we'll assume the service handles this
      console.log(`Approving helper ${helperId}`);
    }
  }
}
