import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPassComponent } from './login/forgot-pass/forgot-pass.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { LayoutComponent } from './layout/layout.component';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ManageSaloonsComponent } from './manage-saloons/manage-saloons.component';
import { CalendarModule } from 'primeng/calendar';
import {PackagesComponent} from './packages/packages.component';
import {ServicesComponent} from './services/services.component';

import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPassComponent,
    LayoutComponent,
    ManageSaloonsComponent,
    PackagesComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    BrowserAnimationsModule,
    ToastModule,
    HttpClientModule,
    SidebarModule,
    CalendarModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  providers: [DialogService,ApiService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
