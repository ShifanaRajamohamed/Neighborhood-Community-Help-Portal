import { RequestService } from '../services/request.service';
import { HelpRequest, HelpRequestOffer } from '../../../shared/types';

export class RequestController {
  constructor(private requestService: RequestService) {}

  async getAll(): Promise<HelpRequest[]> {
    return this.requestService.getAllRequests();
  }

  async create(requestData: Omit<HelpRequest, 'id' | 'created_at' | 'offers' | 'timeline'>): Promise<HelpRequest> {
    const newRequest = {
      ...requestData,
      id: Math.floor(Math.random() * 10000) + 100,
      created_at: new Date().toISOString(),
      offers: [],
      timeline: [{
        status: requestData.status || 'Pending',
        timestamp: new Date(),
        note: 'Request Created'
      }]
    };
    return this.requestService.createRequest(newRequest);
  }

  async update(id: number, updates: Partial<HelpRequest>): Promise<HelpRequest | null> {
    return this.requestService.updateRequest(id, updates);
  }

  async delete(id: number): Promise<boolean> {
    return this.requestService.deleteRequest(id);
  }

  async makeOffer(requestId: number, offer: HelpRequestOffer): Promise<void> {
    return this.requestService.makeOffer(requestId, offer);
  }

  async acceptOffer(requestId: number, helperId: number): Promise<void> {
    return this.requestService.acceptOffer(requestId, helperId);
  }
}
