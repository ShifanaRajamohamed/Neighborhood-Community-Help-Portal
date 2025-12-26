
import { Injectable, signal, computed, inject } from '@angular/core';
import { User, HelpRequest, RequestStatus } from '../../shared/types';
import { BackendService } from '../../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private backend = inject(BackendService);

  // Session State
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  // Data from Backend
  readonly requests = this.backend.getRequests();
  readonly users = this.backend.getUsers();
  readonly systemLogs = this.backend.getSystemLogs();

  // Derived Frontend State
  readonly myRequests = computed(() => {
    const user = this._currentUser();
    const allRequests = this.requests();
    if (!user) return [];
    if (user.role === 'requester') {
      return allRequests.filter(r => r.requesterId === user.id);
    }
    if (user.role === 'helper') {
      return allRequests.filter(r => r.helperId === user.id);
    }
    return [];
  });

  readonly unapprovedHelpers = computed(() => {
    const users = this.users();
    return users.filter(u => u.role === 'helper' && !u.isApproved);
  });

  // Specific filters for Helper Dashboard
  readonly helperAcceptedRequests = computed(() => {
    const user = this._currentUser();
    const reqs = this.requests();
    if (user?.role !== 'helper') return [];
    return reqs.filter(r => r.helperId === user.id && r.status === 'accepted');
  });

  readonly helperInProgressRequests = computed(() => {
    const user = this._currentUser();
    const reqs = this.requests();
    if (user?.role !== 'helper') return [];
    return reqs.filter(r => r.helperId === user.id && r.status === 'in_progress');
  });
  
  readonly helperCompletedRequests = computed(() => {
    const user = this._currentUser();
    const reqs = this.requests();
    if (user?.role !== 'helper') return [];
    return reqs.filter(r => r.helperId === user.id && r.status === 'completed');
  });
  
  readonly availableRequests = computed(() => {
    const user = this._currentUser();
    if (!user || user.role !== 'helper') return [];
    // A helper can't offer on their own request (edge case)
    return this.requests().filter(r => r.status === 'pending' && r.requesterId !== user.id);
  });
  
  readonly stats = computed(() => {
    const reqs = this.requests();
    return {
      total: reqs.length,
      pending: reqs.filter(r => ['pending', 'offered'].includes(r.status)).length,
      active: reqs.filter(r => r.status === 'in_progress' || r.status === 'accepted').length,
      completed: reqs.filter(r => r.status === 'completed').length
    };
  });

  // Actions
  login(email: string, pass: string): boolean {
    const user = this.backend.findUserByCredentials(email, pass);
    if (user) {
      this._currentUser.set(user);
      return true;
    }
    return false;
  }

  logout() {
    this._currentUser.set(null);
  }

  register(user: Omit<User, 'id'>) {
    const newUser = this.backend.createUser(user);
    this._currentUser.set(newUser);
  }

  createRequest(
      title: string, 
      description: string, 
      category: string, 
      isUrgent: boolean, 
      fullAddress: string,
      complexity: 'Low' | 'Medium' | 'High',
      duration: string,
      preferredTime: string
  ) {
    const user = this._currentUser();
    if (!user || user.role !== 'requester') return;
    
    // Simple logic to derive abstract address
    const abstractAddress = fullAddress.split(',').pop()?.trim() || 'Unknown Area';

    const newReq: HelpRequest = {
      id: Math.floor(Math.random() * 10000),
      requesterId: user.id,
      requesterName: user.name,
      helperId: null,
      helperName: null,
      title,
      description,
      category,
      status: 'pending',
      isUrgent,
      createdAt: new Date(),
      fullAddress: fullAddress,
      abstractAddress: abstractAddress,
      offers: [],
      complexity: complexity,
      estimatedDuration: duration,
      preferredTime: preferredTime,
      timeline: [{ status: 'pending', timestamp: new Date(), note: 'Request Created' }]
    };

    this.backend.createRequest(newReq);
  }

  updateRequestStatus(requestId: number, status: RequestStatus) {
    const user = this._currentUser();
    if (!user) return;
    
    const req = this.requests().find(r => r.id === requestId);
    if (!req) return;

    let updates: Partial<HelpRequest> = {};
    const newTimelineEvent = { status: status, timestamp: new Date() };
    const updatedTimeline = [...req.timeline, newTimelineEvent];

    if (status === 'accepted' && user.role === 'helper') {
       // This flow is now handled by acceptOffer
    } else if (status === 'in_progress' && req.helperId === user.id) {
       updates = { status: 'in_progress', timeline: updatedTimeline };
    } else if (status === 'completed' && req.helperId === user.id) {
       updates = { status: 'completed', timeline: updatedTimeline };
    }

    if (Object.keys(updates).length > 0) {
        this.backend.updateRequest(requestId, updates);
    }
  }
  
  deleteRequest(requestId: number) {
    this.backend.deleteRequest(requestId);
  }

  // New Actions for Approval and Offer flow
  approveHelper(helperId: number) {
    if (this.currentUser()?.role !== 'admin') return;
    this.backend.approveHelper(helperId);
  }

  makeOffer(requestId: number) {
    const user = this.currentUser();
    if (!user || user.role !== 'helper' || !user.isApproved) return;
    this.backend.makeOffer(requestId, { helperId: user.id, helperName: user.name });
  }

  acceptOffer(requestId: number, helperId: number) {
    const user = this.currentUser();
    const request = this.requests().find(r => r.id === requestId);
    if (!user || user.role !== 'requester' || user.id !== request?.requesterId) return;
    this.backend.acceptOffer(requestId, helperId);
  }
}
