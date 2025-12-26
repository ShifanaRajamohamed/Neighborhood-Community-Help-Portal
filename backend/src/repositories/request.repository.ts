import { Database } from '../config/db';
import { HelpRequest } from '../../../shared/types';

export class RequestRepository {
  private db = Database.getInstance();

  async findAll(): Promise<HelpRequest[]> {
    return Promise.resolve(this.db.requests);
  }

  async findById(id: number): Promise<HelpRequest | null> {
    const request = this.db.requests.find(r => r.id === id);
    return Promise.resolve(request || null);
  }

  async findByResidentId(residentId: number): Promise<HelpRequest[]> {
    const requests = this.db.requests.filter(r => r.resident_id === residentId);
    return Promise.resolve(requests);
  }

  async findByHelperId(helperId: number): Promise<HelpRequest[]> {
    const requests = this.db.requests.filter(r => r.helper_id === helperId);
    return Promise.resolve(requests);
  }

  async findAvailable(): Promise<HelpRequest[]> {
    const requests = this.db.requests.filter(r => r.status === 'Pending');
    return Promise.resolve(requests);
  }

  async create(requestData: Omit<HelpRequest, 'id'>): Promise<HelpRequest> {
    const newId = Math.max(...this.db.requests.map(r => r.id), 0) + 1;
    const newRequest: HelpRequest = { id: newId, ...requestData };
    this.db.requests.push(newRequest);
    return Promise.resolve(newRequest);
  }

  async update(id: number, updates: Partial<HelpRequest>): Promise<HelpRequest | null> {
    const requestIndex = this.db.requests.findIndex(r => r.id === id);
    if (requestIndex === -1) return Promise.resolve(null);
    this.db.requests[requestIndex] = { ...this.db.requests[requestIndex], ...updates };
    return Promise.resolve(this.db.requests[requestIndex]);
  }

  async delete(id: number): Promise<boolean> {
    const requestIndex = this.db.requests.findIndex(r => r.id === id);
    if (requestIndex === -1) return Promise.resolve(false);
    this.db.requests.splice(requestIndex, 1);
    return Promise.resolve(true);
  }
}
