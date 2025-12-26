import { Injectable, signal } from '@angular/core';
import { User, HelpRequest, SystemLog, HelpRequestOffer } from '../shared/types';

const API_BASE = 'http://localhost:3001/api';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private _requests = signal<HelpRequest[]>([]);
  private _users = signal<User[]>([]);
  private _logs = signal<SystemLog[]>([]);

  constructor() {
    this.refreshAll();
    // Poll backend periodically to keep UI in sync with other clients
    setInterval(() => this.refreshAll(), 2000);
  }

  getRequests() {
    return this._requests;
  }

  getUsers() {
    return this._users;
  }

  getSystemLogs() {
    return this._logs;
  }

  async refreshAll() {
    try {
      const [reqRes, userRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/requests`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/logs`)
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        // ensure dates are deserialized
        data.forEach((r: any) => r.createdAt = new Date(r.createdAt));
        this._requests.set(data);
      }

      if (userRes.ok) {
        const data = await userRes.json();
        this._users.set(data);
      }

      if (logRes.ok) {
        const data = await logRes.json();
        data.forEach((l: any) => l.timestamp = new Date(l.timestamp));
        this._logs.set(data);
      }
    } catch (e) {
      // network errors - ignore for now
      console.warn('BackendService refresh failed', e);
    }
  }

  // Synchronous helpers used by DataService
  findUserByCredentials(email: string, pass: string): User | undefined {
    return this._users().find(u => u.email === email && u.password === pass);
  }

  createUser(user: Omit<User, 'id'>): User {
    const id = Math.max(0, ...this._users().map(u => u.id)) + 1;
    const newUser: User = { id, ...user } as User;
    this._users.update(prev => [...prev, newUser]);
    // POST to real backend if available
    fetch(`${API_BASE}/users/register`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(user)}).catch(()=>{});
    return newUser;
  }

  createRequest(req: HelpRequest) {
    this._requests.update(prev => [...prev, req]);
    fetch(`${API_BASE}/requests`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(req)})
      .catch(()=>{})
      .finally(() => this.refreshAll());
  }

  updateRequest(requestId: number, updates: Partial<HelpRequest>) {
    this._requests.update(prev => prev.map(r => r.id === requestId ? { ...r, ...updates } as HelpRequest : r));
    fetch(`${API_BASE}/requests/${requestId}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updates)})
      .catch(()=>{})
      .finally(() => this.refreshAll());
  }

  deleteRequest(requestId: number) {
    this._requests.update(prev => prev.filter(r => r.id !== requestId));
    fetch(`${API_BASE}/requests/${requestId}`, { method: 'DELETE' })
      .catch(()=>{})
      .finally(() => this.refreshAll());
  }

  approveHelper(helperId: number) {
    this._users.update(prev => prev.map(u => u.id === helperId ? { ...u, isApproved: true } : u));
    fetch(`${API_BASE}/users/${helperId}/approve`, { method: 'PUT' })
      .catch(()=>{})
      .finally(() => this.refreshAll());
  }

  makeOffer(requestId: number, offer: HelpRequestOffer) {
    this._requests.update(prev => prev.map(r => r.id === requestId ? { ...r, offers: [...r.offers, offer] } : r));
    fetch(`${API_BASE}/requests/${requestId}/offers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(offer)})
      .catch(()=>{})
      .finally(() => this.refreshAll());
  }

  acceptOffer(requestId: number, helperId: number) {
    const helper = this._users().find(u => u.id === helperId);
    this._requests.update(prev => prev.map(r => r.id === requestId ? { ...r, helperId, helperName: helper?.name || null, status: 'accepted' } as HelpRequest : r));
    fetch(`${API_BASE}/requests/${requestId}/accept/${helperId}`, { method: 'PUT' })
      .catch(()=>{})
      .finally(() => this.refreshAll());
  }
}
