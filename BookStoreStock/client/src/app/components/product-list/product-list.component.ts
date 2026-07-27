import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Product, ProductPayload, ProductService } from '../../services/product.service';

import { NavbarDashboardComponent } from '../ui/navbar-dashboard/navbar-dashboard.component';

import { MetricCardComponent } from '../ui/metric-card/metric-card.component';

import { InventoryTableComponent } from '../ui/inventory-table/inventory-table.component';

import { NewProductModalComponent } from '../ui/new-product-modal/new-product-modal.component';

import { DeleteConfirmModalComponent } from '../ui/delete-confirm-modal/delete-confirm-modal.component';

import { finalize } from 'rxjs/operators';

import { extractHttpError } from '../../utils/http-error.util';

import { formatCurrency } from '../../utils/currency.util';



@Component({

  selector: 'app-product-list',

  standalone: true,

  imports: [

    CommonModule,

    NavbarDashboardComponent,

    MetricCardComponent,

    InventoryTableComponent,

    NewProductModalComponent,

    DeleteConfirmModalComponent,

  ],

  template: `

    <div class="min-h-screen bg-page flex flex-col">

      <app-navbar-dashboard></app-navbar-dashboard>



      <main class="flex-1 w-full max-w-[1200px] mx-auto px-[28px] py-[32px]">

        <div class="mb-[24px]">

          <h1 class="text-[22px] font-bold tracking-[-0.025em] text-txt-primary">Control de Stock</h1>

          <p class="text-[14px] text-txt-muted">Resumen general y gestión de productos.</p>

        </div>



        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[32px]">

          <app-metric-card

            label="Total Productos"

            icon="box"

            [value]="totalProductsLabel()"

            detail="12% vs mes pasado"

            [isPositive]="true">

          </app-metric-card>

          <app-metric-card

            label="Valor del Stock"

            icon="value"

            [value]="stockValueLabel()"

            detail="5.2% vs mes pasado"

            [isPositive]="true">

          </app-metric-card>

          <app-metric-card

            label="Bajo Stock"

            icon="alert"

            [value]="lowStockLabel()"

            detail="Requiere atención"

            [isPositive]="false">

          </app-metric-card>

          <app-metric-card

            label="Rotación (30d)"

            icon="cycle"

            value="18%"

            detail="2% vs mes pasado"

            [isPositive]="true">

          </app-metric-card>

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

            Cargando inventario...

          </div>

        }



        <app-inventory-table

          [products]="products()"

          [loading]="isLoading()"

          (newProduct)="onNewProduct()"

          (editProduct)="onEditProduct($event)"

          (deleteProduct)="onDeleteProduct($event)"

          (importCsv)="onImportCsv($event)">

        </app-inventory-table>

      </main>



      @if (showModal()) {

        <app-new-product-modal

          [product]="editingProduct"

          (close)="showModal.set(false)"

          (saved)="onProductSaved()">

        </app-new-product-modal>

      }



      @if (showDeleteModal()) {

        <app-delete-confirm-modal

          [productName]="deletingProduct?.name ?? ''"

          [loading]="isDeleting()"

          (confirm)="confirmDelete()"

          (cancel)="cancelDelete()">

        </app-delete-confirm-modal>

      }

    </div>

  `

})

export class ProductListComponent implements OnInit {

  products = signal<Product[]>([]);

  showModal = signal(false);

  showDeleteModal = signal(false);

  isDeleting = signal(false);

  errorMessage = signal('');

  isLoading = signal(true);

  editingProduct: Product | null = null;

  deletingProduct: Product | null = null;



  constructor(private productService: ProductService) {}



  onNewProduct(): void {

    this.editingProduct = null;

    this.showModal.set(true);

  }



  onEditProduct(product: Product): void {

    this.editingProduct = product;

    this.showModal.set(true);

  }



  onDeleteProduct(product: Product): void {

    this.deletingProduct = product;

    this.showDeleteModal.set(true);

  }



  cancelDelete(): void {

    this.showDeleteModal.set(false);

    this.deletingProduct = null;

  }



  confirmDelete(): void {

    if (!this.deletingProduct) return;



    this.isDeleting.set(true);

    this.productService.deleteProduct(this.deletingProduct.id).pipe(

      finalize(() => this.isDeleting.set(false))

    ).subscribe({

      next: () => {

        this.showDeleteModal.set(false);

        this.deletingProduct = null;

        this.loadProducts();

      },

      error: (err) => {

        this.errorMessage.set(extractHttpError(err, 'Error al eliminar el producto.'));

        this.showDeleteModal.set(false);

        this.deletingProduct = null;

      }

    });

  }



  onImportCsv(items: ProductPayload[]): void {

    this.errorMessage.set('');

    this.isLoading.set(true);



    this.productService.importProducts(items).pipe(

      finalize(() => this.isLoading.set(false))

    ).subscribe({

      next: (result) => {

        this.loadProducts();

        if (result.errors.length > 0) {

          this.errorMessage.set(

            `Se importaron ${result.created} producto(s). Algunos registros fallaron: ${result.errors.slice(0, 3).join('; ')}`

          );

        }

      },

      error: (err) => {

        this.errorMessage.set(extractHttpError(err, 'Error al importar productos.'));

      }

    });

  }



  ngOnInit(): void {

    this.loadProducts();

  }



  totalProductsLabel(): string {

    const count = this.products().length;

    return count > 0 ? count.toLocaleString('es-AR') : '—';

  }



  lowStockLabel(): string {

    const low = this.products().filter((p) => p.stock_quantity < 10).length;

    return this.products().length > 0 ? String(low) : '—';

  }



  stockValueLabel(): string {

    const total = this.products().reduce((sum, p) => sum + p.gross_price * p.stock_quantity, 0);

    return this.products().length > 0 ? formatCurrency(total) : '—';

  }



  onProductSaved(): void {

    this.showModal.set(false);

    this.editingProduct = null;

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

        this.errorMessage.set(extractHttpError(err, 'Error al cargar los productos.'));

      }

    });

  }

}

