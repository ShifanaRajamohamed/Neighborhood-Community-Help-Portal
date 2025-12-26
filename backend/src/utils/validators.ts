import { UserRole, RequestStatus } from '../../../shared/types';

export class Validators {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidRole(role: string): boolean {
    const validRoles: UserRole[] = ['Resident', 'Helper'];
    return validRoles.includes(role as UserRole);
  }

  static isValidStatusTransition(currentStatus: RequestStatus, newStatus: RequestStatus): boolean {
    const validTransitions: Record<RequestStatus, RequestStatus[]> = {
      'Pending': ['Accepted'],
      'Accepted': ['In-progress'],
      'In-progress': ['Completed'],
      'Completed': [] // No further transitions
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static validateRequiredFields(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        throw new Error(`Required field '${field}' cannot be empty`);
      }
    }
  }
}
