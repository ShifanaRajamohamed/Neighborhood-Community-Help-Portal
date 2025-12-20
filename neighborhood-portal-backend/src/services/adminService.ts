import pool from '../config/database';
import { RequestStatus } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface AdminRequestFilters {
  status?: RequestStatus;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

interface AdminRequest extends RowDataPacket {
  id: number;
  resident_id: number;
  helper_id: number | null;
  title: string;
  description: string;
  category: string;
  status: RequestStatus;
  attachments: string | null;
  created_at: Date;
  updated_at: Date;
  resident_name: string;
  resident_contact: string;
  resident_location: string;
  helper_name: string | null;
  helper_contact: string | null;
}

interface DashboardStats {
  total: number;
  pending: number;
  accepted: number;
  in_progress: number;
  completed: number;
  recent_requests: any[];
}

// Get all requests with optional filters
export async function getAllRequests(filters: AdminRequestFilters): Promise<AdminRequest[]> {
  let query = `
      SELECT 
        r.*,
        u1.name as resident_name,
        u1.contact_info as resident_contact,
        u1.location as resident_location,
        u2.name as helper_name,
        u2.contact_info as helper_contact
      FROM help_requests r
      LEFT JOIN users u1 ON r.resident_id = u1.id
      LEFT JOIN users u2 ON r.helper_id = u2.id
      WHERE 1=1
    `;

  const params: any[] = [];

  if (filters.status) {
    query += ' AND r.status = ?';
    params.push(filters.status);
  }

  if (filters.category) {
    query += ' AND r.category = ?';
    params.push(filters.category);
  }

  if (filters.startDate) {
    query += ' AND r.created_at >= ?';
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    query += ' AND r.created_at <= ?';
    params.push(filters.endDate);
  }

  query += ' ORDER BY r.created_at DESC';

  const [rows] = await pool.execute<AdminRequest[]>(query, params);
  return rows;
}

// Get request by ID with full details
export async function getRequestById(id: number): Promise<AdminRequest | null> {
  const query = `
      SELECT 
        r.*,
        u1.name as resident_name,
        u1.contact_info as resident_contact,
        u1.location as resident_location,
        u2.name as helper_name,
        u2.contact_info as helper_contact
      FROM help_requests r
      LEFT JOIN users u1 ON r.resident_id = u1.id
      LEFT JOIN users u2 ON r.helper_id = u2.id
      WHERE r.id = ?
    `;

  const [rows] = await pool.execute<AdminRequest[]>(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

// Update request status (admin override)
export async function updateRequestStatus(
  id: number,
  status: RequestStatus,
  adminId: number,
  helper_id?: number
): Promise<AdminRequest | null> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Build update query
    let query = 'UPDATE help_requests SET status = ?, updated_at = NOW()';
    const params: any[] = [status];

    if (helper_id !== undefined) {
      query += ', helper_id = ?';
      params.push(helper_id);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await connection.execute<ResultSetHeader>(query, params);

    if (result.affectedRows === 0) {
      throw new Error('Request not found');
    }

    // Log admin action (optional audit trail)
    await connection.execute(
      'INSERT INTO admin_logs (admin_id, action, request_id, details) VALUES (?, ?, ?, ?)',
      [adminId, 'status_update', id, JSON.stringify({ status, helper_id })]
    ).catch(() => {
      // Silently fail if admin_logs table doesn't exist
    });

    await connection.commit();

    // Fetch and return updated request
    const updatedRequest = await getRequestById(id);
    return updatedRequest;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  // Get counts by status
  const [statusCounts] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM help_requests
    `);

  // Get recent requests
  const [recentRequests] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        r.id,
        r.title,
        r.status,
        r.created_at,
        u.name as resident_name
      FROM help_requests r
      LEFT JOIN users u ON r.resident_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

  const stats = statusCounts[0];

  return {
    total: Number(stats.total) || 0,
    pending: Number(stats.pending) || 0,
    accepted: Number(stats.accepted) || 0,
    in_progress: Number(stats.in_progress) || 0,
    completed: Number(stats.completed) || 0,
    recent_requests: recentRequests
  };
}

// Archive request (soft delete)
export async function archiveRequest(id: number): Promise<void> {
  // Note: This assumes an 'archived' field exists or you can add it
  // For now, we'll just mark it with a special status or delete it
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM help_requests WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error('Request not found');
  }
}
