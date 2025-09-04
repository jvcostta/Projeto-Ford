import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User, UpdateProfileRequest, ChangePasswordRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <nav class="navbar">
        <div class="navbar-container">
          <div class="navbar-brand">
            <div class="ford-logo">F</div>
            <span>Ford Recruitment</span>
          </div>
          
          <div class="navbar-nav">
            <div class="nav-profile">
              <div class="profile-avatar">{{ getUserInitials() }}</div>
              <span class="profile-name">{{ currentUser?.name }}</span>
            </div>
            <button class="nav-link logout-btn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div class="main-content">
        <div class="container">
          <div class="welcome-section">
            <div class="welcome-content">
              <h1>Account Settings</h1>
              <p>Manage your profile and account preferences</p>
            </div>
          </div>

          <div class="content-grid">
            <div class="sidebar">
              <div class="nav-card">
                <ul class="nav-menu">
                  <li class="nav-item">
                    <a class="nav-link" (click)="activeTab = 0" [class.active]="activeTab === 0">
                      <mat-icon class="nav-icon">person</mat-icon>
                      Profile
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" (click)="activeTab = 1" [class.active]="activeTab === 1">
                      <mat-icon class="nav-icon">lock</mat-icon>
                      Security
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" (click)="activeTab = 2" [class.active]="activeTab === 2">
                      <mat-icon class="nav-icon">settings</mat-icon>
                      Preferences
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="content-card">
              <!-- Profile Tab -->
              <div *ngIf="activeTab === 0">
                <h2 class="section-title">Personal Information</h2>
                <form [formGroup]="profileForm" class="form-grid">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Full Name</mat-label>
                      <input matInput formControlName="name" placeholder="Enter your full name">
                      <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                        Name is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Email</mat-label>
                      <input matInput formControlName="email" placeholder="Enter your email">
                      <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                        Email is required
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                        Please enter a valid email
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-stroked-button type="button" (click)="resetProfileForm()">
                      Cancel
                    </button>
                    <button 
                      mat-raised-button 
                      color="primary" 
                      type="button"
                      [disabled]="profileForm.invalid"
                      (click)="updateProfile()">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              <!-- Security Tab -->
              <div *ngIf="activeTab === 1">
                <h2 class="section-title">Change Password</h2>
                <form [formGroup]="passwordForm" class="form-grid">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Current Password</mat-label>
                    <input matInput type="password" formControlName="currentPassword">
                    <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                      Current password is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>New Password</mat-label>
                    <input matInput type="password" formControlName="newPassword">
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                      New password is required
                    </mat-error>
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                      Password must be at least 6 characters
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Confirm New Password</mat-label>
                    <input matInput type="password" formControlName="confirmPassword">
                    <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                      Please confirm your password
                    </mat-error>
                    <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                      Passwords do not match
                    </mat-error>
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-stroked-button type="button" (click)="resetPasswordForm()">
                      Cancel
                    </button>
                    <button 
                      mat-raised-button 
                      color="primary" 
                      type="button"
                      [disabled]="passwordForm.invalid"
                      (click)="changePassword()">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <!-- Preferences Tab -->
              <div *ngIf="activeTab === 2">
                <h2 class="section-title">Preferences</h2>
                
                <div class="preference-item">
                  <div class="preference-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your applications</p>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.emailNotifications"></mat-slide-toggle>
                </div>

                <div class="preference-item">
                  <div class="preference-info">
                    <h4>Job Alerts</h4>
                    <p>Get notified about new job opportunities</p>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.jobAlerts"></mat-slide-toggle>
                </div>

                <div class="form-actions">
                  <button 
                    mat-raised-button 
                    color="primary" 
                    type="button"
                    (click)="savePreferences()">
                    Save Preferences
                  </button>
                </div>

                <div class="danger-zone">
                  <h3 class="danger-title">Danger Zone</h3>
                  <p class="danger-description">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button mat-raised-button color="warn" (click)="deleteAccount()">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
    }

    .navbar {
      background: linear-gradient(135deg, #003478 0%, #1766a6 100%);
      padding: 1rem 0;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .ford-logo {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: white;
      font-size: 20px;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
    }

    .profile-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .profile-name {
      font-weight: 500;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      font-weight: 500;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .welcome-content p {
      font-size: 1.125rem;
      color: #64748b;
      margin: 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 3rem;
      align-items: start;
    }

    .sidebar {
      position: sticky;
      top: 2rem;
    }

    .nav-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #64748b;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: #003478;
    }

    .nav-link.active {
      background: #003478;
      color: white;
    }

    .nav-icon {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }

    .content-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 2rem 0;
    }

    .form-grid {
      display: grid;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .preference-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .preference-info p {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }

    .danger-zone {
      border: 1px solid #fecaca;
      background: #fef2f2;
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .danger-title {
      color: #dc2626;
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    }

    .danger-description {
      color: #991b1b;
      margin: 0 0 1rem 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .sidebar {
        position: static;
      }

      .nav-menu {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
      }

      .nav-item {
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .navbar-container {
        padding: 0 1rem;
      }

      .main-content {
        padding: 1rem;
      }

      .welcome-content h1 {
        font-size: 1.875rem;
      }

      .welcome-content p {
        font-size: 1rem;
      }

      .content-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  activeTab = 0;
  preferences = {
    emailNotifications: true,
    jobAlerts: true
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.profileForm.patchValue({
            name: user.name,
            email: user.email
          });
        }
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.showMessage('Error loading profile');
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const request: UpdateProfileRequest = this.profileForm.value;
      
      this.userService.updateProfile(request).subscribe({
        next: () => {
          this.showMessage('Profile updated successfully');
          this.loadUserProfile();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.showMessage('Error updating profile');
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const request: ChangePasswordRequest = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      this.userService.changePassword(request).subscribe({
        next: () => {
          this.showMessage('Password changed successfully');
          this.resetPasswordForm();
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.showMessage('Error changing password');
        }
      });
    }
  }

  savePreferences(): void {
    this.showMessage('Preferences saved successfully');
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.showMessage('Account deleted successfully');
          this.logout();
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          this.showMessage('Error deleting account');
        }
      });
    }
  }

  resetProfileForm(): void {
    this.loadUserProfile();
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }

  getUserInitials(): string {
    if (this.currentUser?.name) {
      return this.currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
