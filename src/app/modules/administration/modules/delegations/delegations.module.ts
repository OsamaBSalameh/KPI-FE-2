import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationsRoutingModule } from './delegations-routing.module';
import { AddUpdateDelegationComponent } from './components/add-update-delegation/add-update-delegation.component';
import { DelegationManagementComponent } from './components/delegation-management/delegation-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';


@NgModule({
  declarations: [
    AddUpdateDelegationComponent,
    DelegationManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DelegationsRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SelectDropDownModule
  ]
})
export class DelegationsModule { }
