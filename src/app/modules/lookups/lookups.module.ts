import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookupsRoutingModule } from './lookups-routing.module';
import { TagsManagementComponent } from './components/tags/tags-management/tags-management.component';
import { AddUpdateTagComponent } from './components/tags/add-update-tag/add-update-tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProspectivesService, TagsService } from './services/lookups.service';
import { ProspectivesManagementComponent } from './components/prospectives/prospectives-management/prospectives-management.component';
import { AddUpdateProspectiveComponent } from './components/prospectives/add-update-prospective/add-update-prospective.component';


@NgModule({
  declarations: [
    TagsManagementComponent,
    AddUpdateTagComponent,
    ProspectivesManagementComponent,
    AddUpdateProspectiveComponent
  ],
  imports: [
    CommonModule,
    LookupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule
  ],
  providers: [TagsService, ProspectivesService]
})
export class LookupsModule { }
