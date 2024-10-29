import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

import { HttpClientModule } from '@angular/common/http';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AirConditioningCharacteristicsComponent } from './components/characteristics/air-conditioning-characteristics/air-conditioning-characteristics.component';

import { ReactiveFormsModule } from '@angular/forms';

import { TvCharacteristicsComponent } from './components/characteristics/tv-characteristics/tv-characteristics.component';
import { FanCharacteristicsComponent } from './components/characteristics/fan-characteristics/fan-characteristics.component';
import { HeapphonesCharacteristicsComponent } from './components/characteristics/heapphones-characteristics/heapphones-characteristics.component';
import { RefrigeratorCharacteristicsComponent } from './components/characteristics/refrigerator-characteristics/refrigerator-characteristics.component';
import { WashingCharacteristicsComponent } from './components/characteristics/washing-characteristics/washing-characteristics.component';
import { NotebooksCharacteristicsComponent } from './components/characteristics/notebooks-characteristics/notebooks-characteristics.component';
import { SmartphonesCharacteristicsComponent } from './components/characteristics/smartphones-characteristics/smartphones-characteristics.component';
import { MicrowaveCharacteristicsComponent } from './components/characteristics/microwave-characteristics/microwave-characteristics.component';
import { TabletCharacteristicsComponent } from './components/characteristics/tablet-characteristics/tablet-characteristics.component';
import { PrinterCharacteristicsComponent } from './components/characteristics/printer-characteristics/printer-characteristics.component';
import { KeyboardCharacteristicsComponent } from './components/characteristics/keyboard-characteristics/keyboard-characteristics.component';
import { MouseCharacteristicsComponent } from './components/characteristics/mouse-characteristics/mouse-characteristics.component';


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
    NotebooksCharacteristicsComponent,
    SmartphonesCharacteristicsComponent,
    MicrowaveCharacteristicsComponent,
    TabletCharacteristicsComponent,
    PrinterCharacteristicsComponent,
    KeyboardCharacteristicsComponent,
    MouseCharacteristicsComponent
  ],

  imports: [BrowserModule, AppRoutingModule,HttpClientModule, ReactiveFormsModule],

  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
