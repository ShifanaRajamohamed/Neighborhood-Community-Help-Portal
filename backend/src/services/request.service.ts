import { RequestRepository } from '../repositories/request.repository';
import { HelpRequest, RequestStatus, HelpRequestOffer, TimelineEvent } from '../../../shared/types';
import { Validators } from '../utils/validators';

export class RequestService {
  constructor(private requestRepository: RequestRepository) {}

  async getAllRequests(): Promise<HelpRequest[]> {
    return this.requestRepository.findAll();
  }

  async getRequestById(id: number): Promise<HelpRequest | null> {
    return this.requestRepository.findById(id);
  }

  async getRequestsByResident(residentId: number): Promise<HelpRequest[]> {
    return this.requestRepository.findByResidentId(residentId);
  }

  async getAvailableRequests(): Promise<HelpRequest[]> {
    return this.requestRepository.findAvailable();
  }

  async createRequest(requestData: Omit<HelpRequest, 'id'>, residentId?: number): Promise<HelpRequest> {
    // Business logic: validate resident can create requests
    const request: Omit<HelpRequest, 'id'> = {
      ...requestData,
      resident_id: residentId || requestData.resident_id,
      status: requestData.status || 'Pending',
      created_at: requestData.created_at || new Date().toISOString()
    };

    return this.requestRepository.create(request);
  }

  async updateRequest(id: number, updates: Partial<HelpRequest>): Promise<HelpRequest | null> {
    return this.requestRepository.update(id, updates);
  }

  async acceptRequest(requestId: number, helperId: number): Promise<HelpRequest | null> {
    const request = await this.requestRepository.findById(requestId);
    if (!request || request.status !== 'Pending') {
      throw new Error('Request not found or not available');
    }

    if (!Validators.isValidStatusTransition(request.status, 'Accepted')) {
      throw new Error('Invalid status transition');
    }

    return this.requestRepository.update(requestId, {
      status: 'Accepted',
      helper_id: helperId
    });
  }

  async updateRequestStatus(requestId: number, newStatus: RequestStatus, userId: number, userRole: string): Promise<HelpRequest | null> {
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Authorization checks
    if (userRole === 'Resident' && request.resident_id !== userId) {
      throw new Error('Unauthorized');
    }
    if (userRole === 'Helper' && request.helper_id !== userId) {
      throw new Error('Unauthorized');
    }

    if (!Validators.isValidStatusTransition(request.status, newStatus)) {
      throw new Error('Invalid status transition');
    }

    return this.requestRepository.update(requestId, { status: newStatus });
  }

  async deleteRequest(requestId: number, userId: number, userRole: string): Promise<boolean> {
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Only resident who created the request can delete it
    if (userRole !== 'Resident' || request.resident_id !== userId) {
      throw new Error('Unauthorized');
    }

    return this.requestRepository.delete(requestId);
  }

  async makeOffer(requestId: number, offer: HelpRequestOffer): Promise<void> {
    const request = await this.requestRepository.findById(requestId);
    if (!request || (request.status !== 'Pending' && request.status !== 'pending')) {
      throw new Error('Request not found or not available for offers');
    }

    // Avoid duplicate offers from same helper
    if (request.offers?.some(o => o.helperId === offer.helperId)) {
      return;
    }

    const offers = request.offers || [];
    const timeline = request.timeline || [];

    const newTimelineEvent: TimelineEvent = {
      status: 'offered',
      timestamp: new Date(),
      note: `Offer from ${offer.helperName}`
    };

    const updates: Partial<HelpRequest> = {
      status: 'offered',
      offers: [...offers, offer],
      timeline: [...timeline, newTimelineEvent]
    };

    await this.requestRepository.update(requestId, updates);
  }

  async acceptOffer(requestId: number, helperId: number): Promise<void> {
    const request = await this.requestRepository.findById(requestId);
    if (!request || request.status !== 'offered') {
      throw new Error('Request not found or not available for acceptance');
    }

    const acceptedOffer = request.offers?.find(o => o.helperId === helperId);
    if (!acceptedOffer) {
      throw new Error('Offer not found');
    }

    const timeline = request.timeline || [];
    const newTimelineEvent: TimelineEvent = {
      status: 'accepted',
      timestamp: new Date(),
      note: `Accepted ${acceptedOffer.helperName}`
    };

    const updates: Partial<HelpRequest> = {
      status: 'accepted',
      helper_id: acceptedOffer.helperId,
      helperName: acceptedOffer.helperName,
      offers: [], // Clear offers once one is accepted
      timeline: [...timeline, newTimelineEvent]
    };

    await this.requestRepository.update(requestId, updates);
  }
}
