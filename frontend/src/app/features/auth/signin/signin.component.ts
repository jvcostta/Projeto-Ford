import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header class="auth-header">
          <div class="ford-logo">
            <h1>Ford</h1>
          </div>
          <mat-card-title>Entre em sua conta</mat-card-title>
          <mat-card-subtitle>Acesse seu painel de controle</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="signinForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="seu@email.com">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="signinForm.get('email')?.hasError('required')">
                Email é obrigatório
              </mat-error>
              <mat-error *ngIf="signinForm.get('email')?.hasError('email')">
                Email deve ter formato válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Sua senha">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="signinForm.get('password')?.hasError('required')">
                Senha é obrigatória
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="signinForm.invalid || isLoading" class="full-width auth-button">
              {{isLoading ? 'Entrando...' : 'Entrar'}}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="auth-actions">
          <p>Não tem uma conta? 
            <a routerLink="/auth/signup" class="auth-link">Cadastre-se aqui</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, var(--ford-blue) 0%, var(--ford-blue-light) 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 0;
    }

    .auth-header {
      background: var(--ford-blue);
      color: var(--ford-white);
      padding: 24px;
      margin: -16px -16px 16px -16px;
      border-radius: 4px 4px 0 0;
    }

    .ford-logo h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: 2px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .auth-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-top: 8px;
    }

    .auth-actions {
      text-align: center;
      padding: 16px 24px;
      background: var(--ford-gray-light);
      margin: 16px -16px -16px -16px;
      border-radius: 0 0 4px 4px;
    }

    .auth-actions p {
      margin: 0;
      color: var(--ford-gray-dark);
    }

    .auth-link {
      color: var(--ford-blue);
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }
      
      .auth-card {
        margin: 0;
      }
    }
  `]
})
export class SigninComponent {
  signinForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.isLoading = true;
      const loginRequest: LoginRequest = this.signinForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/settings']);
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.error?.message || 'Erro ao fazer login. Tente novamente.';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
