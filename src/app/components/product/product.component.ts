// product.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { ColDef } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  searchQuery = '';
  loading = false;
  error = '';
  total = 0;
  limit = 100;
  skip = 0;
  paginationPageSize = 20;
  editingProductId: number | null = null;
  isFormOpen = false;
  isEditMode = false;
  imagePreview: string | null = null;
  productForm!: FormGroup;
  searchInput$ = new Subject<string>();

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
      headerName: 'Thumbnail',
      field: 'thumbnail',
      cellRenderer: (params: any) =>
        `<img src="${params.value}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;" />`,
      width: 100,
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'price', headerName: 'Price ($)', width: 100 },
    { field: 'discountPercentage', headerName: 'Discount (%)', width: 130 },
    { field: 'rating', headerName: 'Rating', width: 90 },
    { field: 'stock', headerName: 'Stock', width: 90 },
    { field: 'brand', headerName: 'Brand', width: 120 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'weight', headerName: 'Weight (g)', width: 110 },
    {
      headerName: 'Width',
      valueGetter: (p) => p.data.dimensions?.width,
      width: 90,
    },
    {
      headerName: 'Height',
      valueGetter: (p) => p.data.dimensions?.height,
      width: 90,
    },
    {
      headerName: 'Depth',
      valueGetter: (p) => p.data.dimensions?.depth,
      width: 90,
    },
    { field: 'warrantyInformation', headerName: 'Warranty', width: 160 },
    { field: 'shippingInformation', headerName: 'Shipping Info', width: 160 },
    { field: 'availabilityStatus', headerName: 'Status', width: 120 },
    { field: 'returnPolicy', headerName: 'Return Policy', width: 160 },
    { field: 'minimumOrderQuantity', headerName: 'Min Order Qty', width: 130 },
    {
      headerName: 'Barcode',
      valueGetter: (p) => p.data.meta?.barcode,
      width: 160,
    },
    {
      headerName: 'QR Code',
      valueGetter: (p) => p.data.meta?.qrCode,
      cellRenderer: (p: any) =>
        `<a href="${p.value}" target="_blank">QR Link</a>`,
      width: 100,
    },
    {
      headerName: 'First Review',
      valueGetter: (p) => p.data.reviews?.[0]?.comment || 'No reviews',
      flex: 1,
    },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: () => `<button class="edit-btn">✏️</button>`,
      onCellClicked: (params: any) => this.openForm(params.data),
      menuTabs: [],
      sortable: false,
      filter: false,
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
  };

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.searchQuery = query;
        this.onSearch();
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getProducts(this.limit, this.skip).subscribe({
      next: (res) => {
        this.products = res.products;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Ürünler yüklenemedi.';
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res) => (this.categories = res),
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (res) => {
        this.products = res.products;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Arama başarısız.';
        this.loading = false;
      },
    });
  }

  onCategoryChange(): void {
    if (!this.selectedCategory) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.productService.getProductsByCategory(this.selectedCategory).subscribe({
      next: (res) => {
        this.products = res.products;
        this.total = res.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Kategori yüklenemedi.';
        this.loading = false;
      },
    });
  }

  onPageChange(page: number): void {
    this.skip = (page - 1) * this.limit;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  get currentPage(): number {
    return Math.floor(this.skip / this.limit) + 1;
  }

  initForm(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
      thumbnail: [''],
    });
  }

  openForm(product?: Product): void {
    this.isFormOpen = true;

    if (product) {
      this.isEditMode = true;
      this.editingProductId = product.id;
      this.productForm.patchValue(product);
      this.imagePreview = product.thumbnail;
    } else {
      this.isEditMode = false;
      this.editingProductId = null;
      this.productForm.reset();
      this.imagePreview = null;
    }
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.productForm.reset();
    this.imagePreview = null;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.productForm.patchValue({ thumbnail: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.isEditMode && this.editingProductId) {
      this.productService
        .updateProduct(this.editingProductId, productData)
        .subscribe({
          next: () => {
            this.toastr.success(
              'Product updated successfully.',
              'Update Successful'
            );
            this.closeForm();
            this.loadProducts();
          },
          error: () => {
            this.toastr.error('Failed to update the product.', 'Update Error');
          },
        });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.toastr.success('Product added successfully.', 'Add Successful');
          this.closeForm();
          this.loadProducts();
        },
        error: () => {
          this.toastr.error('Failed to add the product.', 'Add Error');
        },
      });
    }
  }
}
