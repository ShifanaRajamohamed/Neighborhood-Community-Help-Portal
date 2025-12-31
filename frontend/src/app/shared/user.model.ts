import { User, UserRole } from '../../../../shared/types';

export { User, UserRole };

export interface CreateUserRequest {
  name: string;
  contact_info: string;
  location: string;
  role: UserRole;
  password: string;
}

export interface LoginRequest {
  contact_info: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
