import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { WordmarkComponent } from '../wordmark/wordmark.component';
import { AuthService, UserResponse } from '../../../services/auth.service';
import { Product, ProductService } from '../../../services/product.service';

const LOW_STOCK_THRESHOLD = 10;

@Component({
  selector: 'app-navbar-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, WordmarkComponent],
  template: `
    <nav class="sticky top-0 z-50 h-[64px] bg-[rgba(10,12,16,0.92)] backdrop-blur-[14px] border-b border-border px-[32px] flex items-center justify-between">
      <!-- Left -->
      <div class="flex items-center">
        <a routerLink="/" class="hover:opacity-90 transition-opacity">
          <app-wordmark [size]="26"></app-wordmark>
        </a>
        <div class="w-[1px] h-[22px] bg-border mx-7"></div>
        <div class="flex items-center gap-1">
          <a routerLink="/products" routerLinkActive="bg-accent-bg text-accent-light"
             class="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-[7px] text-[13px] font-semibold transition-colors duration-150
                    text-txt-muted hover:text-txt-primary hover:bg-surface-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[15px] h-[15px]">
              <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z"/>
              <path d="M3 7.5 12 12l9-4.5"/>
              <path d="M12 12v9"/>
            </svg>
            Inventario
          </a>
          <a routerLink="/reports" routerLinkActive="bg-accent-bg text-accent-light"
             class="inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-[7px] text-[13px] font-semibold transition-colors duration-150
                    text-txt-muted hover:text-txt-primary hover:bg-surface-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[15px] h-[15px]">
              <path d="M4 20V10"/>
              <path d="M10 20V4"/>
              <path d="M16 20v-7"/>
              <path d="M3 20h18"/>
            </svg>
            Reportes
          </a>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center">
        <div class="relative" #notificationsRef>
          <button
            type="button"
            (click)="toggleNotifications($event)"
            class="relative text-txt-dim hover:text-txt-primary hover:bg-surface-2 transition-colors duration-150 p-[8px] rounded-[8px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            @if (lowStockAlerts().length > 0) {
              <span class="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-page">
                {{ lowStockAlerts().length > 9 ? '9+' : lowStockAlerts().length }}
              </span>
            }
          </button>

          @if (showNotifications()) {
            <div (click)="$event.stopPropagation()" class="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-surface border border-border rounded-[10px] shadow-modal z-50 overflow-hidden">
              <div class="px-4 py-3 border-b border-border">
                <h3 class="text-[14px] font-semibold text-txt-primary">Notificaciones</h3>
                <p class="text-[11px] text-txt-muted mt-0.5">Alertas del sistema</p>
              </div>

              <div class="max-h-[280px] overflow-y-auto">
                @if (lowStockAlerts().length === 0) {
                  <div class="px-4 py-6 text-center text-[13px] text-txt-muted">
                    No hay alertas pendientes
                  </div>
                } @else {
                  @for (product of lowStockAlerts(); track product.id) {
                    <div class="px-4 py-3 border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors">
                      <div class="flex items-start gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-[14px] h-[14px] mt-[3px] text-warning shrink-0">
                          <path d="M12 4 3 20h18L12 4Z"/>
                          <path d="M12 10v4"/>
                          <path d="M12 17h.01"/>
                        </svg>
                        <div class="flex-1 min-w-0">
                          <p class="text-[13px] font-medium text-txt-primary truncate">{{ product.name }}</p>
                          <p class="text-[11px] text-txt-muted mt-0.5">
                            Stock bajo: <span class="text-danger font-semibold">{{ product.stock_quantity }} unidades</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                }
              </div>

              @if (lowStockAlerts().length > 0) {
                <div class="px-4 py-2.5 border-t border-border bg-surface-2/30">
                  <a routerLink="/reports" (click)="showNotifications.set(false)"
                     class="text-[12px] text-accent-light hover:underline font-medium">
                    Ver reporte completo →
                  </a>
                </div>
              }
            </div>
          }
        </div>

        <div class="w-[1px] h-[22px] bg-border mx-4"></div>
        <div class="flex items-center gap-3">
          <label class="relative cursor-pointer group" title="Cambiar logo de la empresa">
            <input type="file" accept="image/*" class="hidden" (change)="onLogoSelected($event)">
            <div class="w-[32px] h-[32px] rounded-full overflow-hidden bg-gradient-user flex items-center justify-center text-white font-bold text-[14px] ring-2 ring-transparent group-hover:ring-accent transition-all">
              <img *ngIf="user?.company_logo" [src]="user!.company_logo!" alt="Logo" class="w-full h-full object-cover">
              <span *ngIf="!user?.company_logo">{{ companyInitial }}</span>
            </div>
          </label>
          <div class="flex flex-col">
            <span class="text-[13px] font-medium text-txt-primary leading-tight">{{ user?.company_name || 'Mi Empresa' }}</span>
            <span class="text-[11px] text-txt-dim leading-tight">{{ user?.username || 'Usuario' }}</span>
          </div>
        </div>
        <button (click)="onLogout()" class="ml-6 inline-flex items-center gap-[6px] px-[13px] py-[7px] rounded-[7px] text-[13px] font-medium text-txt-sub border border-border hover:border-border-strong hover:bg-surface-2 hover:text-txt-primary transition-all duration-150">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[14px] h-[14px]">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <path d="M16 17l5-5-5-5"/>
            <path d="M21 12H9"/>
          </svg>
          Salir
        </button>
      </div>
    </nav>
  `
})
export class NavbarDashboardComponent implements OnInit {
  user: UserResponse | null = null;
  showNotifications = signal(false);
  lowStockAlerts = signal<Product[]>([]);

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getSession();
    this.loadAlerts();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showNotifications.set(false);
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications.update((v) => !v);
  }

  get companyInitial(): string {
    const name = this.user?.company_name?.trim();
    return name ? name.charAt(0).toUpperCase() : 'E';
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.user) return;

    const reader = new FileReader();
    reader.onload = () => {
      const logoData = reader.result as string;
      this.authService.updateLogo(this.user!.id, logoData).subscribe({
        next: (updated) => {
          this.user = updated;
        }
      });
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }

  private loadAlerts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        const products = Array.isArray(data) ? data : [];
        this.lowStockAlerts.set(
          products
            .filter((p) => p.stock_quantity < LOW_STOCK_THRESHOLD)
            .sort((a, b) => a.stock_quantity - b.stock_quantity)
        );
      },
      error: () => {
        this.lowStockAlerts.set([]);
      }
    });
  }
}
