export enum UserRole {
  RESIDENT = 'resident',
  HELPER = 'helper',
  ADMIN = 'admin',
  REQUESTER = 'requester'
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OFFERED = 'offered'
}

export interface HelpRequestOffer {
  helperId: number;
  helperName: string;
  offeredAt?: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
}

export interface User {
  id: number;
  name: string;
  contact_info: string;
  email?: string;
  location: string;
  full_address?: string;
  abstract_address?: string;
  role: UserRole;
  password?: string;
  is_approved?: boolean;
  isApproved?: boolean;
  created_at: Date;
}

export interface HelpRequest {
  id: number;
  resident_id: number;
  requester_id?: number;
  requester_name?: string;
  requesterId?: number;
  requesterName?: string;
  helper_id: number | null;
  helperId?: number | null;
  helper_name?: string | null;
  helperName?: string | null;
  title: string;
  description: string;
  category: string;
  status: RequestStatus | string;
  attachments: string | null;
  full_address?: string;
  fullAddress?: string;
  abstract_address?: string;
  abstractAddress?: string;
  is_urgent?: boolean;
  isUrgent?: boolean;
  complexity?: 'Low' | 'Medium' | 'High';
  estimated_duration?: string;
  estimatedDuration?: string;
  preferred_time?: string;
  preferredTime?: string;
  offers?: HelpRequestOffer[];
  timeline?: TimelineEvent[];
  created_at: Date;
  createdAt?: Date;
}
