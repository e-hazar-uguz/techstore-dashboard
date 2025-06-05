import { Component, OnInit } from '@angular/core';
import { Order, OrderStatus } from '../../models/oder.model';
import { OrderService } from '../../services/order.service';
import { interval } from 'rxjs';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  last24HoursCount = 0;
  gridApi: any;
  selectedOrder: Order | null = null;
  isDetailModalOpen = false;

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Order ID' },
    { field: 'userId', headerName: 'User ID' },
    { field: 'totalQuantity', headerName: 'Quantity' },
    { field: 'totalProducts', headerName: 'Products' },
    { field: 'discountedTotal', headerName: 'Total ($)' },
    { field: 'status', headerName: 'Status' },
    {
      headerName: 'Update Status',
      minWidth: 350,
      cellRenderer: (params: any) => `
        <button class="btn" data-status="Processing"> ▶ Processing</button>
        <button class="btn" data-status="Shipped">📦 Shipped</button>
        <button class="btn" data-status="Delivered">✅ Delivered</button>
      `,
      onCellClicked: (params: any) => this.changeStatus(params),
    },
    {
      headerName: 'Details',
      width: 100,
      cellRenderer: () => `<button class='btn btn-view'>🔍</button>`,
      onCellClicked: (params: any) => this.openOrderDetail(params.data),
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    interval(10000).subscribe(() => this.simulateNewOrder());
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  loadOrders(): void {
    const now = new Date();
    this.orderService.getOrders().subscribe((res) => {
      this.orders = res.carts.map((order) => ({
        ...order,
        createdAt: new Date(now.getTime() - Math.random() * 86400000),
        status: 'New' as OrderStatus,
      }));
      this.updateLast24HoursCount();
    });
  }

  updateLast24HoursCount(): void {
    const now = Date.now();
    this.last24HoursCount = this.orders.filter(
      (o) => o.createdAt && now - o.createdAt.getTime() <= 86400000
    ).length;
  }

  simulateNewOrder(): void {
    const randomOrder =
      this.orders[Math.floor(Math.random() * this.orders.length)];
    const clone: Order = {
      ...randomOrder,
      id: this.orders.length + 1,
      createdAt: new Date(),
      status: 'New' as OrderStatus,
    };
    this.orders = [clone, ...this.orders];
    this.updateLast24HoursCount();
  }

  changeStatus(params: any): void {
    const target = params.event.target as HTMLElement;
    const newStatus = target.getAttribute('data-status') as OrderStatus;
    if (newStatus && params.data) {
      params.data.status = newStatus;
      this.gridApi.refreshCells();
      this.toastr.success(
        `Order #${params.data.id} marked as ${newStatus}`,
        'Status Updated',
      );
    }
  }

  openOrderDetail(order: Order): void {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
  }

  closeModal(): void {
    this.selectedOrder = null;
    this.isDetailModalOpen = false;
  }
}
