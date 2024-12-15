import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // Sidebar open state (can toggle between open and closed)
  private isSidebarOpen = new BehaviorSubject<boolean>(false); // Initial state is closed
  isSidebarOpen$ = this.isSidebarOpen.asObservable(); // Observable to be subscribed to in components

  // User data (shared across the app, e.g., header or profile)
  private user = new BehaviorSubject<{ name: string; avatar: string }>({
    name: 'User',
    avatar: 'https://via.placeholder.com/40', // Default avatar
  });
  user$ = this.user.asObservable(); // Observable to be subscribed to in components

  constructor(private authService: AuthService) {
    // Subscribe to AuthService to dynamically update user data
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user.next({
          name: `${user.firstName} ${user.lastName}`.trim() || 'User', // Use firstName and lastName or fallback to 'User'
          avatar: user.profilePicture || 'https://via.placeholder.com/40', // Default avatar if none provided
        });
      } else {
        // Reset to default user if not logged in
        this.resetUser();
      }
    });
  }

  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value); // Invert the current state of the sidebar
  }

  // Explicitly open the sidebar
  openSidebar(): void {
    this.isSidebarOpen.next(true); // Set the sidebar to open state
  }

  // Explicitly close the sidebar
  closeSidebar(): void {
    this.isSidebarOpen.next(false); // Set the sidebar to closed state
  }

  // Reset user data to default
  private resetUser(): void {
    this.user.next({
      name: 'User',
      avatar: 'https://via.placeholder.com/40',
    });
  }
}
