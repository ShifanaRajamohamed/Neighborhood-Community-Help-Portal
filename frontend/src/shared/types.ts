export type UserRole = 'requester' | 'helper' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string; // Used as contact
  role: UserRole;
  password?: string;
  fullAddress: string;
  abstractAddress: string;
  isApproved: boolean; // For helpers
}

export type RequestStatus = 'pending' | 'offered' | 'accepted' | 'in_progress' | 'completed';

export interface HelpRequestOffer {
  helperId: number;
  helperName: string;
}

export interface TimelineEvent {
  status: RequestStatus;
  timestamp: Date;
  note?: string;
}

export interface HelpRequest {
  id: number;
  requesterId: number;
  requesterName: string;
  helperId: number | null;
  helperName: string | null;
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  isUrgent: boolean;
  createdAt: Date;
  fullAddress: string;
  abstractAddress: string;
  offers: HelpRequestOffer[];
  complexity: 'Low' | 'Medium' | 'High';
  estimatedDuration: string;
  preferredTime: string;
  timeline: TimelineEvent[];
}

export interface SystemLog {
  id: number;
  action: string;
  details: string;
  timestamp: Date;
}
