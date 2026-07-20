import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ObjectivesManagementComponent } from './components/objectives/objectives-management/objectives-management.component';
import { ScorecardsManagementComponent } from './components/scorecards/scorecards-management/scorecards-management.component';
import { StrategiesManagementComponent } from './components/strategies/strategies-management/strategies-management.component';

const routes: Routes = [
  {
    path: 'design/objectives',
    component: ObjectivesManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WORK_SPACE_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'design/scorecards',
    component: ScorecardsManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WORK_SPACE_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'design/strategies',
    component: StrategiesManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WORK_SPACE_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignRoutingModule { }
