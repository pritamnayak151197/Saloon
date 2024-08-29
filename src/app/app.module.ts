import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {CustommerLoginComponent} from './custommer-login/custommer-login.component';
import { CustommerServiceComponent } from './custommer/custommer-service/custommer-service.component';
import { CustommerPackagesComponent } from './custommer/custommer-packages/custommer-packages.component'
import { CustommerComponent } from './custommer/custommer.component';
import { UserDatailsComponent } from './custommer/user-datails/user-datails.component';
import { OrderHistoryComponent } from './custommer/order-history/order-history.component';
import { SidebarComponent } from './custommer/sidebar/sidebar.component';
import { AddToCartComponent } from './custommer/add-to-cart/add-to-cart.component';
import { ViewPackageComponent } from './custommer/custommer-packages/view-package/view-package.component';
import { ViewServiceComponent } from './custommer/custommer-service/view-service/view-service.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
import {MultiSelectModule} from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    ManageSaloonsComponent,
    PackagesComponent,
    ServicesComponent,
    CustommerLoginComponent,
    CustommerServiceComponent,
    CustommerPackagesComponent,
    CustommerComponent,
    UserDatailsComponent,
    OrderHistoryComponent,
    SidebarComponent,
    AddToCartComponent,
    ViewPackageComponent,
    ViewServiceComponent,
    DashboardComponent,
    BookingsComponent
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
    MultiSelectModule,
    InputTextareaModule
  ],
  providers: [DialogService,ApiService,MessageService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
