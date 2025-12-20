import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HelpRequest, CreateRequestDTO, UpdateRequestStatusDTO, ApiResponse, RequestStatus } from '../../shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) { }

  createRequest(requestData: CreateRequestDTO): Observable<ApiResponse<HelpRequest>> {
    return this.http.post<ApiResponse<HelpRequest>>(this.apiUrl, requestData);
  }

  getRequests(filters?: {
    status?: RequestStatus;
    resident_id?: number;
    helper_id?: number | null;
  }): Observable<ApiResponse<HelpRequest[]>> {
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.resident_id) {
      params = params.set('resident_id', filters.resident_id.toString());
    }
    if (filters?.helper_id !== undefined) {
      params = params.set('helper_id', filters.helper_id === null ? 'null' : filters.helper_id.toString());
    }

    // Backend now returns paginated response with { data: [...], meta: {...} }
    // We keep the interface the same for backward compatibility
    return this.http.get<ApiResponse<HelpRequest[]>>(this.apiUrl, { params });
  }

  getRequestById(id: number): Observable<ApiResponse<HelpRequest>> {
    return this.http.get<ApiResponse<HelpRequest>>(`${this.apiUrl}/${id}`);
  }

  updateRequestStatus(id: number, statusUpdate: UpdateRequestStatusDTO): Observable<ApiResponse<HelpRequest>> {
    return this.http.put<ApiResponse<HelpRequest>>(
      `${this.apiUrl}/${id}/status`,
      statusUpdate
    );
  }

  acceptRequest(id: number): Observable<ApiResponse<HelpRequest>> {
    return this.updateRequestStatus(id, { status: RequestStatus.ACCEPTED });
  }

  startProgress(id: number): Observable<ApiResponse<HelpRequest>> {
    return this.updateRequestStatus(id, { status: RequestStatus.IN_PROGRESS });
  }

  completeRequest(id: number): Observable<ApiResponse<HelpRequest>> {
    return this.updateRequestStatus(id, { status: RequestStatus.COMPLETED });
  }
}
