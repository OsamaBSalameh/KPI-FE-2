import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TagsManagementComponent } from './components/tags/tags-management/tags-management.component';
import { ProspectivesManagementComponent } from './components/prospectives/prospectives-management/prospectives-management.component';

const routes: Routes = [
  {
    path: 'lookups/tags',
    component: TagsManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'lookups/prospectives',
    component: ProspectivesManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['SUPER_ADMIN', 'WORK_SPACE_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LookupsRoutingModule { }
