import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }

  async login(email: string, password: string): Promise<boolean> {
    // Implementation will be added
    return true;
  }
}
