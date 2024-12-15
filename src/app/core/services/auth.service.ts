import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app'; // Ensure firebase is imported
import { FirestoreService, User } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    // Listen for authentication state changes
    this.afAuth.authState.subscribe(async (authUser: firebase.User | null) => {
      if (authUser) {
        try {
          const userData = await this.fetchUserData(authUser.uid);
          this.currentUserSubject.next(
            this.mapAuthUserToUser(authUser, userData)
          );
          authUser.getIdToken().then((token) => this.setSession(token));
        } catch (error) {
          console.error(
            'Failed to fetch user data:',
            this.getErrorMessage(error)
          );
        }
      } else {
        this.clearSession();
      }
    });
  }

  async register(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential.user) {
        await userCredential.user.updateProfile({ displayName });

        const [firstName, lastName] = displayName.split(' ');

        await this.firestoreService.addUser(userCredential.user.uid, {
          firstName: firstName || '',
          lastName: lastName || '',
          email,
          profilePicture: '',
          birthday: '',
          phoneNumber: '',
          aboutMe: '',
          role: 'user',
          notifyEmail: true,
          notifySms: false,
        });

        const userData = await this.fetchUserData(userCredential.user.uid);
        this.currentUserSubject.next(
          this.mapAuthUserToUser(userCredential.user, userData)
        );
      }

      return userCredential;
    } catch (error: unknown) {
      console.error('Registration failed:', this.getErrorMessage(error));
      throw new Error(this.getErrorMessage(error));
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const userData = await this.fetchUserData(userCredential.user?.uid || '');
      this.currentUserSubject.next(
        this.mapAuthUserToUser(userCredential.user, userData)
      );
      return userCredential;
    } catch (error: unknown) {
      console.error('Login failed:', this.getErrorMessage(error));
      throw new Error(this.getErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.clearSession();
      await this.router.navigate(['/auth/login']);
    } catch (error: unknown) {
      console.error('Logout failed:', this.getErrorMessage(error));
    }
  }

  private async fetchUserData(uid: string): Promise<Partial<User>> {
    try {
      return (await firstValueFrom(this.firestoreService.getUser(uid))) || {};
    } catch (error) {
      console.error('Error fetching user data:', this.getErrorMessage(error));
      throw error;
    }
  }

  private mapAuthUserToUser(
    authUser: firebase.User | null,
    userData: Partial<User>
  ): User {
    return {
      id: authUser?.uid || '',
      firstName: userData.firstName || 'First Name',
      lastName: userData.lastName || 'Last Name',
      email: userData.email || authUser?.email || '',
      profilePicture: userData.profilePicture || authUser?.photoURL || '',
      birthday: userData.birthday || '',
      phoneNumber: userData.phoneNumber || authUser?.phoneNumber || '',
      aboutMe: userData.aboutMe || '',
      role: userData.role || 'user',
      notifyEmail: userData.notifyEmail ?? true,
      notifySms: userData.notifySms ?? false,
    };
  }

  async updateUserProfile(profileData: Partial<User>): Promise<void> {
    const user = this.currentUserSubject.value;
    if (user) {
      try {
        await this.firestoreService.updateUser(user.id || '', profileData);
        const updatedData = { ...user, ...profileData };
        this.currentUserSubject.next(updatedData);
      } catch (error: unknown) {
        console.error(
          'Failed to update user profile:',
          this.getErrorMessage(error)
        );
        throw new Error(this.getErrorMessage(error));
      }
    }
  }

  private setSession(token: string): void {
    const expirationTime = new Date().getTime() + 3600 * 1000;
    localStorage.setItem('idToken', token);
    localStorage.setItem('expirationTime', expirationTime.toString());
  }

  private clearSession(): void {
    localStorage.removeItem('idToken');
    localStorage.removeItem('expirationTime');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const expirationTime = parseInt(
      localStorage.getItem('expirationTime') || '0',
      10
    );
    return expirationTime > new Date().getTime();
  }

  getToken(): string | null {
    return localStorage.getItem('idToken');
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  }
}
