import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookupsRoutingModule } from './lookups-routing.module';
import { TagsManagementComponent } from './components/tags/tags-management/tags-management.component';
import { AddUpdateTagComponent } from './components/tags/add-update-tag/add-update-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagsService } from './services/tags.service';


@NgModule({
  declarations: [
    TagsManagementComponent,
    AddUpdateTagComponent
  ],
  imports: [
    CommonModule,
    LookupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule
  ],
  providers: [TagsService]
})
export class LookupsModule { }
