import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-20">
      <div class="mx-auto max-w-3xl px-6">
        
        <div class="mb-12 text-center">
          <h2 class="font-serif text-4xl text-hive-dark mb-2">New Request</h2>
          <p class="text-slate-500 font-light">Tell your neighbors what you need.</p>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-12">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-10">
            
            <!-- Basic Info Section -->
            <div class="space-y-8">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">The Basics</h3>
              
              <!-- Title -->
              <div class="group">
                <label for="title" class="block text-sm font-bold text-slate-700 mb-2">Request Title</label>
                <input type="text" formControlName="title" id="title" class="block w-full border-0 border-b-2 border-slate-200 bg-slate-50 py-3 px-4 rounded-xl text-lg font-serif text-hive-dark placeholder:text-slate-300 focus:ring-0 focus:border-hive-yellow-500 transition-colors" placeholder="e.g. Fix my bike">
              </div>

              <!-- Location -->
              <div class="group">
                <label for="fullAddress" class="block text-sm font-bold text-slate-700 mb-2">Full Address of Task</label>
                <div class="relative">
                   <input type="text" formControlName="fullAddress" id="fullAddress" class="block w-full border-0 border-b-2 border-slate-200 bg-slate-50 py-3 px-4 rounded-xl text-lg font-serif text-hive-dark placeholder:text-slate-300 focus:ring-0 focus:border-hive-yellow-500 transition-colors" placeholder="e.g. 123 Maple St, Springfield">
                   <div class="absolute right-3 top-3.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
                   </div>
                </div>
              </div>
            </div>

            <!-- Details Section -->
            <div class="space-y-8">
               <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Logistics</h3>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- Category -->
                 <div class="group">
                   <label for="category" class="block text-sm font-bold text-slate-700 mb-2">Category</label>
                   <select id="category" formControlName="category" class="block w-full border-0 bg-slate-50 py-3 px-4 rounded-xl text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 cursor-pointer">
                     <option value="General">General</option>
                     <option value="Plumbing">Plumbing</option>
                     <option value="Electrical">Electrical</option>
                     <option value="Grocery">Grocery</option>
                     <option value="Moving">Moving</option>
                     <option value="Tutoring">Tutoring</option>
                     <option value="Pet Care">Pet Care</option>
                     <option value="Gardening">Gardening</option>
                     <option value="Technology">Technology</option>
                   </select>
                 </div>

                 <!-- Complexity -->
                 <div class="group">
                   <label for="complexity" class="block text-sm font-bold text-slate-700 mb-2">Complexity</label>
                   <select id="complexity" formControlName="complexity" class="block w-full border-0 bg-slate-50 py-3 px-4 rounded-xl text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 cursor-pointer">
                     <option value="Low">Low (Quick task)</option>
                     <option value="Medium">Medium (Needs some effort)</option>
                     <option value="High">High (Needs expertise)</option>
                   </select>
                 </div>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- Duration -->
                 <div class="group">
                   <label for="duration" class="block text-sm font-bold text-slate-700 mb-2">Est. Duration</label>
                   <input type="text" formControlName="duration" id="duration" class="block w-full border-0 bg-slate-50 py-3 px-4 rounded-xl text-hive-dark placeholder:text-slate-400 focus:ring-2 focus:ring-hive-yellow-500" placeholder="e.g. 1 hour">
                 </div>

                 <!-- Preferred Time -->
                 <div class="group">
                   <label for="preferredTime" class="block text-sm font-bold text-slate-700 mb-2">Preferred Time</label>
                   <input type="text" formControlName="preferredTime" id="preferredTime" class="block w-full border-0 bg-slate-50 py-3 px-4 rounded-xl text-hive-dark placeholder:text-slate-400 focus:ring-2 focus:ring-hive-yellow-500" placeholder="e.g. Weekends, Mornings">
                 </div>
               </div>

               <!-- Description -->
               <div class="group">
                  <label for="description" class="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea id="description" formControlName="description" rows="3" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-4 px-4 text-base text-hive-dark placeholder:text-slate-400 focus:ring-2 focus:ring-hive-yellow-500 focus:bg-white transition-all resize-none" placeholder="Provide details about the task, tools needed, etc..."></textarea>
               </div>
            </div>

            <!-- Urgent Toggle -->
            <div class="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
               <label for="isUrgent" class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="isUrgent" formControlName="isUrgent" class="sr-only peer" />
                  <div class="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-rose-500 peer-focus:ring-2 peer-focus:ring-rose-300 transition-colors"></div>
                  <div class="absolute left-[2px] top-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5"></div>
                  <span class="ml-3 text-sm font-bold text-slate-700 select-none">Mark as Urgent</span>
               </label>
            </div>

            <div class="flex items-center gap-4 pt-6">
               <button type="button" (click)="cancel()" class="flex-1 py-4 rounded-full border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
               <button type="submit" [disabled]="form.invalid" class="flex-[2] py-4 rounded-full bg-gradient-to-r from-hive-yellow-500 to-amber-600 text-white font-bold tracking-wide shadow-xl hover:scale-[1.02] transition-all">POST REQUEST</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class CreateRequestComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  private router: Router = inject(Router);

  form = this.fb.group({
    title: ['', Validators.required],
    fullAddress: ['', Validators.required],

    category: ['General', Validators.required],
    complexity: ['Low' as 'Low' | 'Medium' | 'High', Validators.required],
    duration: ['', Validators.required],
    preferredTime: ['', Validators.required],

    description: ['', Validators.required],
    isUrgent: [false]
  });

  constructor() {
    const user = this.dataService.currentUser();
    if (user?.role !== 'requester') {
      this.router.navigate(['/dashboard']);
    }

    // Auto-fill address from profile
    if (user) {
      this.form.patchValue({ fullAddress: user.fullAddress });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value;
      this.dataService.createRequest(
        val.title!,
        val.description!,
        val.category!,
        !!val.isUrgent,
        val.fullAddress!,
        val.complexity!,
        val.duration!,
        val.preferredTime!
      );
      this.router.navigate(['/dashboard']);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}