export interface OrderProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export type OrderStatus = 'New' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: number;
  userId: number;
  products: OrderProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  status?: OrderStatus;
  createdAt?: Date;
}
