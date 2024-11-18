import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AirConditioningCharacteristicsComponent } from './components/characteristics/air-conditioning-characteristics/air-conditioning-characteristics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TvCharacteristicsComponent } from './components/characteristics/tv-characteristics/tv-characteristics.component';
import { FanCharacteristicsComponent } from './components/characteristics/fan-characteristics/fan-characteristics.component';
import { HeapphonesCharacteristicsComponent } from './components/characteristics/heapphones-characteristics/heapphones-characteristics.component';
import { RefrigeratorCharacteristicsComponent } from './components/characteristics/refrigerator-characteristics/refrigerator-characteristics.component';
import { WashingCharacteristicsComponent } from './components/characteristics/washing-characteristics/washing-characteristics.component';
import { ViewProductComponent } from './components/products/view/view-product/view-product.component';
import { ProductDetailsComponent } from './components/products/details/product-details/product-details.component';
import { NotebooksCharacteristicsComponent } from './components/characteristics/notebooks-characteristics/notebooks-characteristics.component';
import { SmartphonesCharacteristicsComponent } from './components/characteristics/smartphones-characteristics/smartphones-characteristics.component';
import { MicrowaveCharacteristicsComponent } from './components/characteristics/microwave-characteristics/microwave-characteristics.component';
import { TabletCharacteristicsComponent } from './components/characteristics/tablet-characteristics/tablet-characteristics.component';
import { PrinterCharacteristicsComponent } from './components/characteristics/printer-characteristics/printer-characteristics.component';
import { KeyboardCharacteristicsComponent } from './components/characteristics/keyboard-characteristics/keyboard-characteristics.component';
import { MouseCharacteristicsComponent } from './components/characteristics/mouse-characteristics/mouse-characteristics.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PrivateComponent } from './private/private.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/login/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './components/cart/cart.component';
import { BuyFormComponent } from './components/buy-form/buy-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CartComponent,
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
    NotebooksCharacteristicsComponent,
    SmartphonesCharacteristicsComponent,
    MicrowaveCharacteristicsComponent,
    TabletCharacteristicsComponent,
    PrinterCharacteristicsComponent,
    KeyboardCharacteristicsComponent,
    MouseCharacteristicsComponent,
    RegisterComponent,
    LoginComponent,
    PrivateComponent,
    BuyFormComponent,
  ],

  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
