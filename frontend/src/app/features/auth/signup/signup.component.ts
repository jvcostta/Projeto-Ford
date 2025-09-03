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
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-signup',
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
    <div class="auth-container fade-in">
      <mat-card class="auth-card fade-in-up">
        <div class="auth-header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png" alt="Ford Logo" class="header-logo" />
          <h1>Criar Conta</h1>
          <p>Preencha os campos para se cadastrar</p>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome completo</mat-label>
            <input matInput formControlName="name" placeholder="Digite seu nome completo">
            <mat-error *ngIf="isFieldInvalid('name')">
              <span *ngIf="signupForm.get('name')?.errors?.['required']">O nome é obrigatório</span>
              <span *ngIf="signupForm.get('name')?.errors?.['minlength']">O nome deve ter pelo menos 2 caracteres</span>
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>E-mail</mat-label>
            <input matInput formControlName="email" placeholder="Digite seu e-mail">
            <mat-error *ngIf="isFieldInvalid('email')">
              <span *ngIf="signupForm.get('email')?.errors?.['required']">O e-mail é obrigatório</span>
              <span *ngIf="signupForm.get('email')?.errors?.['email']">Insira um e-mail válido</span>
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Crie uma senha forte">
            <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
            <mat-error *ngIf="isFieldInvalid('password')">
              <span *ngIf="signupForm.get('password')?.errors?.['required']">A senha é obrigatória</span>
              <span *ngIf="signupForm.get('password')?.errors?.['minlength']">A senha deve ter no mínimo 8 caracteres</span>
              <span *ngIf="signupForm.get('password')?.errors?.['pattern']">A senha deve conter letras maiúsculas, minúsculas, número e caractere especial</span>
            </mat-error>
          </mat-form-field>

          <div class="password-strength">
            <div class="strength-bar" [class]="getPasswordStrength()"></div>
            <span class="strength-text">{{ getPasswordStrengthText() }}</span>
          </div>

          <mat-checkbox formControlName="acceptTerms" color="primary">
            Eu aceito os <a href="#" class="terms-link">Termos e Condições</a>
          </mat-checkbox>
          <mat-error *ngIf="isFieldInvalid('acceptTerms')">
            Você deve aceitar os termos
          </mat-error>

          <button mat-raised-button color="primary" class="btn-full" [disabled]="signupForm.invalid || isLoading">
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Já tem uma conta? <a routerLink="/auth/signin">Entrar</a></p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #fff;
      padding: 1rem;
    }

    .auth-card {
      max-width: 420px;
      width: 100%;
      padding: 2rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border-radius: 12px;
      background: white;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .header-logo {
      height: 70px;
      width: auto;
      max-width: 200px;
      margin: 0 auto 1rem;
      display: block;
    }

    h1 {
      font-size: 1.8rem;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    p {
      color: #64748b;
      font-size: 0.95rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 1rem;
    }

    .strength-bar {
      flex: 1;
      height: 4px;
      border-radius: 4px;
      background: #e2e8f0;
    }

    .strength-bar.weak { background: #ef4444; }
    .strength-bar.fair { background: #f59e0b; }
    .strength-bar.good { background: #3b82f6; }
    .strength-bar.strong { background: #10b981; }

    .strength-text {
      font-size: 12px;
      color: #64748b;
    }

    .terms-link {
      color: #003478;
      text-decoration: none;
      font-weight: 600;
    }

    .btn-full {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
    }

    .auth-footer a {
      color: #003478;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .fade-in { animation: fadeIn 0.5s ease-in; }
    .fade-in-up { animation: fadeInUp 0.6s ease-in; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/)
      ]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getPasswordStrength(): string {
    const password = this.signupForm.get('password')?.value || '';
    if (!password) return '';
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    if (score <= 2) return 'weak';
    if (score === 3) return 'fair';
    if (score === 4) return 'good';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'Fraca';
      case 'fair': return 'Média';
      case 'good': return 'Boa';
      case 'strong': return 'Forte';
      default: return '';
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const registerRequest: RegisterRequest = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      };

      this.authService.register(registerRequest).subscribe({
        next: () => {
          this.snackBar.open('Conta criada com sucesso! Faça login para continuar.', 'Fechar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/auth/signin']);
        },
        error: (error: any) => {
          this.isLoading = false;
          const message = error.error?.message || 'Erro ao criar conta. Tente novamente.';
          this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }
}
