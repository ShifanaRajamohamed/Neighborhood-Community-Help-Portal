import { Component, input, inject, signal, computed } from '@angular/core';
import { DatePipe, TitleCasePipe, CommonModule } from '@angular/common';
import { HelpRequest, RequestStatus } from '../shared/types';
import { DataService } from '../frontend/services/data.service';

@Component({
  selector: 'app-request-card',
  imports: [DatePipe, TitleCasePipe, CommonModule],
  template: `
    <div class="group relative flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
      
      <!-- Top Half: 2D Illustration Image -->
      <div class="relative h-36 w-full overflow-hidden bg-slate-100">
         <img [src]="categoryImage()" 
              alt="Category Illustration" 
              class="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-100">
         
         <div class="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>

         <!-- Category Badge -->
         <div class="absolute top-3 left-3">
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-700 shadow-sm border border-slate-200">
                {{ request().category }}
             </span>
         </div>

         <!-- Urgent Badge -->
         @if (request().isUrgent) {
            <div class="absolute top-3 right-3">
               <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                 Urgent
               </span>
            </div>
         }
      </div>

      <!-- Bottom Half: Content -->
      <div class="flex flex-col flex-grow p-5">
        
        <div class="mb-4">
           <h3 class="font-sans text-lg font-bold text-slate-800 leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
             {{ request().title }}
           </h3>
           <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed h-8">
             {{ request().description }}
           </p>
        </div>

        <!-- Logistics -->
        <div class="flex items-center gap-4 mb-5 text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-emerald-500"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" /></svg>
               <span>{{ request().estimatedDuration || '1h' }}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-blue-500"><path fill-rule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.08a5.002 5.002 0 007.82.217c.196-.292.583-.301.792-.034zM8 12.39a2 2 0 100-2.828 2 2 0 000 2.828z" clip-rule="evenodd" /></svg>
               <span>{{ request().complexity || 'Low' }}</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
           <div class="flex items-center gap-2">
              <div class="h-6 w-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-slate-500">
                 {{ request().requesterName.charAt(0) }}
              </div>
              <span class="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">
                 {{ request().requesterName.split(' ')[0] }}
              </span>
           </div>
           
           <!-- Actions -->
           @if (hasActions()) {
             <button (click)="handlePrimaryAction()" [disabled]="isProcessing()" 
                     class="px-3 py-1.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ getActionLabel() }}
             </button>
           } @else {
             <span [class]="getStatusBadgeClass(request().status)">
               {{ request().status.replace('_', ' ') }}
             </span>
           }
        </div>

      </div>

      <!-- Feedback Overlay -->
       @if (feedback()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-[1px] animate-in fade-in duration-200">
           <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">{{ feedback() }}</span>
           </div>
        </div>
      }

      <!-- Delete Confirmation -->
      @if (showConfirmModal()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 animate-in fade-in duration-200">
           <div class="text-center w-full">
              <p class="text-white font-medium text-xs mb-4">Are you sure you want to delete?</p>
              <div class="flex justify-center gap-2">
                 <button (click)="cancelDelete()" class="px-3 py-1.5 rounded bg-white/10 text-white text-[10px] font-bold uppercase hover:bg-white/20 transition-colors">No</button>
                 <button (click)="delete()" class="px-3 py-1.5 rounded bg-rose-500 text-white text-[10px] font-bold uppercase hover:bg-rose-600 transition-colors shadow-lg">Yes, Delete</button>
              </div>
           </div>
        </div>
      }
    </div>
  `
})
export class RequestCardComponent {
  request = input.required<HelpRequest>();
  dataService = inject(DataService);

  showConfirmModal = signal(false);
  feedback = signal<string | null>(null);
  isProcessing = signal(false);

  categoryImage = computed(() => {
    const category = this.request().category.toLowerCase();
    const width = 600;
    const height = 400; 

    // Selected images for a "2D Illustration" / "Flat Lay" / "Minimalist" look
    switch (category) {
      case 'plumbing': 
        return `https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=${width}&q=80`; // Water texture
      case 'electrical': 
        return `https://images.unsplash.com/photo-1558402529-d2638a7023e9?auto=format&fit=crop&w=${width}&q=80`; // Minimalist Lightbulb
      case 'grocery': 
        return `https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=${width}&q=80`; // Fruit Pattern
      case 'moving': 
        return `https://images.unsplash.com/photo-1603513492128-ba28c5b09bd1?auto=format&fit=crop&w=${width}&q=80`; // Cardboard texture
      case 'tutoring': 
        return `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=${width}&q=80`; // Books flat lay
      case 'pet care': 
        return `https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=${width}&q=80`; // Dog clean
      case 'gardening': 
        return `https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=${width}&q=80`; // Leaves Pattern
      case 'technology': 
        return `https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=${width}&q=80`; // Circuit board
      default: 
        return `https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=${width}&q=80`; // Minimalist stationery
    }
  });

  isHelper() { return this.dataService.currentUser()?.role === 'helper'; }
  isAdmin() { return this.dataService.currentUser()?.role === 'admin'; }
  
  hasActions() { 
    if (this.isAdmin()) return true;
    if (this.isHelper()) {
       const s = this.request().status;
       return s === 'pending' || s === 'accepted' || s === 'in_progress';
    }
    return false;
  }

  getActionLabel() {
    if (this.isAdmin()) return 'Delete';
    switch(this.request().status) {
      case 'pending': return 'Accept';
      case 'accepted': return 'Start';
      case 'in_progress': return 'Complete';
      default: return 'Action';
    }
  }

  handlePrimaryAction() {
    if (this.isAdmin()) {
      this.showConfirmModal.set(true);
      return;
    }
    const status = this.request().status;
    if (status === 'pending') this.accept();
    if (status === 'accepted') this.setStatus('in_progress');
    if (status === 'in_progress') this.setStatus('completed');
  }

  performWithFeedback(message: string, actionFn: () => void) {
    this.isProcessing.set(true);
    this.feedback.set(message);
    setTimeout(() => {
      actionFn();
      this.feedback.set(null);
      this.isProcessing.set(false);
    }, 600);
  }

  accept() { this.performWithFeedback('Accepted', () => this.dataService.updateRequestStatus(this.request().id, 'accepted')); }
  
  setStatus(status: RequestStatus) {
    const msg = status === 'in_progress' ? 'Started' : 'Done';
    this.performWithFeedback(msg, () => this.dataService.updateRequestStatus(this.request().id, status));
  }

  confirmDelete() { this.showConfirmModal.set(false); this.delete(); }
  cancelDelete() { this.showConfirmModal.set(false); }
  delete() { this.dataService.deleteRequest(this.request().id); }

  getStatusBadgeClass(status: string) {
     const base = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ';
     switch(status) {
       case 'pending': return base + 'bg-amber-50 text-amber-600 border-amber-100';
       case 'accepted': return base + 'bg-blue-50 text-blue-600 border-blue-100';
       case 'in_progress': return base + 'bg-purple-50 text-purple-600 border-purple-100';
       case 'completed': return base + 'bg-emerald-50 text-emerald-600 border-emerald-100';
       default: return base + 'bg-slate-50 text-slate-500 border-slate-100';
     }
  }
}
