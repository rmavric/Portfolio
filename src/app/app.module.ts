import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SolarModule } from './modules/solar.module';
import { CryptoModule } from './modules/crypto.module';
import { TemperatureModule } from './modules/temperature.module'
import { GpsModule } from './modules/gps.module'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ToolbarMenuComponent } from './nav-menu/toolbar-menu.component';
import { SidenavMenuComponent } from './nav-menu/sidenav-menu.component';
import { CarouselComponent } from './home/carousel.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CurriculumVitaeComponent } from './curriculum-vitae/curriculum-vitae.component';



// import { SolarComponent } from './solar/solar.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolbarMenuComponent,
    SidenavMenuComponent,
    CarouselComponent,
    FooterComponent,
    PageNotFoundComponent,
    CurriculumVitaeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    SolarModule,
    ReactiveFormsModule,
    CryptoModule, 
    TemperatureModule,
    GpsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
