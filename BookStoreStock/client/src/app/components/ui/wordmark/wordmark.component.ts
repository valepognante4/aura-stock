import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wordmark',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-3">
      <div 
        class="flex items-center justify-center bg-accent text-white font-bold"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.borderRadius]="(size * 0.22) + 'px'"
        [style.fontSize]="(size * 0.6) + 'px'">
        S
      </div>
      <span 
        class="font-semibold tracking-[-0.015em] text-txt-primary"
        [style.fontSize]="(size * 0.8) + 'px'">
        StockFlow
      </span>
    </div>
  `
})
export class WordmarkComponent {
  @Input() size: number = 32; // Default size in px
}
