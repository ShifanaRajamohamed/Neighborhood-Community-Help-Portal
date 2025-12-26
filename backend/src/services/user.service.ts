import { UserRepository } from '../repositories/user.repository';
import { User, UserRole } from '../../../shared/types';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async authenticateUser(contactInfo: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByContactInfo(contactInfo);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    // Business logic: validate role, set defaults, etc.
    const validRoles: UserRole[] = ['Resident', 'Helper'];
    if (!validRoles.includes(userData.role)) {
      throw new Error('Invalid user role');
    }

    return this.userRepository.create(userData);
  }

  async getHelpers(): Promise<User[]> {
    return this.userRepository.findByRole('Helper');
  }
}
