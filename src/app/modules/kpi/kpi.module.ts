import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { KPIRoutingModule } from './kpi-routing.module';

import { KPIManagementComponent } from './components/kpi/kpis-management/kpi-management.component';
import { AddUpdateKPIComponent } from './components/kpi/add-update-kpi/add-update-kpi.component';

import { KPIsService } from './services/kpis.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UnitKPIRequestsManagementComponent } from './components/kpiRequests/unit-kpi-requests-management/unit-kpi-requests-management.component';
import { AddUnitKPIRequestComponent } from './components/kpiRequests/add-update-modal/add-unit-kpi-request/add-unit-kpi-request.component';
import { AddUpdateUnitKPIRequestComponent } from './components/kpiRequests/add-update-modal/add-update-unit-kpi-request.component';
import { SelectedUnitKPIsManagementComponent } from './components/kpiRequests/add-update-modal/selected-unit-kpis-management/selected-unit-kpis-management.component';
import { UnitKPIRequestHistoryComponent } from './components/kpiRequests/add-update-modal/unit-kpi-request-history/unit-kpi-request-history.component';
import { ValueReportsComponent } from './components/unit-kpis/value-reports/value-reports.component';
import { AchievedKpisComponent } from './components/unit-kpis/achieved-kpis/achieved-kpis.component';
import { KPICopyManagementComponent } from './components/kpiCopy/kpi-copies-management/kpi-copy-management.component';
import { AddUpdateKPICopyComponent } from './components/kpiCopy/add-update-kpi-copy/add-update-kpi-copy.component';
import { ManageUnitKpiValuesComponent } from './components/unit-kpis/manage-unit-kpi-values/manage-unit-kpi-values.component';
import { DepartmentKPIsComponent } from './components/unit-kpis/department-kpis/department-kpis.component';
import { OrderByQuarterOrderPipe } from 'src/app/shared/custom-pipes/order-by.pipe';
import { RequestReturnReasonComponent } from './components/kpiRequests/request-return-reason/request-return-reason.component';

@NgModule({
  declarations: [
    KPIManagementComponent,
    AddUpdateKPIComponent,

    KPICopyManagementComponent,
    AddUpdateKPICopyComponent,

    UnitKPIRequestsManagementComponent,
    AddUnitKPIRequestComponent,
    AddUpdateUnitKPIRequestComponent,
    SelectedUnitKPIsManagementComponent,
    UnitKPIRequestHistoryComponent,
    ValueReportsComponent,
    AchievedKpisComponent,
    ManageUnitKpiValuesComponent,
    DepartmentKPIsComponent,
    OrderByQuarterOrderPipe,
    RequestReturnReasonComponent
  ],
  imports: [
    CommonModule,
    KPIRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule,
  ],
  providers: [KPIsService, DatePipe],
})
export class KPIModule {}
