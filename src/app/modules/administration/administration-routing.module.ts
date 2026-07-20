import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AuditTrailManagementComponent } from './components/audit-trail/audit-trail-management/audit-trail-management.component';
import { UnitsManagementComponent } from './components/units/units-management/units-management.component';
import { UsersManagementComponent } from './components/users/users-management/users-management.component';

const routes: Routes = [
  // {
  //   path: 'administration/data',
  //   component: DataManagementComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: ['SUPER_ADMIN'],
  //       redirectTo: '/homeNavbar'
  //     }
  //   }
  // },
  {
    path: 'administration/audit-trail',
    component: AuditTrailManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  // {
  //   path: 'administration/groups',
  //   component: GroupsManagementComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: ['SUPER_ADMIN'],
  //       redirectTo: '/homeNavbar'
  //     }
  //   }
  // },
  {
    path: 'administration/units',
    component: UnitsManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'administration/users',
    component: UsersManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  { path: 'WorkSpace', loadChildren: () => import('./modules/work-space/work-space.module').then(m => m.WorkSpaceModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
