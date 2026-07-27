import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-[rgba(0,0,0,0.72)] z-[110] flex items-center justify-center p-4"
      (click)="cancel.emit()">
      <div
        class="bg-surface rounded-[16px] p-[28px] max-w-[420px] w-full shadow-modal"
        (click)="$event.stopPropagation()">
        <div class="flex items-start gap-3 mb-4">
          <span class="text-[22px] leading-none">🗑</span>
          <div>
            <h3 class="text-[17px] font-bold text-txt-primary mb-1">Eliminar producto</h3>
            <p class="text-[13px] text-txt-muted leading-relaxed">
              @if (productName) {
                ¿Estás seguro de que deseas eliminar <strong class="text-txt-primary">{{ productName }}</strong>? Esta acción no se puede deshacer.
              } @else {
                ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
              }
            </p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            (click)="cancel.emit()"
            [disabled]="loading"
            class="flex-1 py-[10px] rounded-[8px] border border-border text-[13px] font-semibold text-txt-body hover:bg-surface-2 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button
            type="button"
            (click)="confirm.emit()"
            [disabled]="loading"
            class="flex-1 py-[10px] rounded-[8px] bg-danger hover:opacity-90 disabled:opacity-50 text-white text-[13px] font-semibold transition-colors">
            @if (loading) {
              Eliminando...
            } @else {
              Eliminar
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class DeleteConfirmModalComponent {
  @Input() productName = '';
  @Input() loading = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
