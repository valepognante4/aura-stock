import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WordmarkComponent } from '../wordmark/wordmark.component';

@Component({
  selector: 'app-navbar-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, WordmarkComponent],
  template: `
    <nav class="sticky top-0 z-50 h-[64px] bg-[rgba(11,14,20,0.9)] backdrop-blur-[14px] border-b border-border px-[40px] flex items-center justify-between">
      <!-- Left -->
      <a routerLink="/" class="hover:opacity-90 transition-opacity">
        <app-wordmark [size]="32"></app-wordmark>
      </a>

      <!-- Right -->
      <div class="flex items-center gap-4">
        <a routerLink="/login" class="text-[13px] font-semibold text-txt-body hover:text-txt-primary transition-colors px-4 py-2">
          Iniciar sesión
        </a>
        <a routerLink="/register" class="bg-accent hover:bg-accent-light text-white text-[13px] font-semibold px-[20px] py-[10px] rounded-lg transition-colors">
          Comenzar gratis
        </a>
      </div>
    </nav>
  `
})
export class NavbarLandingComponent {}
