import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductPayload } from '../../../services/product.service';

export interface InventoryFilters {
  lowStockOnly: boolean;
  sortBy: 'none' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
  priceMin: number | null;
  priceMax: number | null;
}

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- TOOLBAR -->
    <div class="flex items-center justify-between mb-4">
      <div class="relative w-[300px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-txt-dim text-[16px]">⌕</span>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange()"
          placeholder="Buscar por nombre o descripción..."
          class="w-full bg-surface border border-border rounded-lg pl-8 pr-4 py-[9px] text-[13px] text-txt-primary focus:outline-none focus:border-accent transition-colors">
      </div>
      <div class="flex items-center gap-[8px]">
        <div class="relative" #filtersContainer>
          <button
            type="button"
            (click)="toggleFilters($event)"
            [class.bg-surface-2]="showFilters || hasActiveFilters"
            [class.border-accent]="hasActiveFilters"
            class="px-[14px] py-[9px] rounded-lg border border-border text-[13px] font-semibold text-txt-body hover:bg-surface-2 transition-colors">
            Filtros ▾
            @if (hasActiveFilters) {
              <span class="ml-1 inline-block w-[6px] h-[6px] bg-accent rounded-full align-middle"></span>
            }
          </button>

          @if (showFilters) {
            <div class="absolute right-0 top-[calc(100%+6px)] z-50 w-[280px] bg-surface border border-border rounded-[12px] shadow-modal p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-txt-dim mb-3">Opciones de filtro</p>

              <label class="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" [(ngModel)]="filters.lowStockOnly" (ngModelChange)="applyFilters()" class="accent-accent">
                <span class="text-[13px] text-txt-body">Solo stock bajo (&lt; 10)</span>
              </label>

              <div class="mb-4">
                <label class="text-[12px] font-medium text-txt-sub mb-1.5 block">Ordenar por</label>
                <select
                  [(ngModel)]="filters.sortBy"
                  (ngModelChange)="applyFilters()"
                  class="w-full bg-page text-txt-primary border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-accent">
                  <option value="none">Sin orden</option>
                  <option value="name-asc">Nombre (A → Z)</option>
                  <option value="name-desc">Nombre (Z → A)</option>
                  <option value="price-asc">Precio neto (menor a mayor)</option>
                  <option value="price-desc">Precio neto (mayor a menor)</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label class="text-[12px] font-medium text-txt-sub mb-1.5 block">Precio mín.</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    [(ngModel)]="filters.priceMin"
                    (ngModelChange)="applyFilters()"
                    placeholder="0"
                    class="w-full bg-page text-txt-primary border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-accent">
                </div>
                <div>
                  <label class="text-[12px] font-medium text-txt-sub mb-1.5 block">Precio máx.</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    [(ngModel)]="filters.priceMax"
                    (ngModelChange)="applyFilters()"
                    placeholder="∞"
                    class="w-full bg-page text-txt-primary border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-accent">
                </div>
              </div>

              <button
                type="button"
                (click)="clearFilters()"
                class="w-full py-2 rounded-lg border border-border text-[12px] font-semibold text-txt-muted hover:bg-surface-2 transition-colors">
                Limpiar filtros
              </button>
            </div>
          }
        </div>

        <button
          type="button"
          (click)="exportCsv()"
          [disabled]="loading || products.length === 0"
          class="px-[14px] py-[9px] rounded-lg border border-border text-[13px] font-semibold text-txt-body hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Exportar CSV
        </button>

        <input #fileInput type="file" accept=".csv,text/csv" class="hidden" (change)="onFileSelected($event)">
        <button
          type="button"
          (click)="fileInput.click()"
          [disabled]="loading"
          class="px-[14px] py-[9px] rounded-lg border border-border text-[13px] font-semibold text-txt-body hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Importar
        </button>

        <button
          type="button"
          (click)="newProduct.emit()"
          [disabled]="loading"
          class="px-[14px] py-[9px] rounded-lg bg-accent hover:bg-accent-light disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-colors border-none ml-[2px]">
          + Nuevo Producto
        </button>
      </div>
    </div>

    @if (importMessage) {
      <div
        class="mb-4 p-3 rounded-lg text-[13px] border"
        [class.bg-green-100]="importSuccess"
        [class.border-green-400]="importSuccess"
        [class.text-green-800]="importSuccess"
        [class.bg-red-100]="!importSuccess"
        [class.border-red-400]="!importSuccess"
        [class.text-red-800]="!importSuccess">
        {{ importMessage }}
      </div>
    }

    <!-- TABLE WRAPPER -->
    <div class="bg-surface border border-border rounded-[12px] overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-border">
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[22%]">Nombre</th>
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[30%]">Descripción</th>
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[12%]">Precio Neto</th>
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[8%]">IVA</th>
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[12%]">Precio Bruto</th>
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[8%]">Stock</th>
            <th class="py-[11px] px-[16px] text-[10.5px] font-semibold uppercase tracking-[0.07em] text-txt-dim w-[8%] text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (p of displayProducts; track p.id) {
            <tr class="group border-b border-border hover:bg-surface-2 transition-colors duration-100 last:border-b-0">
              <td class="py-[13px] px-[16px] text-[13px] font-medium text-txt-primary">{{ p.name }}</td>
              <td class="py-[13px] px-[16px] text-[13px] text-txt-sub truncate max-w-[250px]">{{ p.description }}</td>
              <td class="py-[13px] px-[16px] text-[13px] font-semibold font-mono tabular-nums text-txt-body">\${{ p.net_price }}</td>
              <td class="py-[13px] px-[16px]">
                <span class="inline-block bg-accent-bg text-accent-light px-2 py-0.5 rounded-[4px] text-[11.5px] font-semibold font-mono">
                  {{ p.iva_percentage }}%
                </span>
              </td>
              <td class="py-[13px] px-[16px] text-[13px] font-semibold font-mono tabular-nums text-txt-primary">\${{ p.gross_price }}</td>
              <td class="py-[13px] px-[16px]">
                <div class="flex items-center gap-1.5"
                     [ngClass]="{
                       'text-danger': p.stock_quantity < 10,
                       'text-warning': p.stock_quantity >= 10 && p.stock_quantity < 30,
                       'text-success': p.stock_quantity >= 30
                     }">
                  @if (p.stock_quantity < 10) {
                    <span>⚠</span>
                  }
                  <span class="font-mono text-[13px] font-semibold tabular-nums">{{ p.stock_quantity }}</span>
                </div>
              </td>
              <td class="py-[13px] px-[16px] text-right">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-end gap-2">
                  <button type="button" (click)="editProduct.emit(p)" title="Editar" class="text-txt-muted hover:text-accent-light transition-colors text-[14px]">✎</button>
                  <button type="button" (click)="deleteProduct.emit(p)" title="Eliminar" class="text-txt-muted hover:text-danger transition-colors text-[14px]">🗑</button>
                </div>
              </td>
            </tr>
          }
          @if (displayProducts.length === 0) {
            <tr>
              <td colspan="7" class="py-[40px] text-center text-txt-dim text-[13px]">
                @if (products.length === 0) {
                  No hay productos registrados.
                } @else {
                  No se encontraron productos con los filtros aplicados.
                }
              </td>
            </tr>
          }
        </tbody>
      </table>

      <!-- TABLE FOOTER -->
      <div class="px-[16px] py-[12px] flex justify-between items-center bg-surface border-t border-border">
        <span class="text-[12px] text-txt-dim">
          Mostrando {{ displayProducts.length }} de {{ products.length }} productos
        </span>
      </div>
    </div>
  `
})
export class InventoryTableComponent implements OnChanges {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Output() newProduct = new EventEmitter<void>();
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();
  @Output() importCsv = new EventEmitter<ProductPayload[]>();

  @ViewChild('filtersContainer') filtersContainer?: ElementRef<HTMLElement>;

  searchTerm = '';
  showFilters = false;
  displayProducts: Product[] = [];
  importMessage = '';
  importSuccess = false;

  filters: InventoryFilters = {
    lowStockOnly: false,
    sortBy: 'none',
    priceMin: null,
    priceMax: null,
  };

  get hasActiveFilters(): boolean {
    return (
      this.filters.lowStockOnly ||
      this.filters.sortBy !== 'none' ||
      this.filters.priceMin != null ||
      this.filters.priceMax != null
    );
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleFilters(event: Event): void {
    event.stopPropagation();
    this.showFilters = !this.showFilters;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showFilters) return;
    const target = event.target as Node;
    if (this.filtersContainer?.nativeElement.contains(target)) return;
    this.showFilters = false;
  }

  applyFilters(): void {
    let result = [...this.products];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((p) => {
        const name = (p.name ?? '').toLowerCase();
        const desc = (p.description ?? '').toLowerCase();
        return name.includes(term) || desc.includes(term);
      });
    }

    if (this.filters.lowStockOnly) {
      result = result.filter((p) => p.stock_quantity < 10);
    }

    if (this.filters.priceMin != null && this.filters.priceMin !== '' as unknown as number) {
      result = result.filter((p) => p.net_price >= Number(this.filters.priceMin));
    }

    if (this.filters.priceMax != null && this.filters.priceMax !== '' as unknown as number) {
      result = result.filter((p) => p.net_price <= Number(this.filters.priceMax));
    }

    switch (this.filters.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name, 'es'));
        break;
      case 'price-asc':
        result.sort((a, b) => a.net_price - b.net_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.net_price - a.net_price);
        break;
    }

    this.displayProducts = result;
  }

  clearFilters(): void {
    this.filters = {
      lowStockOnly: false,
      sortBy: 'none',
      priceMin: null,
      priceMax: null,
    };
    this.applyFilters();
  }

  exportCsv(): void {
    const headers = ['id', 'name', 'description', 'net_price', 'iva_percentage', 'gross_price', 'stock_quantity'];
    const rows = this.displayProducts.map((p) =>
      [
        p.id,
        this.escapeCsvField(p.name),
        this.escapeCsvField(p.description ?? ''),
        p.net_price,
        p.iva_percentage,
        p.gross_price,
        p.stock_quantity,
      ].join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.importMessage = '';
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '');
        const parsed = this.parseCsv(text);
        if (parsed.length === 0) {
          this.showImportMessage('El archivo CSV no contiene productos válidos.', false);
          return;
        }
        this.importCsv.emit(parsed);
      } catch {
        this.showImportMessage('No se pudo leer el archivo CSV. Verificá el formato.', false);
      }
      input.value = '';
    };
    reader.onerror = () => {
      this.showImportMessage('Error al leer el archivo.', false);
      input.value = '';
    };
    reader.readAsText(file);
  }

  showImportMessage(message: string, success: boolean): void {
    this.importMessage = message;
    this.importSuccess = success;
    setTimeout(() => {
      this.importMessage = '';
    }, 5000);
  }

  private escapeCsvField(value: string): string {
    if (/[",\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private parseCsv(text: string): ProductPayload[] {
    const lines = text.trim().split(/\r?\n/).filter((line) => line.trim());
    if (lines.length === 0) return [];

    const headerLine = lines[0].toLowerCase();
    const hasHeader = headerLine.includes('name') || headerLine.includes('nombre');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const products: ProductPayload[] = [];

    for (const line of dataLines) {
      const cols = this.parseCsvLine(line);
      if (cols.length < 4) continue;

      const nameIdx = hasHeader ? this.colIndex(headerLine.split(','), ['name', 'nombre']) : 0;
      const descIdx = hasHeader ? this.colIndex(headerLine.split(','), ['description', 'descripcion', 'descripción']) : 1;
      const netIdx = hasHeader ? this.colIndex(headerLine.split(','), ['net_price', 'precio_neto', 'precio neto']) : 2;
      const ivaIdx = hasHeader ? this.colIndex(headerLine.split(','), ['iva_percentage', 'iva']) : 3;
      const stockIdx = hasHeader ? this.colIndex(headerLine.split(','), ['stock_quantity', 'stock']) : 4;

      const name = cols[nameIdx >= 0 ? nameIdx : 0]?.trim();
      if (!name) continue;

      const netPrice = Number(cols[netIdx >= 0 ? netIdx : 2]);
      const iva = ivaIdx >= 0 ? Number(cols[ivaIdx]) : 21;
      const stock = stockIdx >= 0 ? Number(cols[stockIdx]) : 0;

      if (Number.isNaN(netPrice) || netPrice < 0) continue;

      products.push({
        name,
        description: (cols[descIdx >= 0 ? descIdx : 1]?.trim() || null) as string | null,
        net_price: netPrice,
        iva_percentage: Number.isNaN(iva) ? 21 : iva,
        stock_quantity: Number.isNaN(stock) ? 0 : Math.max(0, Math.floor(stock)),
      });
    }

    return products;
  }

  private colIndex(headers: string[], names: string[]): number {
    const normalized = headers.map((h) => h.trim().toLowerCase().replace(/"/g, ''));
    for (const name of names) {
      const idx = normalized.indexOf(name);
      if (idx >= 0) return idx;
    }
    return -1;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
}
