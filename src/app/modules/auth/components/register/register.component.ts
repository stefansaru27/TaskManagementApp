import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    // Initialize the form
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to ensure passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Handle form submission
  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, firstName, lastName } = this.registerForm.value;
      const displayName = `${firstName} ${lastName}`; // Combine first and last name

      try {
        // Register the user with Firebase Auth
        const userCredential = await this.authService.register(
          email,
          password,
          displayName
        );

        // Save additional user details in Firestore
        if (userCredential.user) {
          await this.firestoreService.addUser(userCredential.user.uid, {
            firstName,
            lastName,
            email,
            profilePicture: '',
            birthday: '',
            phoneNumber: '',
            aboutMe: '',
            role: 'user',
            notifyEmail: true,
            notifySms: false,
            createdAt: new Date(),
          });
        }

        // Show success message and navigate to login page
        alert('Registration successful!');
        this.router.navigate(['/auth/login']);
      } catch (error: unknown) {
        // Handle errors during registration
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';

        console.error('Registration failed:', errorMessage);
        alert('Registration failed: ' + errorMessage);
      }
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
