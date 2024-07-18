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

const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'Custommer-Login', component: CustommerLoginComponent },
  {
    path: 'Layout', component: LayoutComponent,
    children: [
      { path: '', component: ManageSaloonsComponent },
      { path: 'Saloons', component: ManageSaloonsComponent, canActivate: [AuthGuard] },
      { path: 'Services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'Services/:id', component: ServicesComponent },
      { path: 'Packages', component: PackagesComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
