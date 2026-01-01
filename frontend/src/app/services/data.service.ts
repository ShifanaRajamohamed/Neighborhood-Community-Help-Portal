
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, HelpRequest, RequestStatus } from '../../shared/types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/api';

  // Session State
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor() {
    // Restore session from localStorage on app initialization
    this.restoreSession();
  }

  // Data from Backend (will be cached locally)
  private _requests = signal<HelpRequest[]>([]);
  private _users = signal<User[]>([]);

  readonly requests = this._requests.asReadonly();
  readonly users = this._users.asReadonly();

  // Derived Frontend State
  readonly myRequests = computed(() => {
    const user = this._currentUser();
    const allRequests = this._requests();
    if (!user) return [];
    if (user.role === 'resident' || user.role === 'requester') {
      return allRequests.filter(r => r.requesterId === user.id);
    }
    if (user.role === 'helper') {
      return allRequests.filter(r => r.helper_id === user.id);
    }
    return [];
  });

  readonly unapprovedHelpers = computed(() => {
    const users = this._users();
    return users.filter(u => u.role === 'helper' && !u.isApproved);
  });

  // Specific filters for Helper Dashboard
  readonly helperAcceptedRequests = computed(() => {
    const user = this._currentUser();
    const reqs = this._requests();
    if (user?.role !== 'helper') return [];
    return reqs.filter(r => r.helper_id === user.id && r.status === 'accepted');
  });

  readonly helperInProgressRequests = computed(() => {
    const user = this._currentUser();
    const reqs = this._requests();
    if (user?.role !== 'helper') return [];
    return reqs.filter(r => r.helper_id === user.id && (r.status === 'in_progress' || r.status === 'In-progress'));
  });

  readonly helperCompletedRequests = computed(() => {
    const user = this._currentUser();
    const reqs = this._requests();
    if (user?.role !== 'helper') return [];
    return reqs.filter(r => r.helper_id === user.id && r.status === 'completed');
  });

  readonly availableRequests = computed(() => {
    const user = this._currentUser();
    if (!user || user.role !== 'helper') return [];
    // A helper can't offer on their own request (edge case)
    return this._requests().filter(r => r.status === 'pending' && r.requesterId !== user.id);
  });

  readonly stats = computed(() => {
    const reqs = this._requests();
    return {
      total: reqs.length,
      pending: reqs.filter(r => ['pending', 'offered'].includes(r.status)).length,
      active: reqs.filter(r => r.status === 'in_progress' || r.status === 'accepted').length,
      completed: reqs.filter(r => r.status === 'completed').length
    };
  });

  // Restore session from localStorage
  private async restoreSession() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._currentUser.set(user);
        // Load fresh data from backend
        await this.loadData();
      } catch (error) {
        console.error('Failed to restore session:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  // Load data from backend
  async loadData() {
    try {
      const [requestsResponse, usersResponse] = await Promise.all([
        firstValueFrom(this.http.get<{ success: boolean, data: HelpRequest[] }>(`${this.apiUrl}/requests`)),
        firstValueFrom(this.http.get<{ success: boolean, data: User[] }>(`${this.apiUrl}/users`))
      ]);
      this._requests.set(requestsResponse.data || []);
      this._users.set(usersResponse.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  // Actions
  async login(contactInfo: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean, data: { user: User, token: string } }>(`${this.apiUrl}/users/login`, { contact_info: contactInfo, password })
      );
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this._currentUser.set(response.data.user);
        await this.loadData(); // Refresh data after login
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this._requests.set([]);
    this._users.set([]);
  }

  async register(user: any): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean, data: { user: User, token: string } }>(`${this.apiUrl}/users/register`, user)
      );
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this._currentUser.set(response.data.user);
        await this.loadData(); // Refresh data after registration
      }
    } catch (error) {
      throw error;
    }
  }

  async createRequest(
    title: string,
    description: string,
    category: string,
    isUrgent: boolean,
    fullAddress: string,
    complexity: 'Low' | 'Medium' | 'High',
    duration: string,
    preferredTime: string
  ): Promise<void> {
    const user = this._currentUser();
    if (!user || user.role !== 'requester') return;

    // Simple logic to derive abstract address
    const abstractAddress = fullAddress.split(',').pop()?.trim() || 'Unknown Area';

    const newReq = {
      resident_id: user.id,
      requester_id: user.id,
      requester_name: user.name,
      title,
      description,
      category,
      status: 'pending',
      full_address: fullAddress,
      abstract_address: abstractAddress,
      is_urgent: isUrgent,
      complexity: complexity,
      estimated_duration: duration,
      preferred_time: preferredTime,
      offers: [],
      timeline: [{ status: 'pending', timestamp: new Date(), note: 'Request Created' }]
    };

    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/requests`, newReq));
      await this.loadData(); // Refresh data after creating request
    } catch (error) {
      throw error;
    }
  }

  async updateRequestStatus(requestId: number, status: RequestStatus): Promise<void> {
    const user = this._currentUser();
    if (!user) {
      console.log('No user logged in');
      return;
    }

    const req = this._requests().find(r => r.id === requestId);
    if (!req) {
      console.log('Request not found:', requestId);
      return;
    }

    console.log('Updating request status:', { requestId, status, userId: user.id, helper_id: req.helper_id, helperId: req.helperId });

    const newTimelineEvent = { status: status, timestamp: new Date() };
    const updatedTimeline = [...(req.timeline || []), newTimelineEvent];

    const updates = {
      status: status,
      timeline: updatedTimeline
    };

    console.log('Sending updates:', updates);

    try {
      await firstValueFrom(this.http.put(`${this.apiUrl}/requests/${requestId}/status`, updates));
      await this.loadData(); // Refresh data after update
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }

  async deleteRequest(requestId: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/requests/${requestId}`));
      await this.loadData(); // Refresh data after deletion
    } catch (error) {
      throw error;
    }
  }

  // New Actions for Approval and Offer flow
  async approveHelper(helperId: number): Promise<void> {
    if (this.currentUser()?.role !== 'admin') return;
    try {
      await firstValueFrom(this.http.put(`${this.apiUrl}/users/${helperId}/approve`, {}));
      await this.loadData(); // Refresh data after approval
    } catch (error) {
      throw error;
    }
  }

  async makeOffer(requestId: number): Promise<void> {
    const user = this.currentUser();
    if (!user || user.role !== 'helper' || !user.isApproved) return;
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/requests/${requestId}/offers`, {
        helperId: user.id,
        helperName: user.name
      }));
      await this.loadData(); // Refresh data after making offer
    } catch (error) {
      throw error;
    }
  }

  async acceptOffer(requestId: number, helperId: number): Promise<void> {
    const user = this.currentUser();
    const request = this._requests().find(r => r.id === requestId);
    if (!user || user.role !== 'requester' || user.id !== request?.requesterId) return;
    try {
      await firstValueFrom(this.http.put(`${this.apiUrl}/requests/${requestId}/accept/${helperId}`, {}));
      await this.loadData(); // Refresh data after accepting offer
    } catch (error) {
      throw error;
    }
  }
}
