import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarLandingComponent } from '../ui/navbar-landing/navbar-landing.component';
import { HeroPreviewComponent } from '../ui/hero-preview/hero-preview.component';
import { FeatureCardComponent } from '../ui/feature-card/feature-card.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarLandingComponent, HeroPreviewComponent, FeatureCardComponent],
  template: `
    <div class="min-h-screen bg-page flex flex-col">
      <app-navbar-landing></app-navbar-landing>
      
      <!-- Hero Section -->
      <section class="max-w-[1160px] mx-auto w-full pt-[88px] px-[40px] pb-[80px]">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-center">
          
          <!-- Text Content -->
          <div class="flex flex-col">
            <div class="inline-flex items-center gap-2 px-[14px] py-[4px] bg-accent-bg border border-accent-border rounded-[100px] mb-8 self-start">
              <span class="w-[6px] h-[6px] bg-accent-light rounded-full"></span>
              <span class="text-[11.5px] uppercase tracking-[0.06em] text-accent-light font-semibold">v2.0 Beta</span>
            </div>
            
            <h1 class="text-[54px] font-[800] tracking-[-0.035em] leading-[1.06] text-txt-primary mb-6">
              Gestión de inventario<br/>
              <span class="text-accent-light">sin fricción.</span>
            </h1>
            
            <p class="text-[17px] text-txt-sub leading-[1.7] mb-10 max-w-[480px]">
              Controla tu stock, calcula el IVA automáticamente y toma decisiones en tiempo real con una interfaz diseñada para la velocidad.
            </p>
            
            <div class="flex items-center gap-4">
              <a routerLink="/register" class="bg-accent hover:bg-accent-light text-white text-[15px] font-semibold px-[24px] py-[12px] rounded-lg transition-colors">
                Comenzar gratis
              </a>
              <a href="#features" class="text-txt-body font-semibold text-[15px] hover:text-txt-primary transition-colors px-[20px] py-[12px]">
                Explorar funciones
              </a>
            </div>
          </div>
          
          <!-- Preview -->
          <div class="relative">
            <app-hero-preview></app-hero-preview>
            <!-- Decorative gradient behind preview -->
            <div class="absolute -inset-4 bg-gradient-cta blur-[60px] -z-10 rounded-full opacity-50"></div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="max-w-[1160px] mx-auto w-full pt-[72px] px-[40px] pb-[96px] border-t border-border" 
               style="border-image: linear-gradient(90deg, transparent, #1E2330, transparent) 1;">
        <div class="text-center mb-16">
          <h2 class="text-[38px] font-bold tracking-[-0.03em] leading-[1.1] text-txt-primary mb-4">
            Todo lo que necesitas.
          </h2>
          <p class="text-[17px] text-txt-sub">Herramientas poderosas diseñadas para escalar contigo.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          <app-feature-card 
            icon="⚡" 
            title="Sincronización en tiempo real" 
            description="Cambios reflejados instantáneamente en todos tus dispositivos sin recargar.">
          </app-feature-card>
          
          <app-feature-card 
            icon="📊" 
            title="Cálculo de IVA integrado" 
            description="Asigna tramos impositivos y visualiza márgenes netos y brutos al vuelo.">
          </app-feature-card>
          
          <app-feature-card 
            icon="🔔" 
            title="Alertas de Stock" 
            description="Recibe notificaciones automáticas cuando tus productos alcancen niveles críticos.">
          </app-feature-card>
          
          <app-feature-card 
            icon="🛡️" 
            title="Seguridad de Nivel Empresarial" 
            description="Tus datos están encriptados y respaldados continuamente.">
          </app-feature-card>
        </div>
      </section>
    </div>
  `
})
export class WelcomeComponent {}

