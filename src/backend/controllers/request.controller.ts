
import { Database } from '../config/db';
import { HelpRequest, RequestStatus, HelpRequestOffer } from '../../shared/types';

export class RequestController {
  private db = Database.getInstance();

  getAll() {
    return this.db.requests.asReadonly();
  }

  create(requestData: HelpRequest) {
    // Simulate SQL: INSERT INTO help_requests ...
    this.db.requests.update(reqs => [requestData, ...reqs]);
  }

  update(id: number, updates: Partial<HelpRequest>) {
    // Simulate SQL: UPDATE help_requests SET ... WHERE id = ?
    this.db.requests.update(reqs => reqs.map(r => {
      if (r.id !== id) return r;
      return { ...r, ...updates };
    }));
  }

  delete(id: number) {
    // Simulate SQL: DELETE FROM help_requests WHERE id = ?
    this.db.requests.update(reqs => reqs.filter(r => r.id !== id));
  }

  makeOffer(requestId: number, offer: HelpRequestOffer) {
    this.db.requests.update(reqs => reqs.map(r => {
      if (r.id === requestId && r.status === 'pending') {
        // Avoid duplicate offers from same helper
        if (r.offers.some(o => o.helperId === offer.helperId)) {
          return r;
        }
        const newTimelineEvent = { status: 'offered' as RequestStatus, timestamp: new Date(), note: `Offer from ${offer.helperName}` };
        return { ...r, status: 'offered', offers: [...r.offers, offer], timeline: [...r.timeline, newTimelineEvent] };
      }
      return r;
    }));
  }

  acceptOffer(requestId: number, helperId: number) {
     this.db.requests.update(reqs => reqs.map(r => {
      if (r.id === requestId && r.status === 'offered') {
        const acceptedOffer = r.offers.find(o => o.helperId === helperId);
        if (acceptedOffer) {
            const newTimelineEvent = { status: 'accepted' as RequestStatus, timestamp: new Date(), note: `Accepted ${acceptedOffer.helperName}` };
            return { 
                ...r, 
                status: 'accepted', 
                helperId: acceptedOffer.helperId, 
                helperName: acceptedOffer.helperName,
                offers: [], // Clear offers once one is accepted
                timeline: [...r.timeline, newTimelineEvent]
            };
        }
      }
      return r;
    }));
  }
}
