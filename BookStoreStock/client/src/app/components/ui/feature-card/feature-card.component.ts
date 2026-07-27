import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-border rounded-[12px] py-[24px] px-[20px] flex flex-col h-full">
      <div class="flex items-center justify-center w-[38px] h-[38px] bg-accent-bg border border-accent-border rounded-[9px] text-accent-light text-[16px] mb-[16px]">
        {{ icon }}
      </div>
      <h3 class="text-[14px] font-semibold text-txt-primary mb-2 leading-[1.35]">
        {{ title }}
      </h3>
      <p class="text-[13px] text-txt-muted leading-[1.65]">
        {{ description }}
      </p>
    </div>
  `
})
export class FeatureCardComponent {
  @Input() icon: string = '✧';
  @Input() title: string = '';
  @Input() description: string = '';
}
