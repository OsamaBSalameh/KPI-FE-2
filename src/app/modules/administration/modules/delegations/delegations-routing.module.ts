import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegationManagementComponent } from './components/delegation-management/delegation-management.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'administration/delegations',
    component: DelegationManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN','KPI_OWNER'],
        redirectTo: '/homeNavbar'
      }
    }
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationsRoutingModule { }
