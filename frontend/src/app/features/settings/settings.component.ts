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
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <mat-toolbar class="settings-toolbar">
        <div class="toolbar-content">
          <div class="ford-logo">
            <h2>Ford</h2>
          </div>
          <span class="spacer"></span>
          <button mat-button (click)="logout()" class="logout-button">
            <mat-icon>logout</mat-icon>
            Sair
          </button>
        </div>
      </mat-toolbar>

      <div class="settings-content">
        <div class="welcome-section">
          <h1>Configurações da Conta</h1>
          <p>Bem-vindo(a), <strong>{{currentUser?.name}}</strong>!</p>
        </div>

        <mat-tab-group class="settings-tabs">
          <mat-tab label="Perfil">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Informações do Perfil</mat-card-title>
                  <mat-card-subtitle>Atualize suas informações pessoais</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content>
                  <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
                    <mat-form-field appearance="fill" class="full-width">
                      <mat-label>Nome Completo</mat-label>
                      <input matInput type="text" formControlName="name" placeholder="Seu nome completo">
                      <mat-icon matSuffix>person</mat-icon>
                      <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                        Nome é obrigatório
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('name')?.hasError('minlength')">
                        Nome deve ter pelo menos 2 caracteres
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="full-width">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" formControlName="email" placeholder="seu@email.com">
                      <mat-icon matSuffix>email</mat-icon>
                      <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                        Email é obrigatório
                      </mat-error>
                      <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                        Email deve ter formato válido
                      </mat-error>
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-raised-button color="primary" type="submit" 
                              [disabled]="profileForm.invalid || isProfileLoading">
                        {{isProfileLoading ? 'Salvando...' : 'Salvar Alterações'}}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Senha">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Alterar Senha</mat-card-title>
                  <mat-card-subtitle>Mantenha sua conta segura</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content>
                  <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="password-form">
                    <mat-form-field appearance="fill" class="full-width">
                      <mat-label>Senha Atual</mat-label>
                      <input matInput [type]="hideCurrentPassword ? 'password' : 'text'" 
                             formControlName="currentPassword" placeholder="Sua senha atual">
                      <button mat-icon-button matSuffix (click)="hideCurrentPassword = !hideCurrentPassword" type="button">
                        <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                        Senha atual é obrigatória
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="full-width">
                      <mat-label>Nova Senha</mat-label>
                      <input matInput [type]="hideNewPassword ? 'password' : 'text'" 
                             formControlName="newPassword" placeholder="Sua nova senha">
                      <button mat-icon-button matSuffix (click)="hideNewPassword = !hideNewPassword" type="button">
                        <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                      </button>
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                        Nova senha é obrigatória
                      </mat-error>
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                        Nova senha deve ter pelo menos 8 caracteres
                      </mat-error>
                      <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('pattern')">
                        Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial
                      </mat-error>
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-raised-button color="primary" type="submit" 
                              [disabled]="passwordForm.invalid || isPasswordLoading">
                        {{isPasswordLoading ? 'Alterando...' : 'Alterar Senha'}}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      min-height: 100vh;
      background-color: var(--ford-gray-light);
    }

    .settings-toolbar {
      background-color: var(--ford-blue);
      color: var(--ford-white);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .ford-logo h2 {
      margin: 0;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .spacer {
      flex: 1;
    }

    .logout-button {
      color: var(--ford-white);
    }

    .settings-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      color: var(--ford-blue);
      margin-bottom: 8px;
    }

    .welcome-section p {
      color: var(--ford-gray-dark);
      margin: 0;
    }

    .settings-tabs {
      background: var(--ford-white);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .profile-form,
    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .form-actions button {
      min-width: 150px;
    }

    mat-card {
      border-radius: 8px;
      box-shadow: none;
      border: 1px solid var(--ford-gray);
    }

    mat-card-header {
      background: var(--ford-gray-light);
      margin: -16px -16px 16px -16px;
      padding: 16px;
    }

    mat-card-title {
      color: var(--ford-blue);
      font-weight: 500;
    }

    mat-card-subtitle {
      color: var(--ford-gray-dark);
    }

    @media (max-width: 768px) {
      .settings-content {
        padding: 16px;
      }
      
      .tab-content {
        padding: 16px;
      }
      
      .form-actions {
        justify-content: stretch;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  isProfileLoading = false;
  isPasswordLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

  loadUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar perfil', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isProfileLoading = true;
      const updateRequest: UpdateProfileRequest = this.profileForm.value;

      this.userService.updateProfile(updateRequest).subscribe({
        next: (user) => {
          this.isProfileLoading = false;
          this.currentUser = user;
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isProfileLoading = false;
          const message = error.error?.message || 'Erro ao atualizar perfil';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isPasswordLoading = true;
      const changeRequest: ChangePasswordRequest = this.passwordForm.value;

      this.userService.changePassword(changeRequest).subscribe({
        next: () => {
          this.isPasswordLoading = false;
          this.passwordForm.reset();
          this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isPasswordLoading = false;
          const message = error.error?.message || 'Erro ao alterar senha';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }
}
