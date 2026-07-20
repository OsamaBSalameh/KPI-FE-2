import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkSpaceManagementComponent } from './components/management/work-space-management.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [
  {
    path: 'administration/work-space',
    component: WorkSpaceManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkSpaceRoutingModule { }
