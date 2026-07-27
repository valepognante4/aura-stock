import { Component, Output, EventEmitter, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ProductService } from '../../../services/product.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-new-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  template: `
    <div class="fixed inset-0 bg-[rgba(0,0,0,0.72)] z-[100] flex items-center justify-center p-4" (click)="close.emit()">

      <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="bg-surface rounded-[16px] p-[28px] max-w-[500px] w-full shadow-modal relative" (click)="$event.stopPropagation()">

        <div class="flex items-start justify-between mb-[24px]">
          <div>
            <h2 class="text-[17px] font-bold tracking-[-0.025em] text-txt-primary mb-1">{{ product ? 'Editar Producto' : 'Añadir Producto' }}</h2>
            <p class="text-[13px] text-txt-muted">{{ product ? 'Actualiza los datos del producto.' : 'Registra un nuevo ítem en el inventario.' }}</p>
          </div>
          <button type="button" (click)="close.emit()" class="w-[28px] h-[28px] flex items-center justify-center rounded-[7px] text-txt-muted hover:bg-surface-2 transition-colors">
            ✕
          </button>
        </div>

        <div class="flex flex-col gap-[16px]">
          <app-input label="Nombre del producto" placeholder="Ej: MacBook Pro M2" formControlName="name"></app-input>

          <div class="flex flex-col w-full">
            <label class="text-[12px] font-medium text-txt-sub mb-[6px]">Descripción</label>
            <textarea rows="2" formControlName="description" placeholder="Detalles técnicos..."
                      class="w-full bg-page text-txt-primary border border-border rounded-lg px-[14px] py-[11px] focus:outline-none focus:border-accent transition-colors duration-150 resize-none"></textarea>
          </div>

          <div class="grid grid-cols-3 gap-[12px]">
            <app-input label="Precio Neto" type="number" placeholder="0.00" formControlName="net_price"></app-input>

            <div class="flex flex-col w-full">
              <label class="text-[12px] font-medium text-txt-sub mb-[6px]">IVA</label>
              <select formControlName="iva_percentage" class="w-full bg-page text-txt-primary border border-border rounded-lg px-[14px] py-[11px] focus:outline-none focus:border-accent transition-colors duration-150 appearance-none">
                <option [value]="21">21%</option>
                <option [value]="10">10%</option>
                <option [value]="4">4%</option>
                <option [value]="0">0%</option>
              </select>
            </div>

            <app-input label="Stock inicial" type="number" placeholder="0" formControlName="stock_quantity"></app-input>
          </div>
        </div>

        <div class="mt-[20px] bg-page border border-border rounded-[8px] p-[12px_14px] flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[11px] text-txt-dim font-medium uppercase tracking-wider mb-[2px]">Precio Bruto Estimado</span>
            <span class="font-mono text-[18px] font-bold text-txt-primary tabular-nums">\${{ estimatedGrossPrice | number:'1.2-2' }}</span>
          </div>
          <span class="bg-accent-bg text-accent-light px-[8px] py-[2px] rounded-[4px] text-[11px] font-mono font-semibold">
            IVA {{ productForm.get('iva_percentage')?.value }}%
          </span>
        </div>

        @if (errorMessage()) {
          <div class="mt-[16px] text-red-500 text-[13px] font-medium">
            {{ errorMessage() }}
          </div>
        }

        <div class="flex gap-[12px] mt-[28px]">
          <button type="button" (click)="close.emit()" class="flex-1 py-[10px] rounded-[8px] border border-border text-[13px] font-semibold text-txt-body hover:bg-surface-2 transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="productForm.invalid || isLoading()" class="flex-[2] py-[10px] rounded-[8px] bg-accent hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-colors flex justify-center items-center gap-2">
            @if (!isLoading()) {
              <span>Guardar <span class="text-[16px] leading-none">→</span></span>
            } @else {
              <span>Guardando...</span>
            }
          </button>
        </div>

      </form>
    </div>
  `
})
export class NewProductModalComponent implements OnInit {
  @Input() product: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  productForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      net_price: [null, [Validators.required, Validators.min(0)]],
      iva_percentage: [21, Validators.required],
      stock_quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        net_price: this.product.net_price,
        iva_percentage: this.product.iva_percentage,
        stock_quantity: this.product.stock_quantity
      });
    }
  }

  get estimatedGrossPrice(): number {
    const net = this.productForm.get('net_price')?.value || 0;
    const iva = this.productForm.get('iva_percentage')?.value || 0;
    return net + (net * iva / 100);
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.errorMessage.set('Por favor, completa los campos requeridos correctamente.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const productData = {
      name: this.productForm.value.name,
      description: this.productForm.value.description || null,
      net_price: Number(this.productForm.value.net_price),
      iva_percentage: Number(this.productForm.value.iva_percentage),
      stock_quantity: Number(this.productForm.value.stock_quantity),
    };

    const request = this.product ? 
      this.productService.updateProduct(this.product.id, productData) : 
      this.productService.createProduct(productData);

    request.pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: () => {
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        console.error('Error al guardar el producto:', err);
        if (err.status === 0) {
          this.errorMessage.set(
            'No se pudo conectar al servidor. Verificá que el backend esté corriendo en http://127.0.0.1:8000.'
          );
        } else {
          const detail = err.error?.detail;
          this.errorMessage.set(
            typeof detail === 'string'
              ? detail
              : 'Ocurrió un error al guardar el producto.'
          );
        }
      }
    });
  }
}
