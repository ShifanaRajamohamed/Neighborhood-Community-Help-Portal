
import { Database } from '../config/db';

export const loggerMiddleware = (action: string, payload?: any) => {
    const timestamp = new Date();
    // In a real app we might still console log:
    // console.log(`[SERVER LOG ${timestamp.toISOString()}] Action: ${action}`, payload ? payload : '');

    const db = Database.getInstance();
    
    // Create new log entry
    const newLog = {
        id: Date.now() + Math.random(), // Simple unique ID
        action: action,
        details: payload ? JSON.stringify(payload) : '',
        timestamp: timestamp
    };

    // Update the signal to include the new log at the beginning (newest first)
    db.logs.update(logs => [newLog, ...logs]);
};
