import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ManageSaloonsComponent } from './manage-saloons/manage-saloons.component';
import {ServicesComponent } from './services/services.component'
import { PackagesComponent } from './packages/packages.component'
import { AuthGuard } from './auth.guard';
import { UnauthorizedComponent } from './unauthorized.component'
import {CustommerLoginComponent} from './custommer-login/custommer-login.component'
import { CustommerComponent } from './custommer/custommer.component';
import { CustommerPackagesComponent } from './custommer/custommer-packages/custommer-packages.component';
import { CustommerServiceComponent } from './custommer/custommer-service/custommer-service.component';
import { UserDatailsComponent } from './custommer/user-datails/user-datails.component';
import { OrderHistoryComponent } from './custommer/order-history/order-history.component';
import { AddToCartComponent } from './custommer/add-to-cart/add-to-cart.component';
import { ViewPackageComponent } from './custommer/custommer-packages/view-package/view-package.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'Custommer-Login', component: CustommerLoginComponent },
  {
    path: 'Layout', component: LayoutComponent,
    children: [
      { path: '', component: ManageSaloonsComponent },
      { path: 'DashBoard', component: DashboardComponent },
      { path: 'Saloons', component: ManageSaloonsComponent, canActivate: [AuthGuard] },
      { path: 'Services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'Services/:id', component: ServicesComponent },
      { path: 'Packages', component: PackagesComponent },
    ]
  },
  { path: 'custommer', component: CustommerComponent,
    children: [
      { path: 'c-Packages', component: CustommerPackagesComponent },
      { path: 'c-Services', component: CustommerServiceComponent },
      { path: 'User', component: UserDatailsComponent },
      { path: 'History', component: OrderHistoryComponent },
      { path: 'add-to-cart', component: AddToCartComponent },
      { path: 'Package-detail/:id', component: ViewPackageComponent },
      { path: 'Package-detail', component: ViewPackageComponent }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule {}