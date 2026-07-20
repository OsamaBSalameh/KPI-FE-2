import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignRoutingModule } from './design-routing.module';

import { ObjectivesManagementComponent } from './components/objectives/objectives-management/objectives-management.component';
import { AddUpdateObjectiveComponent } from './components/objectives/add-update-objective/add-update-objective.component';

import { AddUpdateScorecardComponent } from './components/scorecards/add-update-scorecard/add-update-scorecard.component';
import { ScorecardsManagementComponent } from './components/scorecards/scorecards-management/scorecards-management.component';

import { AddUpdateStrategyComponent } from './components/strategies/add-update-strategy/add-update-strategy.component';
import { StrategiesManagementComponent } from './components/strategies/strategies-management/strategies-management.component';
import { ObjectivesService } from './services/objectives.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScorecardsService } from './services/scorecards.service';
import { StrategiesService } from './services/strategies.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ObjectivesManagementComponent,
    AddUpdateObjectiveComponent,

    ScorecardsManagementComponent,
    AddUpdateScorecardComponent,

    StrategiesManagementComponent,
    AddUpdateStrategyComponent,
  ],
  imports: [
    CommonModule,
    DesignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule
  ],
  providers: [ObjectivesService, ScorecardsService, StrategiesService]
})
export class DesignModule { }
