import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class ResidentGuard implements CanActivate {
  constructor(private dataService: DataService, private router: Router) { }

  canActivate(): boolean {
    const user = this.dataService.currentUser();
    if (user && user.role === 'requester') {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
