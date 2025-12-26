import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../frontend/services/data.service';

@Component({
  selector: 'app-create-request',
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-10">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Request Help</h2>
          </div>
        </div>

        <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div class="px-4 py-6 sm:p-8">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              
              <div class="sm:col-span-4">
                <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
                <div class="mt-2">
                  <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-hive-yellow-500 sm:max-w-md">
                    <input type="text" formControlName="title" id="title" class="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="e.g. Leaky Faucet">
                  </div>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="category" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <div class="mt-2">
                  <select id="category" formControlName="category" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-hive-yellow-500 sm:max-w-xs sm:text-sm sm:leading-6 px-3">
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
              </div>

              <div class="col-span-full">
                <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <div class="mt-2">
                  <textarea id="description" formControlName="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-hive-yellow-500 sm:text-sm sm:leading-6 px-3"></textarea>
                </div>
                <p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about what you need help with.</p>
              </div>

              <div class="sm:col-span-6">
                <div class="relative flex gap-x-3">
                  <div class="flex h-6 items-center">
                    <input id="isUrgent" formControlName="isUrgent" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-hive-yellow-600 focus:ring-hive-yellow-600">
                  </div>
                  <div class="text-sm leading-6">
                    <label for="isUrgent" class="font-medium text-gray-900">Mark as Urgent</label>
                    <p class="text-gray-500">Only check this if your request requires immediate attention.</p>
                  </div>
                </div>
              </div>

              <div class="col-span-full">
                 <div class="flex items-center gap-x-6">
                   <button type="button" (click)="cancel()" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                   <button type="submit" [disabled]="form.invalid" class="rounded-md bg-hive-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hive-dark disabled:bg-gray-300">Save</button>
                 </div>
              </div>

            </form>
          </div>
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
    category: ['General', Validators.required],
    description: ['', Validators.required],
    isUrgent: [false]
  });

  constructor() {
      if (this.dataService.currentUser()?.role !== 'requester') {
          this.router.navigate(['/dashboard']);
      }
  }

  onSubmit() {
    if (this.form.valid) {
      const { title, category, description, isUrgent } = this.form.value;
      this.dataService.createRequest(
        title!, 
        description!, 
        category!, 
        !!isUrgent,
        'Unknown Location',
        'Low',
        '1 Hour',
        'Anytime'
      );
      this.router.navigate(['/dashboard']);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}