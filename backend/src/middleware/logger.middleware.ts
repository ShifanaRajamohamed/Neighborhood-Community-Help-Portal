import { Database } from '../config/db';
import { SystemLog } from '../../../shared/types';

export function loggerMiddleware(action: string, details: any) {
  try {
    const db = Database.getInstance();
    const log: SystemLog = {
      id: Date.now(),
      action,
      details: typeof details === 'string' ? details : JSON.stringify(details),
      timestamp: new Date()
    };
    db.logs.push(log);
  } catch (err) {
    // suppress logging errors during development
    console.error('loggerMiddleware error:', err);
  }
}
