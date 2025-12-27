export type UserRole = 'resident' | 'helper' | 'requester' | 'admin';

export interface User {
  id: number;
  name: string;
  contact_info: string;
  location: string;
  role: UserRole;
  password?: string;
  created_at: string;
  isApproved?: boolean;
  email?: string;
  requesterId?: number;
  requesterName?: string;
  fullAddress?: string;
  abstractAddress?: string;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'In-progress' | 'Completed' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'offered';

export interface HelpRequestOffer {
  helperId: number;
  helperName: string;
  offeredAt?: Date;
}

export interface TimelineEvent {
  status: RequestStatus;
  timestamp: Date;
  note?: string;
}

export interface HelpRequest {
  id: number;
  resident_id?: number;
  helper_id: number | null;
  helperId?: number | null;
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  attachments?: string; // file path/URL, optional
  created_at: string;
  requesterId?: number;
  requesterName?: string;
  helperName?: string;
  offers?: HelpRequestOffer[];
  timeline?: TimelineEvent[];
  isUrgent?: boolean;
  createdAt?: Date;
  fullAddress?: string;
  abstractAddress?: string;
  complexity?: 'Low' | 'Medium' | 'High';
  estimatedDuration?: string;
  preferredTime?: string;
}
