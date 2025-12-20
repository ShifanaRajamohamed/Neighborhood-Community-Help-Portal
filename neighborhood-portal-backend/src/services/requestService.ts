import pool from '../config/database';
import { HelpRequest, CreateRequestDTO, UpdateRequestStatusDTO, RequestStatus, UserRole } from '../types';
import { AppError } from '../middleware/errorHandler';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class RequestService {
  async createRequest(requestData: CreateRequestDTO): Promise<HelpRequest> {
    const { resident_id, title, description, category, attachments } = requestData;

    const query = `
      INSERT INTO HelpRequests (resident_id, title, description, category, status, attachments)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      resident_id,
      title,
      description,
      category,
      RequestStatus.PENDING,
      attachments || null
    ]);

    const requestId = result.insertId;
    return this.getRequestById(requestId);
  }

  async getRequestById(id: number): Promise<HelpRequest> {
    const query = `
      SELECT id, resident_id, helper_id, title, description, category, status, attachments, created_at
      FROM HelpRequests
      WHERE id = ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      throw new AppError('Request not found', 404);
    }

    return rows[0] as HelpRequest;
  }

  async getAllRequests(filters?: { status?: RequestStatus; resident_id?: number; helper_id?: number }): Promise<HelpRequest[]> {
    let query = `
      SELECT id, resident_id, helper_id, title, description, category, status, attachments, created_at
      FROM HelpRequests
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.resident_id) {
      query += ' AND resident_id = ?';
      params.push(filters.resident_id);
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

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows as HelpRequest[];
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
    if (userRole === UserRole.RESIDENT && request.resident_id !== userId) {
      throw new AppError('Only the request creator can perform this action', 403);
    }

    if (userRole === UserRole.HELPER && updateData.status === RequestStatus.ACCEPTED && !updateData.helper_id) {
      updateData.helper_id = userId;
    }

    const query = `
      UPDATE HelpRequests
      SET status = ?, helper_id = ?
      WHERE id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      updateData.status,
      updateData.helper_id !== undefined ? updateData.helper_id : request.helper_id,
      id
    ]);

    if (result.affectedRows === 0) {
      throw new AppError('Request not found', 404);
    }

    return this.getRequestById(id);
  }

  private validateStatusTransition(currentStatus: RequestStatus, newStatus: RequestStatus): void {
    const validTransitions: Record<RequestStatus, RequestStatus[]> = {
      [RequestStatus.PENDING]: [RequestStatus.ACCEPTED],
      [RequestStatus.ACCEPTED]: [RequestStatus.IN_PROGRESS, RequestStatus.PENDING],
      [RequestStatus.IN_PROGRESS]: [RequestStatus.COMPLETED],
      [RequestStatus.COMPLETED]: []
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400
      );
    }
  }
}
