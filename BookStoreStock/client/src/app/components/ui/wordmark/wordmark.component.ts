import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type WordmarkVariant = 'gradient' | 'mono';

@Component({
  selector: 'app-wordmark',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center" [style.gap.px]="size * 0.3">
      <div
        class="flex items-center justify-center shrink-0"
        [class.bg-gradient-user]="variant === 'gradient'"
        [class.bg-surface-2]="variant === 'mono'"
        [class.border]="variant === 'mono'"
        [class.border-border-strong]="variant === 'mono'"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.borderRadius]="(size * 0.28) + 'px'"
        [style.boxShadow]="variant === 'gradient' ? '0 2px 10px rgba(15, 156, 142, 0.35)' : 'none'">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          [attr.stroke]="variant === 'gradient' ? 'white' : 'currentColor'"
          stroke-width="2.1"
          stroke-linecap="round"
          stroke-linejoin="round"
          [class.text-accent-light]="variant === 'mono'"
          [style.width.px]="size * 0.52"
          [style.height.px]="size * 0.52">
          <path d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      </div>
      <span
        class="font-bold tracking-[-0.02em] leading-none whitespace-nowrap"
        [style.fontSize]="(size * 0.62) + 'px'">
        <span class="text-txt-primary">Aura</span><span class="text-accent-light">Stock</span>
      </span>
    </div>
  `
})
export class WordmarkComponent {
  @Input() size: number = 32; // Default size in px
  @Input() variant: WordmarkVariant = 'gradient';
}
