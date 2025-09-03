import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatCheckboxModule, 
    MatSnackBarModule
  ],
template: `
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="assets/images/ford-logo.svg" alt="Ford Logo" class="header-logo" />
      </div>
      <h1 class="auth-title">Bem-vindo de volta</h1>
      <p class="auth-subtitle">Acesse o portal da Ford</p>

      <form [formGroup]="signinForm" (ngSubmit)="onSubmit()" class="auth-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Digite seu e-mail" />
          <mat-error *ngIf="isFieldInvalid('email')">Digite um e-mail válido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Digite sua senha" />
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="isFieldInvalid('password')">A senha é obrigatória</mat-error>
        </mat-form-field>

        <div class="options">
          <mat-checkbox formControlName="rememberMe" color="primary">Lembrar-me</mat-checkbox>
          <a href="#" class="forgot-password">Esqueceu a senha?</a>
        </div>

        <button mat-raised-button color="primary" class="btn-submit" [disabled]="signinForm.invalid || isLoading">
          <span *ngIf="isLoading" class="spinner"></span>
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="divider"><span>ou</span></div>

      <p class="signup-text">Não tem uma conta? 
        <a routerLink="/auth/signup" class="signup-link">Criar conta</a>
      </p>
    </div>
  </div>
`,

styles: [`
  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #003478 0%, #1766a6 100%);
    padding: 1rem;
  }

    .header-logo {
      height: 70px;
      width: auto;
      max-width: 200px;
      margin: 0 auto 1rem;
      display: block;
    }

  .auth-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
  }

  .auth-logo img {
    width: 90px;
    margin-bottom: 1rem;
  }

  .auth-title {
    font-size: 2rem;
    font-weight: 700;
    color: #003478;
    margin-bottom: 0.5rem;
  }

  .auth-subtitle {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .full-width {
    width: 100%;
  }

  .options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    margin: 0.5rem 0 1rem;
  }

  .forgot-password {
    color: #003478;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .forgot-password:hover {
    color: #1766a6;
  }

  .btn-submit {
    width: 100%;
    height: 48px;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    border-radius: 8px;
    transition: background 0.3s ease;
  }

  .btn-submit:hover {
    background-color: #002a63;
  }

  .divider {
    position: relative;
    margin: 1.5rem 0;
    text-align: center;
  }

  .divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e2e8f0;
  }

  .divider span {
    background: white;
    padding: 0 0.75rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  .signup-text {
    font-size: 0.95rem;
    color: #64748b;
  }

  .signup-link {
    color: #003478;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .signup-link:hover {
    color: #1766a6;
  }

  @media (max-width: 480px) {
    .auth-card {
      padding: 1.5rem;
    }

    .auth-title {
      font-size: 1.75rem;
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
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signinForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.isLoading = true;
      const loginRequest: LoginRequest = {
        email: this.signinForm.value.email,
        password: this.signinForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response: any) => {
          if (this.signinForm.value.rememberMe) {
            // Store remember me preference in localStorage
            localStorage.setItem('rememberMe', 'true');
          }
          
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/settings']);
        },
        error: (error: any) => {
          this.isLoading = false;
          const message = error.error?.message || 'Erro ao fazer login. Tente novamente.';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signinForm.controls).forEach(key => {
        this.signinForm.get(key)?.markAsTouched();
      });
    }
  }
}
