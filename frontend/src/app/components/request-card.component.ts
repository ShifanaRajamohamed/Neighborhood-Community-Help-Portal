import { Component, input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRequest, RequestStatus, User } from '../../shared/types';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative flex flex-col w-full bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md border border-slate-100 h-full">
      <div class="relative h-40 w-full overflow-hidden bg-hive-yellow-50">
         <img [src]="categoryImage()" alt="Category Illustration" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100">
         <div class="absolute inset-0 bg-amber-900/10 mix-blend-multiply"></div>
         <div class="absolute inset-0 bg-gradient-to-t from-hive-yellow-50 via-transparent to-transparent opacity-80"></div>
         <div class="absolute top-4 left-4">
             <span class="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/95 backdrop-blur-sm text-amber-800 shadow-sm border border-amber-100">
                {{ request().category }}
             </span>
         </div>
         @if (request().isUrgent) {
            <div class="absolute top-4 right-4">
               <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/30 animate-pulse">
                 Urgent
               </span>
            </div>
         }
      </div>

      <div class="flex flex-col flex-grow p-5 pt-4">
        <div class="mb-3">
           <h3 class="font-serif text-lg font-bold text-hive-dark leading-tight line-clamp-1 group-hover:text-hive-yellow-600 transition-colors">
             {{ request().title }}
           </h3>
           <p class="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1 h-8">
             {{ request().description }}
           </p>
        </div>

        <!-- Address Info with Privacy -->
        <div class="mb-5 flex items-center gap-1.5 text-amber-600/70 p-2 rounded-xl bg-amber-50/50 border border-amber-100/50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 flex-shrink-0"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>
          <span class="text-[10px] font-bold truncate max-w-full">{{ canShowFullAddress() ? request().fullAddress : request().abstractAddress }}</span>
        </div>

        <div class="mt-auto pt-3 border-t border-slate-50">
          <!-- Requester's View for Offers -->
          @if (isRequesterOwner() && request().status === 'offered') {
            <div class="mb-3">
              <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Helpers Available ({{request().offers.length}})</h4>
              <div class="space-y-2 max-h-24 overflow-y-auto">
                @for(offer of request().offers; track offer.helperId) {
                   <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                     <span class="text-xs font-bold text-slate-700">{{offer.helperName}}</span>
                     <button (click)="acceptOffer(offer.helperId)" class="px-2.5 py-1 rounded-md bg-hive-yellow-500 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-amber-500">Accept</button>
                   </div>
                }
              </div>
            </div>
          }

          <!-- Main Footer: User & Action -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-hive-yellow-50 to-white flex items-center justify-center text-xs font-bold text-amber-700 ring-1 ring-amber-100 shadow-sm">
                  {{ request().requesterName.charAt(0) }}
                </div>
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase leading-none">By</span>
                  <span class="text-[10px] font-bold text-slate-700 truncate max-w-[80px] leading-none">{{ request().requesterName.split(' ')[0] }}</span>
                </div>
            </div>
            
            @if (getActionLabel()) {
              <button (click)="handlePrimaryAction()" [disabled]="isProcessing() || (request().status === 'pending' && hasOffered())" 
                      [class]="'px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ' + getActionClass()">
                  {{ getActionLabel() }}
              </button>
            } @else {
              <span [class]="getStatusBadgeClass(request().status)">
                {{ request().status.replace('_', ' ') }}
              </span>
            }
          </div>
        </div>
      </div>
      
      <!-- Overlays -->
      @if (feedback()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in">
           <h3 class="text-sm font-bold text-amber-800 uppercase tracking-widest">{{ feedback() }}</h3>
        </div>
      }
      @if (showConfirmModal()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-hive-dark/90 backdrop-blur-sm p-6 animate-in fade-in">
           <div class="text-center w-full">
              <p class="text-white font-bold text-sm mb-6">Permanently delete request?</p>
              <div class="grid grid-cols-2 gap-3">
                 <button (click)="cancelDelete()" class="py-2.5 rounded-lg bg-white/10 text-white text-[10px] font-bold hover:bg-white/20 uppercase tracking-widest">Cancel</button>
                 <button (click)="delete()" class="py-2.5 rounded-lg bg-rose-500 text-white text-[10px] font-bold hover:bg-rose-400 uppercase tracking-widest shadow-lg">Delete</button>
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

  currentUser = this.dataService.currentUser;
  showConfirmModal = signal(false);
  feedback = signal<string | null>(null);
  isProcessing = signal(false);

  categoryImage = computed(() => {
    const category = this.request().category.toLowerCase();
    const width = 600, height = 400;
    switch (category) {
      case 'plumbing': return `https://images.unsplash.com/photo-1600150928925-999331b25575?auto=format&fit=crop&w=${width}&q=80`;
      case 'electrical': return `https://images.unsplash.com/photo-1616440334541-6e3e5c9b6348?auto=format&fit=crop&w=${width}&q=80`;
      case 'grocery': return `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=${width}&q=80`;
      case 'moving': return `https://images.unsplash.com/photo-1594411332204-f6d3f242b32f?auto=format&fit=crop&w=${width}&q=80`;
      case 'tutoring': return `https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=${width}&q=80`;
      case 'pet care': return `https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=${width}&q=80`;
      case 'gardening': return `https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=${width}&q=80`;
      case 'technology': return `https://images.unsplash.com/photo-1587831990711-23d7e9a5a7b8?auto=format&fit=crop&w=${width}&q=80`;
      default: return `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=${width}&q=80`;
    }
  });

  canShowFullAddress = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    return user.role === 'admin' ||
      this.request().requesterId === user.id ||
      this.request().helperId === user.id;
  });

  isRequesterOwner = computed(() => this.currentUser()?.id === this.request().requesterId);
  isAcceptedHelper = computed(() => this.currentUser()?.id === this.request().helperId);
  hasOffered = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    return this.request().offers.some(o => o.helperId === user.id);
  });

  getActionLabel(): string | null {
    const user = this.currentUser();
    const status = this.request().status;
    if (!user) return null;

    if (user.role === 'admin') return 'Delete';
    if (user.role === 'helper' && user.isApproved) {
      if (status === 'pending') return this.hasOffered() ? 'Offer Sent' : 'Offer Help';
      if (status === 'accepted' && this.isAcceptedHelper()) return 'Start Task';
      if (status === 'in_progress' && this.isAcceptedHelper()) return 'Finish Task';
    }
    return null;
  }

  getActionClass(): string {
    const status = this.request().status;
    if (status === 'pending') return 'bg-blue-600 hover:bg-blue-500 shadow-blue-200';
    return 'bg-hive-yellow-500 hover:bg-amber-500 shadow-amber-200';
  }

  handlePrimaryAction() {
    console.log('handlePrimaryAction called');
    const user = this.currentUser();
    console.log('Current user:', user);
    if (!user) return;
    const status = this.request().status;
    console.log('Request status:', status);

    if (user.role === 'admin') {
      console.log('Admin delete action');
      this.showConfirmModal.set(true);
    }
    if (user.role === 'helper') {
      console.log('Helper action for status:', status);
      if (status === 'pending') {
        console.log('Making offer');
        this.makeOffer();
      }
      if (status === 'accepted') {
        console.log('Starting task');
        this.setStatus('in_progress');
      }
      if (status === 'in_progress') {
        console.log('Completing task');
        this.setStatus('completed');
      }
    }
  }

  async performWithFeedback(message: string, actionFn: () => Promise<void>) {
    this.isProcessing.set(true);
    try {
      await actionFn();
      this.feedback.set(message);
      setTimeout(() => {
        this.feedback.set(null);
        this.isProcessing.set(false);
      }, 800);
    } catch (error) {
      console.error('Action failed:', error);
      this.feedback.set('Action failed');
      setTimeout(() => {
        this.feedback.set(null);
        this.isProcessing.set(false);
      }, 1500);
    }
  }

  makeOffer() { this.performWithFeedback('Offer Sent!', async () => await this.dataService.makeOffer(this.request().id)); }
  acceptOffer(helperId: number) { this.performWithFeedback('Helper Accepted!', async () => await this.dataService.acceptOffer(this.request().id, helperId)); }
  setStatus(status: RequestStatus) {
    const msg = status === 'in_progress' ? 'Started!' : 'Done!';
    this.performWithFeedback(msg, async () => await this.dataService.updateRequestStatus(this.request().id, status));
  }

  cancelDelete() { this.showConfirmModal.set(false); }
  delete() { this.showConfirmModal.set(false); this.dataService.deleteRequest(this.request().id); }

  getStatusBadgeClass(status: string) {
    const base = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ';
    switch (status) {
      case 'pending': return base + 'bg-amber-50 text-amber-600 border-amber-200';
      case 'offered': return base + 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'accepted': return base + 'bg-blue-50 text-blue-600 border-blue-200';
      case 'in_progress': return base + 'bg-purple-50 text-purple-600 border-purple-200';
      case 'completed': return base + 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return base + 'bg-slate-50 text-slate-500 border-slate-200';
    }
  }
}