import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-hive-light relative overflow-hidden">
      
      <!-- Decorative Background Shapes -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-hive-yellow-50 to-amber-50 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl opacity-60 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-gray-50 to-slate-50 rounded-full -translate-x-1/3 translate-y-1/4 blur-3xl opacity-60 pointer-events-none"></div>

      <!-- Main Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:min-h-screen lg:flex lg:items-center">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          <!-- Left Column: Typography -->
          <div class="space-y-8">
             <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-hive-yellow-100 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-hive-yellow-500 animate-pulse"></span>
                <span class="text-xs font-bold tracking-widest uppercase text-hive-yellow-800">Community First</span>
             </div>
             
             <h1 class="font-serif text-6xl lg:text-7xl font-medium text-hive-dark leading-[1.1]">
               Building a <br>
               stronger <span class="italic text-transparent bg-clip-text bg-gradient-to-r from-hive-yellow-500 to-amber-600">hive</span> <br>
               together.
             </h1>
             
             <p class="text-lg text-slate-600 max-w-md font-light leading-relaxed">
               Connecting neighbors who care. Whether you need a helping hand or have skills to share, Help Hive is where our community comes together.
             </p>
             
             <div class="flex items-center gap-6 pt-4">
                <a routerLink="/register" class="flex items-center gap-4 group cursor-pointer">
                   <div class="relative h-14 w-14 rounded-full bg-gradient-to-br from-hive-yellow-400 to-amber-600 p-[2px] shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all">
                      <div class="h-full w-full rounded-full bg-white flex items-center justify-center group-hover:bg-transparent transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-hive-yellow-600 group-hover:text-white transition-colors">
                           <path fill-rule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                         </svg>
                      </div>
                   </div>
                   <span class="font-bold text-hive-dark group-hover:text-amber-700 transition-colors">Join the Hive</span>
                </a>
             </div>
             
             <!-- Social Proof -->
             <div class="flex items-center gap-4 pt-12">
                <div class="flex -space-x-3">
                   <img class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://picsum.photos/100/100?random=1" alt="User">
                   <img class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://picsum.photos/100/100?random=2" alt="User">
                   <img class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://picsum.photos/100/100?random=3" alt="User">
                   <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">+5k</div>
                </div>
                <div class="h-px w-12 bg-slate-300"></div>
                <p class="text-xs font-medium text-slate-500 uppercase tracking-widest">Neighbors Helping</p>
             </div>
          </div>

          <!-- Right Column: Visual -->
          <div class="relative hidden lg:block h-full min-h-[600px]">
             <!-- Large circle background -->
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-hive-yellow-100 via-amber-100 to-gray-100 rounded-full opacity-100"></div>
             
             <!-- Image -->
             <div class="absolute inset-0 flex items-center justify-center">
                 <img src="https://images.unsplash.com/photo-1586994998399-19840f11864f?auto=format&fit=crop&w=800&q=80" alt="Honeycomb" class="relative z-10 w-4/5 h-auto object-cover rounded-[3rem] shadow-2xl shadow-amber-900/10 transform rotate-3 hover:rotate-0 transition-all duration-700 ease-out border-4 border-white/50 backdrop-blur-md">
             </div>

             <!-- Floating Badges -->
             <div class="absolute top-20 right-10 z-20 animate-bounce delay-700 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
                <div class="flex items-center gap-3">
                   <div class="p-2 bg-hive-yellow-100 rounded-full text-hive-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   </div>
                   <div>
                      <p class="text-xs text-slate-500 font-bold uppercase">Mission</p>
                      <p class="font-serif font-bold text-hive-dark">Grocery Run Done</p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LandingComponent {}