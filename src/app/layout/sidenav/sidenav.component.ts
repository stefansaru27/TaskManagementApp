import { Component } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  isOpen = false; // Sidebar open state

  constructor(private layoutService: LayoutService, private router: Router) {
    // Subscribe to sidebar state from LayoutService
    this.layoutService.isSidebarOpen$.subscribe((state) => {
      this.isOpen = state;
    });
  }

  // Toggle sidebar visibility

  // Navigate to a route and handle sidebar state
  navigateTo(route: string): void {
    this.router.navigate([route]);

    if (window.innerWidth <= 768) {
      this.layoutService.closeSidebar(); // Close sidebar on mobile after navigation
    }
  }

  // Check if route is active
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
