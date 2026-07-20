import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkSpaceRoutingModule } from './work-space-routing.module';
import { WorkSpaceManagementComponent } from './components/management/work-space-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateWorkSpaceComponent } from './components/add-update/add-update-work-space.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    WorkSpaceManagementComponent,
    AddUpdateWorkSpaceComponent
  ],
  imports: [
    CommonModule,
    WorkSpaceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class WorkSpaceModule { }
