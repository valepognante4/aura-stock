import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../ui/input/input.component';
import { WordmarkComponent } from '../ui/wordmark/wordmark.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, InputComponent, WordmarkComponent],
  template: `
    <div class="min-h-screen bg-page flex flex-col items-center justify-center p-4">
      <a routerLink="/" class="mb-[32px] hover:opacity-90 transition-opacity">
        <app-wordmark [size]="40"></app-wordmark>
      </a>
      
      <div class="bg-surface border border-border rounded-[16px] w-full max-w-[400px] p-[32px] shadow-modal">
        <h2 class="text-[24px] font-bold tracking-[-0.025em] text-txt-primary mb-2 text-center">Crear Cuenta</h2>
        <p class="text-[14px] text-txt-muted mb-8 text-center">Únete a AuraStock y gestiona todo.</p>

        <!-- Banner de error -->
        <div *ngIf="errorMessage"
             class="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-[10px] px-4 py-3 mb-5 text-[13px] leading-snug">
          <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
        
        <form (submit)="onRegister($event)" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-txt-primary">Nombre de la empresa</label>
            <input type="text" name="companyName" [(ngModel)]="companyName"
              class="w-full bg-surface-2 border border-border rounded-[8px] px-3 py-2 text-[14px] text-txt-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-txt-dim"
              placeholder="Ej: Mi Empresa S.A." required>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-txt-primary">Usuario</label>
            <input type="text" name="username" [(ngModel)]="username"
              class="w-full bg-surface-2 border border-border rounded-[8px] px-3 py-2 text-[14px] text-txt-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-txt-dim"
              placeholder="Ej: admin" required>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-txt-primary">Email</label>
            <input type="email" name="email" [(ngModel)]="email"
              class="w-full bg-surface-2 border border-border rounded-[8px] px-3 py-2 text-[14px] text-txt-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-txt-dim"
              placeholder="Ej: usuario@correo.com" required>
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-medium text-txt-primary">Contraseña</label>
            <input type="password" name="password" [(ngModel)]="password"
              class="w-full bg-surface-2 border border-border rounded-[8px] px-3 py-2 text-[14px] text-txt-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-txt-dim"
              placeholder="••••••••" required>
          </div>
          
          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-accent hover:bg-accent-light text-white font-semibold text-[14px] py-[12px] rounded-[8px] transition-colors mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <svg *ngIf="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>
        
        <div class="mt-6 text-center text-[13px] text-txt-dim">
          ¿Ya tienes cuenta? <a routerLink="/login" class="text-accent-light hover:underline font-medium">Entrar</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  companyName = '';
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private router: Router, private authService: AuthService) {}

  onRegister(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.loading = true;

    this.authService.register({
      company_name: this.companyName,
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.detail ||
          'Ocurrió un error al registrar el usuario. Intentá nuevamente.';
      }
    });
  }
}
