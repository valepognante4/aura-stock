import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      aria-live="polite"
      aria-atomic="false"
      class="fixed bottom-[24px] right-[24px] z-[9999] flex flex-col gap-[10px] pointer-events-none"
      style="max-width: 380px; width: calc(100vw - 48px);"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast-item flex items-start gap-[12px] px-[16px] py-[14px] rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] border pointer-events-auto cursor-pointer backdrop-blur-sm"
          [ngClass]="toastClass(toast.type)"
          (click)="toastService.dismiss(toast.id)"
          role="alert"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-[1px]">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="m9 11 3 3L22 4"/>
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m15 9-6 6"/>
                  <path d="m9 9 6 6"/>
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
                  <path d="M12 4 3 20h18L12 4Z"/>
                  <path d="M12 10v4"/>
                  <path d="M12 17h.01"/>
                </svg>
              }
              @default {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              }
            }
          </div>

          <!-- Message -->
          <span class="text-[13px] font-medium leading-[1.5] flex-1">{{ toast.message }}</span>

          <!-- Dismiss button -->
          <button
            type="button"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-[1px]"
            (click)="$event.stopPropagation(); toastService.dismiss(toast.id)"
            aria-label="Cerrar notificación"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-[14px] h-[14px]">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-item {
      animation: toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes toast-slide-in {
      from {
        opacity: 0;
        transform: translateX(60px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  toastClass(type: ToastType): Record<string, boolean> {
    return {
      // Success — teal/verde
      'bg-[#0d2e2a] border-[#0F9C8E]/40 text-[#5af0e1]': type === 'success',
      // Error — rojo oscuro
      'bg-[#2e0d0d] border-red-500/40 text-red-300': type === 'error',
      // Warning — ámbar
      'bg-[#2e200d] border-amber-500/40 text-amber-300': type === 'warning',
      // Info — azul pizarra
      'bg-[#0d1a2e] border-blue-500/40 text-blue-300': type === 'info',
    };
  }
}
