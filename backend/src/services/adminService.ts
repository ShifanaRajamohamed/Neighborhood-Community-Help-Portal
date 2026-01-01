import pool from '../config/database';
import { RequestStatus } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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

interface AdminRequestFilters {
  status?: RequestStatus;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

interface AdminRequest extends RowDataPacket {
  id: number;
  resident_id: number;
  requester_id: number;
  requester_name: string;
  helper_id: number | null;
  helper_name: string | null;
  title: string;
  description: string;
  category: string;
  status: RequestStatus | string;
  attachments: string | null;
  full_address: string | null;
  abstract_address: string | null;
  is_urgent: boolean;
  complexity: string | null;
  estimated_duration: string | null;
  preferred_time: string | null;
  offers: string | null | any[];
  timeline: string | null | any[];
  created_at: Date;
  updated_at: Date;
  resident_name: string;
  resident_contact: string;
  resident_location: string;
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
      FROM HelpRequests r
      LEFT JOIN Users u1 ON r.resident_id = u1.id
      LEFT JOIN Users u2 ON r.helper_id = u2.id
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

  // Parse JSON fields
  return rows.map(row => ({
    ...row,
    offers: safeJsonParse(row.offers),
    timeline: safeJsonParse(row.timeline)
  })) as any as AdminRequest[];
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
      FROM HelpRequests r
      LEFT JOIN Users u1 ON r.resident_id = u1.id
      LEFT JOIN Users u2 ON r.helper_id = u2.id
      WHERE r.id = ?
    `;

  const [rows] = await pool.execute<AdminRequest[]>(query, [id]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    ...row,
    offers: safeJsonParse(row.offers),
    timeline: safeJsonParse(row.timeline)
  } as any as AdminRequest;
}

// Update request status (admin override)
export async function updateRequestStatus(
  id: number,
  status: RequestStatus | string,
  adminId: number,
  helper_id?: number,
  helper_name?: string
): Promise<AdminRequest | null> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get current request to update timeline
    const currentRequest = await getRequestById(id);
    if (!currentRequest) {
      throw new Error('Request not found');
    }

    const currentTimeline = currentRequest.timeline ?
      (typeof currentRequest.timeline === 'string' ? JSON.parse(currentRequest.timeline) : currentRequest.timeline) : [];

    const newTimelineEvent = {
      status: status,
      timestamp: new Date().toISOString(),
      note: `Admin override: Status changed to ${status}`
    };
    const updatedTimeline = [...currentTimeline, newTimelineEvent];

    // Build update query
    let query = 'UPDATE HelpRequests SET status = ?, timeline = ?, updated_at = NOW()';
    const params: any[] = [status, JSON.stringify(updatedTimeline)];

    if (helper_id !== undefined) {
      query += ', helper_id = ?, helper_name = ?';
      params.push(helper_id, helper_name || null);
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
      SUM(CASE WHEN status IN ('pending', 'Pending') THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status IN ('accepted', 'Accepted') THEN 1 ELSE 0 END) as accepted,
      SUM(CASE WHEN status IN ('in_progress', 'In-progress') THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status IN ('completed', 'Completed') THEN 1 ELSE 0 END) as completed
    FROM HelpRequests
  `);

  // Get recent requests
  const [recentRequests] = await pool.execute<RowDataPacket[]>(`
    SELECT 
      r.id,
      r.title,
      r.status,
      r.created_at,
      u.name as resident_name,
      r.requester_name
    FROM HelpRequests r
    LEFT JOIN Users u ON r.resident_id = u.id
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
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM HelpRequests WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error('Request not found');
  }
}
