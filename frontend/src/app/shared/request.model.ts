import { HelpRequest, RequestStatus } from '../../../../shared/types';

export { HelpRequest, RequestStatus };

export interface CreateRequestRequest {
  title: string;
  description: string;
  category: string;
  attachments?: string;
}

export interface UpdateRequestStatusRequest {
  status: RequestStatus;
}
