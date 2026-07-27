import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MetricIcon = 'box' | 'value' | 'alert' | 'cycle';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group bg-surface border border-border rounded-[16px] py-[20px] px-[22px] transition-all duration-200 hover:border-border-strong hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
      <div class="flex items-start justify-between mb-[16px]">
        <span class="text-[10.5px] uppercase tracking-[0.09em] text-txt-dim font-semibold leading-tight pt-1">
          {{ label }}
        </span>
        <div class="shrink-0 flex items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-surface-2 border border-border text-txt-sub group-hover:text-accent-light group-hover:border-accent-border transition-colors duration-200">
          @switch (icon) {
            @case ('box') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[17px] h-[17px]">
                <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z"/>
                <path d="M3 7.5 12 12l9-4.5"/>
                <path d="M12 12v9"/>
              </svg>
            }
            @case ('value') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[17px] h-[17px]">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v10"/>
                <path d="M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 2 3 2 3 .9 3 2-1.34 2-3 2-3-.9-3-2"/>
              </svg>
            }
            @case ('alert') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[17px] h-[17px]">
                <path d="M12 4 3 20h18L12 4Z"/>
                <path d="M12 10v4"/>
                <path d="M12 17h.01"/>
              </svg>
            }
            @case ('cycle') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-[17px] h-[17px]">
                <path d="M4 12a8 8 0 0 1 14.2-5"/>
                <path d="M20 4v5h-5"/>
                <path d="M20 12a8 8 0 0 1-14.2 5"/>
                <path d="M4 20v-5h5"/>
              </svg>
            }
          }
        </div>
      </div>
      <div class="text-[25px] font-bold text-txt-primary tabular-nums leading-none mb-[12px]">
        {{ value }}
      </div>
      <div class="inline-flex items-center gap-[6px] text-[11.5px] font-medium" [ngClass]="isPositive ? 'text-success' : 'text-danger'">
        <span class="w-[6px] h-[6px] rounded-full" [ngClass]="isPositive ? 'bg-success' : 'bg-danger'"></span>
        {{ detail }}
      </div>
    </div>
  `
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() detail: string = '';
  @Input() isPositive: boolean = true;
  @Input() icon: MetricIcon = 'box';
}
