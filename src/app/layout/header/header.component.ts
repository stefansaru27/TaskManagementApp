import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/services/firestore.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: { name: string; avatar: string } = { name: 'User', avatar: '' }; // Default user values
  defaultAvatar = 'https://via.placeholder.com/40'; // Fallback avatar
  menuOpen = false; // Controls dropdown menu visibility

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to currentUser from AuthService to get user data
    this.authService.currentUser$.subscribe((userData: User | null) => {
      if (userData) {
        this.user = {
          name: `${userData.firstName} ${userData.lastName}`.trim() || 'User',
          avatar: userData.profilePicture || this.defaultAvatar,
        };
      } else {
        // Reset to default user if not logged in
        this.user = { name: 'User', avatar: this.defaultAvatar };
      }
    });
  }

  // Toggle the visibility of the dropdown menu
  toggleMenu(event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.menuOpen = !this.menuOpen;
  }

  // Close the dropdown menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-toggle') && !target.closest('.profile-menu')) {
      this.menuOpen = false;
    }
  }

  // Navigate to profile details
  navigateToProfile(): void {
    this.router.navigate(['/profile/details']);
    this.closeMenu();
  }

  // Navigate to account settings
  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.closeMenu();
  }

  // Sign out the user
  signOut(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth/login']);
    });
    this.closeMenu();
  }

  // Close the dropdown menu explicitly
  closeMenu(): void {
    this.menuOpen = false;
  }
}
