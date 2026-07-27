import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { NavbarDashboardComponent } from '../ui/navbar-dashboard/navbar-dashboard.component';
import { MetricCardComponent } from '../ui/metric-card/metric-card.component';
import { Product, ProductService } from '../../services/product.service';
import { extractHttpError } from '../../utils/http-error.util';
import { downloadCsvFile } from '../../utils/csv.util';

const LOW_STOCK_THRESHOLD = 10;

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent, MetricCardComponent],
  template: `
    <div class="min-h-screen bg-page flex flex-col">
      <app-navbar-dashboard></app-navbar-dashboard>

      <main class="flex-1 w-full max-w-[1200px] mx-auto px-[28px] py-[32px]">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[24px]">
          <div>
            <h1 class="text-[22px] font-bold tracking-[-0.025em] text-txt-primary">Reportes</h1>
            <p class="text-[14px] text-txt-muted">Estadísticas del inventario y exportación de datos.</p>
          </div>
          <button
            type="button"
            (click)="exportReport()"
            [disabled]="products().length === 0 || isLoading()"
            class="shrink-0 px-4 py-2 rounded-[8px] bg-accent hover:bg-accent-light text-white text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Exportar reporte CSV
          </button>
        </div>

        @if (errorMessage()) {
          <div class="mb-[24px] p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>{{ errorMessage() }}</span>
            <button
              type="button"
              (click)="loadProducts()"
              class="shrink-0 px-3 py-1.5 rounded-lg bg-red-700 text-white text-[13px] font-semibold hover:bg-red-800 transition-colors">
              Reintentar
            </button>
          </div>
        }

        @if (isLoading()) {
          <div class="mb-[16px] text-center text-txt-muted py-2 text-[13px]">
            Cargando reportes...
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[32px]">
          <app-metric-card
            label="Total Productos"
            [value]="totalProductsLabel()"
            detail="Productos registrados"
            [isPositive]="true">
          </app-metric-card>
          <app-metric-card
            label="Valor del Stock"
            [value]="stockValueLabel()"
            detail="Precio bruto × cantidad"
            [isPositive]="true">
          </app-metric-card>
          <app-metric-card
            label="Bajo Stock"
            [value]="lowStockLabel()"
            [detail]="'Menos de ' + LOW_STOCK_THRESHOLD + ' unidades'"
            [isPositive]="false">
          </app-metric-card>
          <app-metric-card
            label="Stock Crítico"
            [value]="criticalStockLabel()"
            detail="Menos de 5 unidades"
            [isPositive]="false">
          </app-metric-card>
        </div>

        <div class="bg-surface border border-border rounded-[10px] overflow-hidden">
          <div class="px-[18px] py-[14px] border-b border-border">
            <h2 class="text-[15px] font-semibold text-txt-primary">Productos con bajo stock</h2>
            <p class="text-[12px] text-txt-muted mt-0.5">Productos que requieren reposición</p>
          </div>

          @if (!isLoading() && lowStockProducts().length === 0) {
            <div class="px-[18px] py-[32px] text-center text-txt-muted text-[14px]">
              No hay productos con bajo stock. ¡Todo en orden!
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-[13px]">
                <thead>
                  <tr class="border-b border-border text-txt-dim text-left">
                    <th class="px-[18px] py-3 font-semibold">Producto</th>
                    <th class="px-[18px] py-3 font-semibold">Stock</th>
                    <th class="px-[18px] py-3 font-semibold">Precio bruto</th>
                    <th class="px-[18px] py-3 font-semibold">Valor en stock</th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of lowStockProducts(); track product.id) {
                    <tr class="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors">
                      <td class="px-[18px] py-3 text-txt-primary font-medium">{{ product.name }}</td>
                      <td class="px-[18px] py-3">
                        <span class="px-2 py-0.5 rounded-[4px] text-[12px] font-semibold"
                              [class]="product.stock_quantity < 5
                                ? 'bg-danger/10 text-danger'
                                : 'bg-warning/10 text-warning'">
                          {{ product.stock_quantity }}
                        </span>
                      </td>
                      <td class="px-[18px] py-3 text-txt-sub tabular-nums">
                        {{ product.gross_price | currency:'ARS':'symbol-narrow':'1.0-0' }}
                      </td>
                      <td class="px-[18px] py-3 text-txt-sub tabular-nums">
                        {{ product.gross_price * product.stock_quantity | currency:'ARS':'symbol-narrow':'1.0-0' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  readonly LOW_STOCK_THRESHOLD = LOW_STOCK_THRESHOLD;

  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.products.set(Array.isArray(data) ? data : []);
      },
      error: (err) => {
        this.products.set([]);
        this.errorMessage.set(extractHttpError(err, 'Error al cargar los reportes.'));
      }
    });
  }

  totalProductsLabel(): string {
    const count = this.products().length;
    return count > 0 ? count.toLocaleString('es-AR') : '—';
  }

  stockValueLabel(): string {
    const total = this.products().reduce((sum, p) => sum + p.gross_price * p.stock_quantity, 0);
    return this.products().length > 0
      ? `$${total.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : '—';
  }

  lowStockLabel(): string {
    const low = this.lowStockProducts().length;
    return this.products().length > 0 ? String(low) : '—';
  }

  criticalStockLabel(): string {
    const critical = this.products().filter((p) => p.stock_quantity < 5).length;
    return this.products().length > 0 ? String(critical) : '—';
  }

  lowStockProducts(): Product[] {
    return this.products()
      .filter((p) => p.stock_quantity < LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.stock_quantity - b.stock_quantity);
  }

  exportReport(): void {
    const products = this.products();
    if (products.length === 0) return;

    const rows: (string | number)[][] = [
      ['Métrica', 'Valor'],
      ['Total productos', products.length],
      ['Valor del stock', products.reduce((s, p) => s + p.gross_price * p.stock_quantity, 0)],
      ['Productos bajo stock (< ' + LOW_STOCK_THRESHOLD + ')', this.lowStockProducts().length],
      ['Productos stock crítico (< 5)', products.filter((p) => p.stock_quantity < 5).length],
      [],
      ['id', 'name', 'description', 'net_price', 'iva_percentage', 'gross_price', 'stock_quantity', 'valor_en_stock'],
      ...products.map((p) => [
        p.id,
        p.name,
        p.description ?? '',
        p.net_price,
        p.iva_percentage,
        p.gross_price,
        p.stock_quantity,
        p.gross_price * p.stock_quantity,
      ]),
    ];

    downloadCsvFile(`reporte_inventario_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }
}
