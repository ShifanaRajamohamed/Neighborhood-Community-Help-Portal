export enum UserRole {
  RESIDENT = 'resident',
  HELPER = 'helper',
  ADMIN = 'admin'
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface User {
  id: number;
  name: string;
  contact_info: string;
  location: string;
  role: UserRole;
  password?: string;
  created_at: Date;
}

export interface HelpRequest {
  id: number;
  resident_id: number;
  helper_id: number | null;
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  attachments: string | null;
  created_at: Date;
}

export interface CreateUserDTO {
  name: string;
  contact_info: string;
  location: string;
  role: UserRole;
  password: string;
}

export interface CreateRequestDTO {
  resident_id: number;
  title: string;
  description: string;
  category: string;
  attachments?: string;
}

export interface UpdateRequestStatusDTO {
  status: RequestStatus;
  helper_id?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
