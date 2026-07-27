import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FeatureIcon = 'sync' | 'tax' | 'bell' | 'shield';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-border rounded-[14px] py-[26px] px-[22px] flex flex-col h-full transition-all duration-200 hover:border-border-strong">
      <div class="flex items-center justify-center w-[40px] h-[40px] bg-accent-bg border border-accent-border rounded-[10px] text-accent-light mb-[18px]">
        @switch (icon) {
          @case ('sync') {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
              <path d="M4 12a8 8 0 0 1 14.2-5"/>
              <path d="M20 4v5h-5"/>
              <path d="M20 12a8 8 0 0 1-14.2 5"/>
              <path d="M4 20v-5h5"/>
            </svg>
          }
          @case ('tax') {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
              <path d="M3 3v18h18"/>
              <path d="M7 15l4-4 3 3 5-6"/>
            </svg>
          }
          @case ('bell') {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          }
          @case ('shield') {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[18px] h-[18px]">
              <path d="M12 3l7 3.5v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9v-5L12 3Z"/>
              <path d="m9.5 12 1.8 1.8L15 10"/>
            </svg>
          }
        }
      </div>
      <h3 class="text-[14.5px] font-semibold text-txt-primary mb-2 leading-[1.35]">
        {{ title }}
      </h3>
      <p class="text-[13px] text-txt-muted leading-[1.65]">
        {{ description }}
      </p>
    </div>
  `
})
export class FeatureCardComponent {
  @Input() icon: FeatureIcon = 'sync';
  @Input() title: string = '';
  @Input() description: string = '';
}
