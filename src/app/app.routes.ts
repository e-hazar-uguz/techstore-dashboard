import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGard } from './guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
{ path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductComponent,
        canActivate: [AuthGard(['admin', 'product manager'])]
      },
      {
        path: 'orders',
        component: OrderComponent,
        canActivate: [AuthGard(['admin', 'sales'])]
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];
