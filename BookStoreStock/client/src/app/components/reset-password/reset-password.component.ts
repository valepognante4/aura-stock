import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WordmarkComponent } from '../ui/wordmark/wordmark.component';
import { AuthService } from '../../services/auth.service';

type ViewState = 'form' | 'success' | 'invalid-token';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, WordmarkComponent],
  styles: [`
    /* ── Page layout ── */
    .rp-page {
      min-height: 100vh;
      background: #0A0C10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* ── Card ── */
    .rp-card {
      background: rgba(18, 21, 27, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      padding: 40px 36px 36px;
      width: 100%;
      max-width: 420px;
      box-shadow:
        0 24px 80px rgba(0,0,0,0.60),
        0 0 0 1px rgba(15,156,142,0.08),
        inset 0 1px 0 rgba(255,255,255,0.04);
      animation: cardIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both;
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(28px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }

    /* ── Icon badge ── */
    .rp-icon {
      width: 60px; height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(15,156,142,0.15), rgba(42,182,201,0.10));
      border: 1px solid rgba(15,156,142,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px;
      margin: 0 auto 22px;
      box-shadow: 0 4px 20px rgba(15,156,142,0.15);
    }

    /* ── Title / subtitle ── */
    .rp-title {
      font-size: 22px; font-weight: 700;
      color: #F3F5F7; text-align: center;
      margin: 0 0 8px;
      letter-spacing: -0.025em;
    }
    .rp-subtitle {
      font-size: 13.5px; color: #69727D;
      text-align: center; margin: 0 0 28px;
      line-height: 1.55;
    }

    /* ── Label / input group ── */
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }
    .field-label {
      font-size: 13px;
      font-weight: 500;
      color: #98A2AE;
    }
    .field-input {
      width: 100%;
      box-sizing: border-box;
      background: #0D1015;
      border: 1.5px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      color: #F3F5F7;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      font-family: inherit;
    }
    .field-input::placeholder { color: #4B525C; }
    .field-input:focus {
      border-color: #0F9C8E;
      box-shadow: 0 0 0 3px rgba(15,156,142,0.18);
    }
    .field-input.field-error {
      border-color: #F87171;
      box-shadow: 0 0 0 3px rgba(248,113,113,0.14);
    }
    .field-input.field-ok {
      border-color: rgba(15,156,142,0.50);
    }

    /* ── Password strength bar ── */
    .strength-bar-wrap {
      height: 4px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      overflow: hidden;
      margin-top: 6px;
    }
    .strength-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease, background 0.3s ease;
    }
    .strength-label {
      font-size: 11px;
      margin-top: 4px;
      font-weight: 500;
    }

    /* ── Validation hints ── */
    .hint-list {
      list-style: none;
      padding: 0; margin: 6px 0 0;
      display: flex; flex-direction: column; gap: 4px;
    }
    .hint-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #69727D;
      transition: color 0.2s;
    }
    .hint-item.hint-ok { color: #4ADE80; }
    .hint-item.hint-err { color: #F87171; }
    .hint-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
      transition: background 0.2s;
    }

    /* ── Match indicator ── */
    .match-row {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; margin-top: 6px;
      transition: color 0.2s;
    }
    .match-row.match-ok  { color: #4ADE80; }
    .match-row.match-err { color: #F87171; }

    /* ── Error banner ── */
    .err-banner {
      display: flex; align-items: center; gap: 8px;
      background: rgba(248,113,113,0.10);
      border: 1px solid rgba(248,113,113,0.22);
      border-radius: 10px; padding: 11px 14px;
      color: #FCA5A5; font-size: 13px;
      margin-bottom: 16px;
    }

    /* ── Submit button ── */
    .rp-btn {
      width: 100%; margin-top: 8px;
      background: linear-gradient(135deg, #0F9C8E, #2AB6C9);
      border: none; border-radius: 10px;
      color: #fff; font-weight: 600; font-size: 14px;
      padding: 13px; cursor: pointer;
      transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
      font-family: inherit;
      box-shadow: 0 4px 20px rgba(15,156,142,0.28);
    }
    .rp-btn:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 6px 26px rgba(15,156,142,0.38);
    }
    .rp-btn:active:not(:disabled) { transform: translateY(0); }
    .rp-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

    /* ── Success state ── */
    .success-icon {
      width: 68px; height: 68px;
      border-radius: 50%;
      background: rgba(74,222,128,0.10);
      border: 1px solid rgba(74,222,128,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 30px; margin: 0 auto 22px;
      animation: popIn 0.4s cubic-bezier(0.34,1.7,0.64,1) both;
    }
    @keyframes popIn {
      from { opacity:0; transform: scale(0.5); }
      to   { opacity:1; transform: scale(1); }
    }
    .success-title { font-size: 22px; font-weight: 700; color: #F3F5F7; text-align: center; margin: 0 0 8px; }
    .success-sub   { font-size: 13.5px; color: #69727D; text-align: center; margin: 0 0 6px; line-height: 1.55; }
    .countdown-txt { font-size: 12px; color: #4ADE80; text-align: center; margin: 0 0 24px; }

    /* ── Invalid token state ── */
    .invalid-icon {
      width: 60px; height: 60px;
      border-radius: 50%;
      background: rgba(248,113,113,0.10);
      border: 1px solid rgba(248,113,113,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; margin: 0 auto 22px;
    }

    /* ── Divider ── */
    .rp-divider {
      height: 1px;
      background: rgba(255,255,255,0.06);
      margin: 24px 0 20px;
    }

    /* ── Footer link ── */
    .rp-link {
      background: none; border: none; padding: 0;
      color: #0F9C8E; font-size: 13px; cursor: pointer;
      text-decoration: none; font-family: inherit;
      transition: color 0.15s;
    }
    .rp-link:hover { color: #34D6C4; }

    /* ── Spinner ── */
    .spinner {
      display: inline-block; width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-right: 6px; vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg) } }
  `],
  template: `
    <div class="rp-page">
      <!-- Wordmark logo -->
      <a routerLink="/" class="mb-8 hover:opacity-80 transition-opacity">
        <app-wordmark [size]="38"></app-wordmark>
      </a>

      <div class="rp-card">

        <!-- ══ ESTADO: Token inválido / expirado ══ -->
        <ng-container *ngIf="viewState === 'invalid-token'">
          <div class="invalid-icon">🔗</div>
          <h2 class="rp-title">Enlace inválido</h2>
          <p class="rp-subtitle">
            Este enlace de recuperación ya expiró o no es válido.<br>
            Los enlaces tienen una validez de <strong style="color:#F3F5F7">1 hora</strong>.
          </p>
          <div class="rp-divider"></div>
          <div style="text-align:center">
            <a routerLink="/login" class="rp-link">← Volver al inicio de sesión</a>
            &nbsp;·&nbsp;
            <a routerLink="/login" class="rp-link" style="color:#98A2AE">Solicitar nuevo enlace</a>
          </div>
        </ng-container>

        <!-- ══ ESTADO: Éxito ══ -->
        <ng-container *ngIf="viewState === 'success'">
          <div class="success-icon">✅</div>
          <h2 class="success-title">¡Contraseña actualizada!</h2>
          <p class="success-sub">Tu contraseña fue restablecida correctamente.</p>
          <p class="countdown-txt">Redirigiendo al login en {{ countdown }}s...</p>
          <button class="rp-btn" (click)="goToLogin()">Ir al inicio de sesión ahora</button>
        </ng-container>

        <!-- ══ ESTADO: Formulario ══ -->
        <ng-container *ngIf="viewState === 'form'">
          <div class="rp-icon">🔐</div>
          <h2 class="rp-title">Nueva contraseña</h2>
          <p class="rp-subtitle">Elegí una contraseña segura para tu cuenta.</p>

          <!-- Banner de error del servidor -->
          <div *ngIf="serverError" class="err-banner">
            <span>⚠️</span>
            <span>{{ serverError }}</span>
          </div>

          <!-- Campo: Nueva contraseña -->
          <div class="field-group">
            <label class="field-label">Nueva contraseña</label>
            <input
              id="new-password-input"
              type="password"
              [(ngModel)]="newPassword"
              (input)="onPasswordInput()"
              [class.field-error]="newPasswordTouched && !isLengthOk"
              [class.field-ok]="newPasswordTouched && isLengthOk"
              class="field-input"
              placeholder="Mínimo 8 caracteres"
              autocomplete="new-password"
            >

            <!-- Barra de fortaleza -->
            <div *ngIf="newPassword.length > 0">
              <div class="strength-bar-wrap">
                <div
                  class="strength-bar-fill"
                  [style.width.%]="strengthPercent"
                  [style.background]="strengthColor"
                ></div>
              </div>
              <span class="strength-label" [style.color]="strengthColor">{{ strengthLabel }}</span>
            </div>

            <!-- Hints de validación -->
            <ul class="hint-list" *ngIf="newPasswordTouched">
              <li class="hint-item" [class.hint-ok]="isLengthOk" [class.hint-err]="!isLengthOk">
                <span class="hint-dot"></span>
                Mínimo 8 caracteres
              </li>
              <li class="hint-item" [class.hint-ok]="hasUppercase" [class.hint-err]="newPasswordTouched && !hasUppercase">
                <span class="hint-dot"></span>
                Al menos una mayúscula (recomendado)
              </li>
              <li class="hint-item" [class.hint-ok]="hasNumber" [class.hint-err]="newPasswordTouched && !hasNumber">
                <span class="hint-dot"></span>
                Al menos un número (recomendado)
              </li>
            </ul>
          </div>

          <!-- Campo: Confirmar contraseña -->
          <div class="field-group">
            <label class="field-label">Confirmar contraseña</label>
            <input
              id="confirm-password-input"
              type="password"
              [(ngModel)]="confirmPassword"
              (input)="onConfirmInput()"
              [class.field-error]="confirmTouched && !passwordsMatch"
              [class.field-ok]="confirmTouched && passwordsMatch && confirmPassword.length > 0"
              class="field-input"
              placeholder="Repetí tu contraseña"
              autocomplete="new-password"
            >

            <!-- Indicador de coincidencia -->
            <div
              *ngIf="confirmTouched && confirmPassword.length > 0"
              class="match-row"
              [class.match-ok]="passwordsMatch"
              [class.match-err]="!passwordsMatch"
            >
              <span>{{ passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden' }}</span>
            </div>
          </div>

          <!-- Botón submit -->
          <button
            id="reset-submit-btn"
            class="rp-btn"
            [disabled]="!isFormValid || loading"
            (click)="onSubmit()"
          >
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Actualizando...' : 'Restablecer contraseña' }}
          </button>

          <div class="rp-divider"></div>
          <div style="text-align:center">
            <a routerLink="/login" class="rp-link">← Volver al inicio de sesión</a>
          </div>
        </ng-container>

      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  // ── Estado de la vista ─────────────────────────────────────────────────────
  viewState: ViewState = 'form';
  token = '';

  // ── Campos del formulario ──────────────────────────────────────────────────
  newPassword = '';
  confirmPassword = '';

  // ── Flags de interacción ───────────────────────────────────────────────────
  newPasswordTouched = false;
  confirmTouched = false;
  loading = false;
  serverError = '';

  // ── Countdown para redirección ─────────────────────────────────────────────
  countdown = 4;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Leer el token desde la URL: /reset-password?token=...
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.viewState = 'invalid-token';
    }
  }

  // ── Validaciones reactivas ─────────────────────────────────────────────────
  get isLengthOk()     { return this.newPassword.length >= 8; }
  get hasUppercase()   { return /[A-Z]/.test(this.newPassword); }
  get hasNumber()      { return /[0-9]/.test(this.newPassword); }
  get passwordsMatch() { return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0; }
  get isFormValid()    { return this.isLengthOk && this.passwordsMatch; }

  // ── Barra de fortaleza ─────────────────────────────────────────────────────
  get strengthPercent(): number {
    const p = this.newPassword;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8)  score += 33;
    if (/[A-Z]/.test(p)) score += 33;
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score += 34;
    return score;
  }

  get strengthColor(): string {
    const s = this.strengthPercent;
    if (s <= 33) return '#F87171';
    if (s <= 66) return '#FBBF24';
    return '#4ADE80';
  }

  get strengthLabel(): string {
    const s = this.strengthPercent;
    if (s <= 33) return 'Débil';
    if (s <= 66) return 'Media';
    return 'Fuerte';
  }

  // ── Eventos de input ───────────────────────────────────────────────────────
  onPasswordInput() {
    this.newPasswordTouched = true;
    this.serverError = '';
  }

  onConfirmInput() {
    this.confirmTouched = true;
    this.serverError = '';
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  onSubmit() {
    this.newPasswordTouched = true;
    this.confirmTouched = true;

    if (!this.isFormValid) return;

    this.loading = true;
    this.serverError = '';

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.viewState = 'success';
        this.startCountdown();
      },
      error: (err) => {
        this.loading = false;
        const detail = err.error?.detail;
        if (typeof detail === 'string' && detail.includes('inválido')) {
          this.viewState = 'invalid-token';
        } else {
          this.serverError = typeof detail === 'string'
            ? detail
            : 'Ocurrió un error al restablecer la contraseña. Intentá de nuevo.';
        }
      }
    });
  }

  // ── Countdown y redirección ────────────────────────────────────────────────
  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval!);
        this.goToLogin();
      }
    }, 1000);
  }

  goToLogin() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.router.navigate(['/login']);
  }
}
