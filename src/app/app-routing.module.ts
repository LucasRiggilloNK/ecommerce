import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { NoAuthGuard } from '../guards/no-auth.guard';
import { PrivateComponent } from './private/private.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailsComponent } from './components/products/details/product-details/product-details.component';
import { BuyFormComponent } from './components/buy-form/buy-form.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AdminGuard } from '../guards/admin.guard';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
import { CreateProductComponent } from './components/products/create-product/create-product.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  /* {
    path: 'addProduct',
    component: AddProductComponent,
    canActivate: [AdminGuard],
  }, */
  {
    path: 'createProduct',
    component: CreateProductComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  {
    path: 'productDetails/:id',
    component: ProductDetailsComponent,
  },
  { path: 'buyForm', component: BuyFormComponent, canActivate: [AuthGuard] },
  {path: "productEdit/:id", component: ProductEditComponent, canActivate:[AdminGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
