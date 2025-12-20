import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  features = [
    {
      icon: '🤝',
      title: 'Request Help',
      description: 'Post requests for groceries, errands, transportation, or any assistance you need from your community.'
    },
    {
      icon: '🏘️',
      title: 'Help Neighbors',
      description: 'Browse open requests and offer your time to help neighbors in need. Build real connections.'
    },
    {
      icon: '📍',
      title: 'Stay Local',
      description: 'All requests are location-based. Help and receive help from people in your actual neighborhood.'
    },
    {
      icon: '🔒',
      title: 'Safe & Verified',
      description: 'Verified accounts, request tracking, and community ratings ensure trust and accountability.'
    }
  ];

  howItWorks = [
    {
      step: 1,
      title: 'Create Account',
      description: 'Sign up with your email and verify your neighborhood residence.'
    },
    {
      step: 2,
      title: 'Post or Browse',
      description: 'Create a help request or browse available requests from neighbors.'
    },
    {
      step: 3,
      title: 'Connect & Help',
      description: 'Accept requests, coordinate through the platform, and complete tasks.'
    },
    {
      step: 4,
      title: 'Build Community',
      description: 'Rate experiences, build trust, and strengthen neighborhood bonds.'
    }
  ];

  stats = [
    { value: '2,500+', label: 'Active Neighbors' },
    { value: '8,400+', label: 'Requests Completed' },
    { value: '45', label: 'Neighborhoods' },
    { value: '4.9', label: 'Average Rating' }
  ];
}
