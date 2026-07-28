import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WordmarkComponent } from '../ui/wordmark/wordmark.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, WordmarkComponent],
  styles: [`
    /* ── Modal backdrop ── */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 50;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    /* ── Modal card ── */
    .modal-card {
      background: #18181b;
      border: 1px solid #3f3f46;
      border-radius: 20px;
      padding: 36px 32px 32px;
      width: 100%; max-width: 420px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.12);
      animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
      position: relative;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: none } }

    /* ── Modal close btn ── */
    .modal-close {
      position: absolute; top: 16px; right: 16px;
      background: #27272a; border: none; color: #a1a1aa;
      width: 32px; height: 32px; border-radius: 8px;
      cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .modal-close:hover { background: #3f3f46; color: #fff; }

    /* ── Modal title ── */
    .modal-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: linear-gradient(135deg,#7c3aed22,#a855f722);
      border: 1px solid #7c3aed44;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; margin: 0 auto 20px;
    }
    .modal-title { font-size: 20px; font-weight: 700; color: #f4f4f5; text-align: center; margin: 0 0 6px; }
    .modal-subtitle { font-size: 13px; color: #71717a; text-align: center; margin: 0 0 24px; line-height: 1.5; }

    /* ── Modal input ── */
    .modal-input {
      width: 100%; box-sizing: border-box;
      background: #09090b; border: 1.5px solid #27272a;
      border-radius: 10px; padding: 12px 14px;
      font-size: 14px; color: #f4f4f5;
      outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    }
    .modal-input::placeholder { color: #52525b; }
    .modal-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.18); }
    .modal-input.error-input { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }

    /* ── Error / success messages ── */
    .modal-error {
      display: flex; align-items: center; gap: 8px;
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
      border-radius: 8px; padding: 10px 12px;
      color: #fca5a5; font-size: 13px; margin-top: 10px;
    }
    .modal-success {
      display: flex; align-items: flex-start; gap: 10px;
      background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.22);
      border-radius: 10px; padding: 14px 16px;
      color: #86efac; font-size: 13.5px; line-height: 1.55;
    }

    /* ── Submit button ── */
    .modal-btn {
      width: 100%; margin-top: 18px;
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border: none; border-radius: 10px;
      color: #fff; font-weight: 600; font-size: 14px;
      padding: 13px; cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
    }
    .modal-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .modal-btn:active:not(:disabled) { transform: translateY(0); }
    .modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Forgot link ── */
    .forgot-link {
      background: none; border: none; padding: 0;
      color: #7c3aed; font-size: 13px; cursor: pointer;
      text-decoration: underline; text-underline-offset: 2px;
      transition: color 0.15s;
    }
    .forgot-link:hover { color: #a855f7; }

    /* ── Spinner ── */
    .spinner {
      display: inline-block; width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite; margin-right: 6px;
      vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg) } }
  `],
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
          
          <!-- Olvidé mi contraseña -->
          <div class="flex justify-end" style="margin-top: -8px">
            <button type="button" class="forgot-link" (click)="openForgotModal()">
              ¿Olvidaste tu contraseña?
            </button>
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

    <!-- ══════════════════════════════════════════════
         MODAL: Recuperación de contraseña
    ══════════════════════════════════════════════ -->
    <div *ngIf="showForgotModal" class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-card" id="forgot-password-modal">
        
        <!-- Botón cerrar -->
        <button class="modal-close" (click)="closeForgotModal()" title="Cerrar">✕</button>

        <!-- Icono decorativo -->
        <div class="modal-icon">🔑</div>

        <h3 class="modal-title">Recuperar contraseña</h3>
        <p class="modal-subtitle">
          Ingresá tu correo de Gmail y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <!-- Estado de éxito -->
        <div *ngIf="forgotSuccess" class="modal-success">
          <span style="font-size: 20px; flex-shrink:0">✅</span>
          <div>
            <strong style="display:block; margin-bottom:4px">¡Correo enviado!</strong>
            Si tu dirección está registrada, recibirás el enlace de recuperación en los próximos minutos.
            Revisá también tu carpeta de spam.
          </div>
        </div>

        <!-- Formulario (se oculta tras el éxito) -->
        <ng-container *ngIf="!forgotSuccess">
          <div class="flex flex-col gap-1.5">
            <label style="font-size:13px; font-weight:500; color:#a1a1aa">Correo electrónico</label>
            <input
              id="forgot-email-input"
              type="email"
              [(ngModel)]="forgotEmail"
              (input)="onForgotEmailInput()"
              [class.error-input]="forgotError"
              class="modal-input"
              placeholder="tu@gmail.com"
              autocomplete="email"
            >
          </div>

          <!-- Mensaje de error de validación -->
          <div *ngIf="forgotError" class="modal-error">
            <span>⚠️</span>
            <span>{{ forgotError }}</span>
          </div>

          <button
            id="forgot-submit-btn"
            class="modal-btn"
            [disabled]="forgotLoading"
            (click)="onForgotSubmit()"
          >
            <span *ngIf="forgotLoading" class="spinner"></span>
            {{ forgotLoading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
          </button>
        </ng-container>

        <!-- Volver al login -->
        <div style="text-align:center; margin-top:20px">
          <button class="forgot-link" (click)="closeForgotModal()">
            ← Volver al inicio de sesión
          </button>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  // ── Login ──────────────────────────────────────────────────────────────────
  email = '';
  password = '';
  errorMessage = '';

  // ── Forgot password modal ──────────────────────────────────────────────────
  showForgotModal = false;
  forgotEmail = '';
  forgotError = '';
  forgotSuccess = false;
  forgotLoading = false;

  constructor(private router: Router, private authService: AuthService) {}

  // ── Login logic ────────────────────────────────────────────────────────────
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

  // ── Modal logic ────────────────────────────────────────────────────────────
  openForgotModal() {
    this.forgotEmail = '';
    this.forgotError = '';
    this.forgotSuccess = false;
    this.forgotLoading = false;
    this.showForgotModal = true;
  }

  closeForgotModal() {
    this.showForgotModal = false;
  }

  /** Cierra el modal al hacer clic en el backdrop (fuera de la tarjeta) */
  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      this.closeForgotModal();
    }
  }

  /** Limpia el error cuando el usuario escribe */
  onForgotEmailInput() {
    if (this.forgotError) {
      this.forgotError = '';
    }
  }

  /** Valida el email y llama al backend */
  onForgotSubmit() {
    const email = this.forgotEmail.trim();

    // Validación: campo vacío
    if (!email) {
      this.forgotError = 'El correo electrónico es obligatorio.';
      return;
    }

    // Validación: formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.forgotError = 'El formato del correo no es válido. Ej: nombre@gmail.com';
      return;
    }

    this.forgotError = '';
    this.forgotLoading = true;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.forgotLoading = false;
        this.forgotSuccess = true;
      },
      error: (err) => {
        this.forgotLoading = false;
        const detail = err.error?.detail;
        this.forgotError = typeof detail === 'string'
          ? detail
          : 'Ocurrió un error al procesar la solicitud. Intentá de nuevo.';
      }
    });
  }
}
