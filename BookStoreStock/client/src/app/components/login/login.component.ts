import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../ui/input/input.component';
import { WordmarkComponent } from '../ui/wordmark/wordmark.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, InputComponent, WordmarkComponent],
  template: `
    <div class="min-h-screen bg-page flex flex-col items-center justify-center p-4">
      <a routerLink="/" class="mb-[32px] hover:opacity-90 transition-opacity">
        <app-wordmark [size]="40"></app-wordmark>
      </a>
      
      <div class="bg-surface border border-border rounded-[16px] w-full max-w-[400px] p-[32px] shadow-modal">
        <h2 class="text-[24px] font-bold tracking-[-0.025em] text-txt-primary mb-2 text-center">Entrar</h2>
        <p class="text-[14px] text-txt-muted mb-8 text-center">Ingresa tus credenciales para continuar.</p>
        
        <form (submit)="onLogin($event)" class="flex flex-col gap-5">
          <!-- Modificado para funcionar en base de datos. Usar email como usuario en la UI para simplicidad. -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-txt-primary">Email</label>
            <input type="email" name="email" [(ngModel)]="email" class="w-full bg-surface-2 border border-border rounded-[8px] px-3 py-2 text-[14px] text-txt-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-txt-dim" placeholder="Ej: usuario@correo.com" required>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-txt-primary">Contraseña</label>
            <input type="password" name="password" [(ngModel)]="password" class="w-full bg-surface-2 border border-border rounded-[8px] px-3 py-2 text-[14px] text-txt-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-txt-dim" placeholder="••••••••" required>
          </div>
          
          <button type="submit" class="w-full bg-accent hover:bg-accent-light text-white font-semibold text-[14px] py-[12px] rounded-[8px] transition-colors mt-2 disabled:opacity-50">
            Iniciar Sesión
          </button>
          <div *ngIf="errorMessage" class="text-red-500 text-sm mt-2 text-center">{{errorMessage}}</div>
        </form>
        
        <div class="mt-6 text-center text-[13px] text-txt-dim">
          ¿No tienes cuenta? <a routerLink="/register" class="text-accent-light hover:underline font-medium">Regístrate</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}
  
  onLogin(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        const detail = err.error?.detail;
        this.errorMessage = typeof detail === 'string'
          ? detail
          : 'Credenciales inválidas o error de conexión.';
      }
    });
  }
}

