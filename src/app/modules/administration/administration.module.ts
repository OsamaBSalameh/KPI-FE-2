import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';

import { DataManagementComponent } from './components/data/data-management/data-management.component';
import { AddUpdateDataComponent } from './components/data/add-update-data/add-update-data.component';

import { GroupsManagementComponent } from './components/groups/groups-management/groups-management.component';
import { AddUpdateGroupComponent } from './components/groups/add-update-group/add-update-group.component';

import { UnitsManagementComponent } from './components/units/units-management/units-management.component';
import { AddUpdateUnitComponent } from './components/units/add-update-unit/add-update-unit.component';

import { UsersManagementComponent } from './components/users/users-management/users-management.component';
import { AddUpdateUserComponent } from './components/users/add-update-user/add-update-user.component';
import { DataService } from './services/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnitsService } from './services/unit.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserPermissionGroupsService } from './services/user-permission-group.service';

import { UiSwitchModule } from 'ngx-ui-switch';
import { PermissionGroupsService } from './services/permission-group.service';
import { AuditTrailManagementComponent } from './components/audit-trail/audit-trail-management/audit-trail-management.component';
import { AuditTrailService } from './services/audit-trail.service';
import { ViewAuditTrailComponent } from './components/audit-trail/view-audit-trail/view-audit-trail.component';
import { DelegationsModule } from './modules/delegations/delegations.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { WorkSpaceModule } from './modules/work-space/work-space.module';

@NgModule({
  declarations: [
    DataManagementComponent,
    AddUpdateDataComponent,

    GroupsManagementComponent,
    AddUpdateGroupComponent,

    UnitsManagementComponent,
    AddUpdateUnitComponent,

    UsersManagementComponent,
    AddUpdateUserComponent,

    AuditTrailManagementComponent,
    ViewAuditTrailComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    UiSwitchModule,
    SharedModule,
    DelegationsModule,
    WorkSpaceModule,
    SelectDropDownModule
  ],
  providers:[DataService, UnitsService, UserPermissionGroupsService, PermissionGroupsService, AuditTrailService]
})
export class AdministrationModule { }
