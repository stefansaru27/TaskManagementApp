import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent implements OnInit {
  profileForm: FormGroup;
  successMessage: string = '';
  profilePicture: string | ArrayBuffer | null = null;
  defaultProfilePicture: string = 'https://via.placeholder.com/150';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    // Initialize the form
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      birthday: [''],
      phoneNumber: ['', [Validators.pattern(/^\+?\d{10,15}$/)]],
      aboutMe: [''],
    });
  }

  ngOnInit(): void {
    // Use currentUser$ to subscribe to changes in the user state
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          birthday: user.birthday || '',
          phoneNumber: user.phoneNumber || '',
          aboutMe: user.aboutMe || '',
        });
        this.profilePicture = user.profilePicture || this.defaultProfilePicture;
      }
    });
  }

  // Handle file selection for profile picture
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target?.result ?? this.defaultProfilePicture; // Ensure no undefined is assigned
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (this.profileForm.valid) {
      const profileData = {
        ...this.profileForm.value,
        profilePicture: this.profilePicture,
      };

      this.authService.currentUser$.subscribe((currentUser) => {
        if (currentUser) {
          this.firestoreService
            .updateUser(currentUser.id || '', profileData)
            .then(() => {
              this.successMessage = 'Profile updated successfully!';
            })
            .catch((error) => {
              console.error('Error updating profile:', error);
            });
        }
      });
    }
  }
}
