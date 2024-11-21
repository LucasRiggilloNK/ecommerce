import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './home/home.component';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AirConditioningCharacteristicsComponent } from './components/characteristics/air-conditioning-characteristics/air-conditioning-characteristics.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TvCharacteristicsComponent } from './components/characteristics/tv-characteristics/tv-characteristics.component';
import { FanCharacteristicsComponent } from './components/characteristics/fan-characteristics/fan-characteristics.component';
import { HeapphonesCharacteristicsComponent } from './components/characteristics/heapphones-characteristics/heapphones-characteristics.component';
import { RefrigeratorCharacteristicsComponent } from './components/characteristics/refrigerator-characteristics/refrigerator-characteristics.component';
import { WashingCharacteristicsComponent } from './components/characteristics/washing-characteristics/washing-characteristics.component';
import { ViewProductComponent } from './components/products/view/view-product/view-product.component';
import { ProductDetailsComponent } from './components/products/details/product-details/product-details.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PrivateComponent } from './private/private.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/login/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AddProductComponent,
    AirConditioningCharacteristicsComponent,
    TvCharacteristicsComponent,
    FanCharacteristicsComponent,
    HeapphonesCharacteristicsComponent,
    RefrigeratorCharacteristicsComponent,
    WashingCharacteristicsComponent,
    ViewProductComponent,
    ProductDetailsComponent,
    RegisterComponent,
    LoginComponent,
    PrivateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
