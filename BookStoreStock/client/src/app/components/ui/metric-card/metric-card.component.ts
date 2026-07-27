import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-border rounded-[10px] py-[16px] px-[18px]">
      <div class="text-[10.5px] uppercase tracking-[0.08em] text-txt-dim font-semibold mb-2">
        {{ label }}
      </div>
      <div class="text-[23px] font-bold text-txt-primary tabular-nums mb-1">
        {{ value }}
      </div>
      <div class="text-[11.5px] font-medium" [ngClass]="isPositive ? 'text-success' : 'text-danger'">
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
}
