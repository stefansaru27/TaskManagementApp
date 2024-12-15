import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isAuthRoute = false; // Tracks whether the current route is an auth route

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check the route on initialization and whenever it changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkIfAuthRoute(event.url);
      }
    });

    // Perform an initial check for the current route
    this.checkIfAuthRoute(this.router.url);
  }

  // Determine if the current route is an auth route
  private checkIfAuthRoute(url: string): void {
    const authRoutes = ['/auth/login', '/auth/register'];
    this.isAuthRoute = authRoutes.some((route) => url.startsWith(route));
  }
}
