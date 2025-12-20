import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelpRequest, RequestStatus } from '../../shared/models/types';
import { environment } from '../../../environments/environment';

export interface AdminRequestFilters {
  status?: RequestStatus;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminDashboardStats {
  total: number;
  pending: number;
  accepted: number;
  in_progress: number;
  completed: number;
  recent_requests: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // Get dashboard statistics
  getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.apiUrl}/stats`);
  }

  // Get all requests with filters
  getAllRequests(filters?: AdminRequestFilters): Observable<ApiResponse<HelpRequest[]>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }

    return this.http.get<ApiResponse<HelpRequest[]>>(`${this.apiUrl}/requests`, { params });
  }

  // Get request by ID
  getRequestById(id: number): Observable<ApiResponse<HelpRequest>> {
    return this.http.get<ApiResponse<HelpRequest>>(`${this.apiUrl}/requests/${id}`);
  }

  // Update request status
  updateRequestStatus(
    id: number,
    status: RequestStatus,
    helper_id?: number
  ): Observable<ApiResponse<HelpRequest>> {
    return this.http.put<ApiResponse<HelpRequest>>(
      `${this.apiUrl}/requests/${id}/status`,
      { status, helper_id }
    );
  }

  // Archive request
  archiveRequest(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/requests/${id}`);
  }
}
