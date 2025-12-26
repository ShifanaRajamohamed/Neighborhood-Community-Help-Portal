import { Database } from '../config/db';
import { HelpRequest, RequestStatus, HelpRequestOffer } from '../../../shared/types';

export class RequestController {
  private db = Database.getInstance();

  getAll(): HelpRequest[] {
    return this.db.requests;
  }

  create(requestData: HelpRequest): void {
    // Simulate SQL: INSERT INTO help_requests ...
    this.db.requests.unshift(requestData);
  }

  update(id: number, updates: Partial<HelpRequest>): void {
    // Simulate SQL: UPDATE help_requests SET ... WHERE id = ?
    const request = this.db.requests.find(r => r.id === id);
    if (request) {
      Object.assign(request, updates);
    }
  }

  delete(id: number): void {
    // Simulate SQL: DELETE FROM help_requests WHERE id = ?
    const index = this.db.requests.findIndex(r => r.id === id);
    if (index !== -1) {
      this.db.requests.splice(index, 1);
    }
  }

  makeOffer(requestId: number, offer: HelpRequestOffer): void {
    const request = this.db.requests.find(r => r.id === requestId && r.status === 'pending');
    if (request) {
      // Avoid duplicate offers from same helper
      if (request.offers.some(o => o.helperId === offer.helperId)) {
        return;
      }
      const newTimelineEvent = { 
        status: 'offered' as RequestStatus, 
        timestamp: new Date(), 
        note: `Offer from ${offer.helperName}` 
      };
      request.status = 'offered';
      request.offers.push(offer);
      request.timeline.push(newTimelineEvent);
    }
  }

  acceptOffer(requestId: number, helperId: number): void {
    const request = this.db.requests.find(r => r.id === requestId && r.status === 'offered');
    if (request) {
      const acceptedOffer = request.offers.find(o => o.helperId === helperId);
      if (acceptedOffer) {
        const newTimelineEvent = { 
          status: 'accepted' as RequestStatus, 
          timestamp: new Date(), 
          note: `Accepted ${acceptedOffer.helperName}` 
        };
        request.status = 'accepted';
        request.helperId = acceptedOffer.helperId;
        request.helperName = acceptedOffer.helperName;
        request.offers = []; // Clear offers once one is accepted
        request.timeline.push(newTimelineEvent);
      }
    }
  }
}
