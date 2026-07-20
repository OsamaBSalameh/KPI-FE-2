import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { KPIManagementComponent } from './components/kpi/kpis-management/kpi-management.component';
import { KPICopyManagementComponent } from './components/kpiCopy/kpi-copies-management/kpi-copy-management.component';
import { UnitKPIRequestsManagementComponent } from './components/kpiRequests/unit-kpi-requests-management/unit-kpi-requests-management.component';
import { AchievedKpisComponent } from './components/unit-kpis/achieved-kpis/achieved-kpis.component';
import { ValueReportsComponent } from './components/unit-kpis/value-reports/value-reports.component';
import { DepartmentKPIsComponent } from './components/unit-kpis/department-kpis/department-kpis.component';

const routes: Routes = [
  {
    path: 'kpi/list',
    component: KPIManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WORK_SPACE_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'kpi-copy/list',
    component: KPICopyManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WORK_SPACE_ADMIN','KPI_OWNER'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'kpi/value-reports',
    component: ValueReportsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['DATA_CUSTADION', 'DATA_SPONSER', 'KPI_OWNER', 'WORK_SPACE_ADMIN'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'kpi/department-kpis',
    component: DepartmentKPIsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['KPI_OWNER', 'WORK_SPACE_ADMIN', 'CEO'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  
  {
    path: 'kpi/achieved-kpis',
    component: AchievedKpisComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['DATA_CUSTADION', 'KPI_OWNER'],
        redirectTo: '/homeNavbar'
      }
    }
  },
  {
    path: 'kpi/request-list',
    component: UnitKPIRequestsManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WORK_SPACE_ADMIN', 'CEO', 'KPI_OWNER'],
        redirectTo: '/homeNavbar'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KPIRoutingModule { }
