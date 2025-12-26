
import { Injectable } from '@angular/core';
import { User, HelpRequest, RequestStatus, HelpRequestOffer } from '../shared/types';
import { userController, requestController } from './routes/api.routes';
import { loggerMiddleware } from './middleware/logger.middleware';

/**
 * BackendService
 * 
 * In this architecture, this Service acts as the "Node.js Server Instance".
 * It receives calls from the Frontend (DataService), logs them via Middleware,
 * and delegates execution to the appropriate Controller.
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  // --- API Endpoints Simulation ---

  // Users API
  getUsers() {
    return userController.getAll();
  }

  findUserByCredentials(email: string, pass: string): User | undefined {
    loggerMiddleware('LOGIN_ATTEMPT', { email });
    return userController.login(email, pass);
  }

  createUser(user: Omit<User, 'id'>): User {
    loggerMiddleware('REGISTER_USER', { name: user.name });
    return userController.create(user);
  }

  approveHelper(helperId: number) {
    loggerMiddleware('APPROVE_HELPER', { helperId });
    userController.approveHelper(helperId);
  }

  // Requests API
  getRequests() {
    return requestController.getAll();
  }

  createRequest(request: HelpRequest) {
    loggerMiddleware('CREATE_REQUEST', { title: request.title });
    requestController.create(request);
  }

  updateRequest(requestId: number, updates: Partial<HelpRequest>) {
    loggerMiddleware('UPDATE_REQUEST', { id: requestId, updates });
    requestController.update(requestId, updates);
  }

  deleteRequest(requestId: number) {
    loggerMiddleware('DELETE_REQUEST', { id: requestId });
    requestController.delete(requestId);
  }

  makeOffer(requestId: number, offer: HelpRequestOffer) {
    loggerMiddleware('MAKE_OFFER', { requestId, helperId: offer.helperId });
    requestController.makeOffer(requestId, offer);
  }

  acceptOffer(requestId: number, helperId: number) {
    loggerMiddleware('ACCEPT_OFFER', { requestId, helperId });
    requestController.acceptOffer(requestId, helperId);
  }

  // System API
  getSystemLogs() {
    // This could also be moved to an AdminController
    return Database.getInstance().logs.asReadonly();
  }
}

// Import Database here to avoid circular dependencies if controllers need it directly.
// In a real app, DI would handle this.
import { Database } from './config/db';
