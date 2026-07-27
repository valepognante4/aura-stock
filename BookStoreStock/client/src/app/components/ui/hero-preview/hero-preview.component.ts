import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-border rounded-[16px] p-[22px] shadow-hero">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <span class="text-[12px] font-medium text-txt-dim">Inventario — Jul 2026</span>
        <div class="flex items-center gap-2 px-[9px] py-[2px] bg-success-bg text-success rounded-full text-[11px] font-medium">
          <span class="text-[8px]">●</span> Sincronizado
        </div>
      </div>

      <!-- Metric mini-grid -->
      <div class="grid grid-cols-3 gap-[10px] mb-6">
        <div class="bg-page border border-border rounded-lg p-[12px]">
          <div class="text-[19px] font-bold text-txt-primary font-mono tabular-nums leading-none mb-1">1,482</div>
          <div class="text-[11px] text-txt-dim font-medium uppercase tracking-wider">Total</div>
        </div>
        <div class="bg-page border border-border rounded-lg p-[12px]">
          <div class="text-[19px] font-bold text-txt-primary font-mono tabular-nums leading-none mb-1">$42K</div>
          <div class="text-[11px] text-txt-dim font-medium uppercase tracking-wider">Valor</div>
        </div>
        <div class="bg-page border border-border rounded-lg p-[12px]">
          <div class="text-[19px] font-bold text-warning font-mono tabular-nums leading-none mb-1">8</div>
          <div class="text-[11px] text-txt-dim font-medium uppercase tracking-wider">Bajo</div>
        </div>
      </div>

      <!-- Mini-tabla -->
      <div class="w-full">
        <div class="grid grid-cols-[2fr_1fr_1fr] pb-2 border-b border-border text-[10px] font-semibold text-txt-dim uppercase tracking-[0.05em]">
          <div>Producto</div>
          <div class="text-right">Precio</div>
          <div class="text-right">Stock</div>
        </div>
        
        <div class="grid grid-cols-[2fr_1fr_1fr] py-3 border-b border-border text-[12px] items-center">
          <div class="text-txt-primary font-medium truncate pr-2">MacBook Air M2</div>
          <div class="text-right text-txt-primary font-mono tabular-nums font-medium">$1,199</div>
          <div class="text-right text-success font-mono font-bold tabular-nums">45</div>
        </div>
        
        <div class="grid grid-cols-[2fr_1fr_1fr] py-3 border-b border-border text-[12px] items-center">
          <div class="text-txt-primary font-medium truncate pr-2">AirPods Pro</div>
          <div class="text-right text-txt-primary font-mono tabular-nums font-medium">$249</div>
          <div class="text-right text-warning font-mono font-bold tabular-nums">12</div>
        </div>
        
        <div class="grid grid-cols-[2fr_1fr_1fr] py-3 text-[12px] items-center">
          <div class="text-txt-primary font-medium truncate pr-2">Magic Mouse</div>
          <div class="text-right text-txt-primary font-mono tabular-nums font-medium">$79</div>
          <div class="text-right text-danger font-mono font-bold tabular-nums">4</div>
        </div>
      </div>

    </div>
  `
})
export class HeroPreviewComponent {}
