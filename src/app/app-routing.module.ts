import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/login/auth.guard';
import { PrivateComponent } from './private/private.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailsComponent } from './components/products/details/product-details/product-details.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'private', component: PrivateComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  {path: "productDetails", component: ProductDetailsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
