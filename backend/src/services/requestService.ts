import pool from '../config/database';
import { HelpRequest, CreateRequestDTO, UpdateRequestStatusDTO, RequestStatus, UserRole } from '../types';
import { AppError } from '../middleware/errorHandler';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
// Helper function to safely parse JSON
function safeJsonParse(value: any): any[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'null') return [];
    try {
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  }
  return [];
}
export class RequestService {
  async createRequest(requestData: CreateRequestDTO): Promise<HelpRequest> {
    const {
      requester_id,
      requester_name,
      title,
      description,
      category,
      attachments,
      full_address,
      abstract_address,
      is_urgent,
      complexity,
      estimated_duration,
      preferred_time,
      offers,
      timeline
    } = requestData;

    const initialTimeline = timeline || [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Request Created' }];
    const initialOffers = offers || [];

    const query = `
      INSERT INTO HelpRequests (
        requester_id, requester_name, title, description, category, status, attachments,
        full_address, abstract_address, is_urgent, complexity, estimated_duration, preferred_time,
        offers, timeline
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      requester_id,
      requester_name || '',
      title,
      description,
      category,
      RequestStatus.PENDING,
      attachments || null,
      full_address || null,
      abstract_address || null,
      is_urgent || false,
      complexity || null,
      estimated_duration || null,
      preferred_time || null,
      JSON.stringify(initialOffers),
      JSON.stringify(initialTimeline)
    ]);

    const requestId = result.insertId;
    return this.getRequestById(requestId);
  }

  async getRequestById(id: number): Promise<HelpRequest> {
    const query = `
      SELECT 
        id, requester_id, requester_name, helper_id, helper_name, 
        title, description, category, status, attachments, created_at,
        full_address, abstract_address, is_urgent, complexity, 
        estimated_duration, preferred_time, offers, timeline
      FROM HelpRequests
      WHERE id = ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      throw new AppError('Request not found', 404);
    }

    const request = rows[0];
    return {
      ...request,
      requesterId: request.requester_id,
      requesterName: request.requester_name,
      helperId: request.helper_id,
      helperName: request.helper_name,
      fullAddress: request.full_address,
      abstractAddress: request.abstract_address,
      isUrgent: request.is_urgent,
      estimatedDuration: request.estimated_duration,
      preferredTime: request.preferred_time,
      offers: safeJsonParse(request.offers),
      timeline: safeJsonParse(request.timeline)
    } as HelpRequest;
  }

  async getAllRequests(filters?: {
    status?: RequestStatus;
    requester_id?: number;
    helper_id?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ requests: HelpRequest[]; total: number }> {
    // Count total matching records first
    let countQuery = `
      SELECT COUNT(*) as total
      FROM HelpRequests
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (filters?.status) {
      countQuery += ' AND status = ?';
      countParams.push(filters.status);
    }

    if (filters?.requester_id) {
      countQuery += ' AND requester_id = ?';
      countParams.push(filters.requester_id);
    }

    if (filters?.helper_id !== undefined) {
      if (filters.helper_id === null) {
        countQuery += ' AND helper_id IS NULL';
      } else {
        countQuery += ' AND helper_id = ?';
        countParams.push(filters.helper_id);
      }
    }

    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, countParams);
    const total = countRows[0].total;

    // Get paginated results
    let query = `
      SELECT 
        id, requester_id, requester_name, helper_id, helper_name, 
        title, description, category, status, attachments, created_at,
        full_address, abstract_address, is_urgent, complexity, 
        estimated_duration, preferred_time, offers, timeline
      FROM HelpRequests
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.requester_id) {
      query += ' AND requester_id = ?';
      params.push(filters.requester_id);
    }

    if (filters?.helper_id !== undefined) {
      if (filters.helper_id === null) {
        query += ' AND helper_id IS NULL';
      } else {
        query += ' AND helper_id = ?';
        params.push(filters.helper_id);
      }
    }

    query += ' ORDER BY created_at DESC';

    // Add pagination - MySQL prepared statements have issues with LIMIT/OFFSET as params
    // So we cast to integers and use string interpolation safely
    const limit = Number(filters?.limit) || 50;
    const offset = Number(filters?.offset) || 0;
    query += ` LIMIT ${Math.floor(limit)} OFFSET ${Math.floor(offset)}`;

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);

    const requests = (rows as any[]).map(request => ({
      ...request,
      requesterId: request.requester_id,
      requesterName: request.requester_name,
      helperId: request.helper_id,
      helperName: request.helper_name,
      fullAddress: request.full_address,
      abstractAddress: request.abstract_address,
      isUrgent: request.is_urgent,
      estimatedDuration: request.estimated_duration,
      preferredTime: request.preferred_time,
      offers: safeJsonParse(request.offers),
      timeline: safeJsonParse(request.timeline)
    }));

    return {
      requests,
      total
    };
  }

  async updateRequestStatus(
    id: number,
    updateData: UpdateRequestStatusDTO,
    userRole: UserRole,
    userId: number
  ): Promise<HelpRequest> {
    const request = await this.getRequestById(id);

    // Validate status transition
    this.validateStatusTransition(request.status, updateData.status);

    // Role-based authorization for status updates
    if (userRole === UserRole.REQUESTER && request.requester_id !== userId) {
      throw new AppError('Only the request creator can perform this action', 403);
    }

    // For helpers updating to in_progress or completed, verify they are the assigned helper
    if (userRole === UserRole.HELPER &&
      (updateData.status === 'in_progress' || updateData.status === 'In-progress' || updateData.status === 'completed') &&
      request.helper_id !== userId) {
      throw new AppError('Only the assigned helper can perform this action', 403);
    }

    if (userRole === UserRole.HELPER && updateData.status === RequestStatus.ACCEPTED && !updateData.helper_id) {
      updateData.helper_id = userId;
    }

    // Update timeline
    const currentTimeline = request.timeline || [];
    const newTimelineEvent = {
      status: updateData.status,
      timestamp: new Date().toISOString(),
      note: updateData.timeline?.[0]?.note || `Status changed to ${updateData.status}`
    };
    const updatedTimeline = [...currentTimeline, newTimelineEvent];

    const query = `
      UPDATE HelpRequests
      SET status = ?, helper_id = ?, helper_name = ?, timeline = ?
      WHERE id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      updateData.status,
      updateData.helper_id !== undefined ? updateData.helper_id : request.helper_id,
      updateData.helper_name || request.helper_name,
      JSON.stringify(updatedTimeline),
      id
    ]);

    if (result.affectedRows === 0) {
      throw new AppError('Request not found', 404);
    }

    return this.getRequestById(id);
  }

  async makeOffer(requestId: number, helperId: number, helperName: string): Promise<HelpRequest> {
    const request = await this.getRequestById(requestId);

    if (request.status !== RequestStatus.PENDING && request.status !== 'pending') {
      throw new AppError('Can only make offers on pending requests', 400);
    }

    const currentOffers = request.offers || [];

    // Check if helper already made an offer
    if (currentOffers.some(offer => offer.helperId === helperId)) {
      throw new AppError('You have already made an offer on this request', 400);
    }

    const newOffer = {
      helperId,
      helperName,
      offeredAt: new Date().toISOString()
    };

    const updatedOffers = [...currentOffers, newOffer];

    const query = `
      UPDATE HelpRequests
      SET offers = ?, status = ?
      WHERE id = ?
    `;

    await pool.execute<ResultSetHeader>(query, [
      JSON.stringify(updatedOffers),
      'offered',
      requestId
    ]);

    return this.getRequestById(requestId);
  }

  async acceptOffer(requestId: number, helperId: number, _requesterName: string): Promise<HelpRequest> {
    const request = await this.getRequestById(requestId);

    const offers = request.offers || [];
    const selectedOffer = offers.find(offer => offer.helperId === helperId);

    if (!selectedOffer) {
      throw new AppError('Offer not found', 404);
    }

    // Update timeline
    const currentTimeline = request.timeline || [];
    const newTimelineEvent = {
      status: 'accepted',
      timestamp: new Date().toISOString(),
      note: `Offer accepted from ${selectedOffer.helperName}`
    };
    const updatedTimeline = [...currentTimeline, newTimelineEvent];

    const query = `
      UPDATE HelpRequests
      SET status = ?, helper_id = ?, helper_name = ?, timeline = ?
      WHERE id = ?
    `;

    await pool.execute<ResultSetHeader>(query, [
      'accepted',
      helperId,
      selectedOffer.helperName,
      JSON.stringify(updatedTimeline),
      requestId
    ]);

    return this.getRequestById(requestId);
  }

  async deleteRequest(id: number, userId: number, userRole: UserRole): Promise<void> {
    const request = await this.getRequestById(id);

    // Only the requester or admin can delete
    if (userRole !== UserRole.ADMIN && request.requester_id !== userId) {
      throw new AppError('Only the request creator or admin can delete this request', 403);
    }

    const query = `DELETE FROM HelpRequests WHERE id = ?`;
    const [result] = await pool.execute<ResultSetHeader>(query, [id]);

    if (result.affectedRows === 0) {
      throw new AppError('Request not found', 404);
    }
  }

  private validateStatusTransition(currentStatus: RequestStatus | string, newStatus: RequestStatus | string): void {
    const validTransitions: Record<string, string[]> = {
      'pending': ['accepted', 'offered'],
      'offered': ['accepted'],
      'accepted': ['in_progress', 'In-progress', 'pending'],
      'in_progress': ['completed'],
      'In-progress': ['completed'],
      'completed': []
    };

    const currentStatusKey = currentStatus.toLowerCase();
    const newStatusKey = newStatus.toLowerCase();

    if (!validTransitions[currentStatusKey] || !validTransitions[currentStatusKey].map(s => s.toLowerCase()).includes(newStatusKey)) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400
      );
    }
  }
}
