import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { enumToObject, isNullOrUndefined } from 'src/app/shared/tools/base-tools';
import { Objective } from '../../../entities/classes/objective';
import { Scorecard } from '../../../entities/classes/scorecard';
import { ObjectiveScorecard } from '../../../entities/classes/scorecards-objectives';
import { ObjectiveProspectiveEnum } from '../../../entities/enums/objective-prospective-enum';
import { ObjectivesService } from '../../../services/objectives.service';
import { ScorecardsService } from '../../../services/scorecards.service';
import { Prospective } from 'src/app/modules/lookups/entities/lookups-entities';

@Component({
  selector: 'app-add-update-scorecard',
  templateUrl: './add-update-scorecard.component.html',
  styleUrls: ['./add-update-scorecard.component.css']
})
export class AddUpdateScorecardComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() scorecardAddedEvent = new EventEmitter<any>();
  @Output() scorecardUpdatedEvent = new EventEmitter<any>();

  scorecard: Scorecard = new Scorecard({});
  objectives: Objective[] = []
  weightSumNotEnough: boolean = false;
  // objectiveProspectiveValues: any[] = [];
  weightSum: number = 0;
  selectedProspective: number = 0

  allProspectives: Prospective[] = []

  override dropdownSettings = {
    idField: 'id',
    textField: 'code',
    noDataAvailablePlaceholderText: "There is no item availabale to show",
    allowSearchFilter: true,
    singleSelection: false
  };

  scorecardForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(1000)]],
    selectedObjectives: [null, [Validators.required]],
    objectiveScorecards: this.formBuilder.array([])
  });
  get formFileds() { return this.scorecardForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private scorecardsService: ScorecardsService,
    private objectivesService: ObjectivesService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()
    // this.prepareObjectiveProspectiveEnum()
  
    await this.initProspectives()

    await this.initObjectives()
    this.initForm()

    this.determineActionType()
    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    super.onSubmit()

    if (this.checkWeightSum() || this.scorecardForm.invalid) return

    this.prepareAddUpdateModel()
    this.save();
  }

  override save() { super.save() }

  add() { this.addScorecard() }

  update() { this.updateScorecard() }

  copy() { this.copyScorecard() }

  calculateWeight(event: any) {
    let allWeights = document.getElementsByClassName('dummyWeightClass') as any;

    this.weightSum = 0
    for (const weight of allWeights) {
      if (!isNullOrUndefined(weight.value) && (weight.value != "")) {
        this.weightSum += Number.parseInt(weight.value)
        this.checkWeightSum()
      }
    }
  }

  //#endregion


  //#region Selection

  onObjectiveSelect(objective: any) {
    let objectiveScorecard: ObjectiveScorecard = new ObjectiveScorecard({
      objectiveId: objective?.id,
      objectiveProspective: undefined,
      scorecardId: undefined,
      weight: undefined,
      id: undefined,
      isEnabled: true
    })

    let objectiveName = this.objectives.find(ob => ob.id == objective.id)?.name as string

    this.addObjectiveScorecard(objectiveScorecard, objectiveName)
  }

  onDeSelectObjective(objective: any) {
    let index = this.getGroupIndex(objective.id)
    this.removeObjectiveScorecard(index)
  }

  onDeSelectAll() {
    let groups = this.objectiveScorecards()
    while (groups.length !== 0) {
      groups.removeAt(0)
    }
  }

  onSelectAllObjectives(objectives: any[]) {
    let currentObjectives = this.objectiveScorecardFormGroups().map(obj => {
      return obj.controls['objectiveId'].value
    });

    let unselectedObjectives = objectives.filter(obj => !currentObjectives.includes(obj.id))
    unselectedObjectives.forEach(objective => {
      this.onObjectiveSelect(objective)
    });
  }

  objectivesFilter(prospective: any){
    this.selectedProspective = prospective.value
  }

  //#endregion


  //#region Objective Scorecards [Form Array]

  addObjectiveScorecard(data: any = null, objectiveName: string | undefined) {
    this.objectiveScorecards().push(this.newObjectiveScorecard(data, objectiveName))
  }

  removeObjectiveScorecard(i: number) {
    this.objectiveScorecards().removeAt(i);
  }

  objectiveScorecards(): FormArray {
    return (this.scorecardForm.get('objectiveScorecards') as FormArray)
  }

  objectiveScorecardFormGroups(): FormGroup[] {
    return (this.scorecardForm.get('objectiveScorecards') as FormArray).controls as FormGroup[]
  }

  newObjectiveScorecard(data: ObjectiveScorecard, objectiveName: string | undefined): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      objectiveId: [data?.objectiveId || null, []],
      objectiveName: [objectiveName, []],
      objectiveProspective: [data?.objectiveProspective || 0, [Validators.required, Validators.min(1)]],
      scorecardId: [data?.scorecardId || 0, []],
      weight: [data?.weight || null, [Validators.required]],
      hidden: false
    })
  }

  //#endregion


  //#region Private Functions

  private initModal() { this.scorecard = this.modal?.data || this.scorecard }

  private addScorecard() {
    this.scorecardsService.add(this.scorecard).subscribe({
      error: () => {
        this.scorecardsService.errorToaster("Faild to save")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.scorecardAddedEvent.emit(this.scorecard)
        this.scorecardsService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateScorecard() {
    this.scorecardsService.update(this.scorecard).subscribe({
      error: () => {
        this.scorecardsService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.scorecardUpdatedEvent.emit(this.scorecard)
        this.scorecardsService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private copyScorecard() {
    this.scorecard.id = undefined
    this.scorecard.objectiveScorecards?.map(s => s.id = undefined)
    this.scorecardsService.add(this.scorecard).subscribe({
      error: () => {
        this.scorecardsService.errorToaster("Faild to copy")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.scorecardUpdatedEvent.emit(this.scorecard)
        this.scorecardsService.successToaster("copied successfully")
        this.close()
      }
    })
  }

  private async initObjectives() {
    let objectiveResult = this.objectivesService.get().pipe(takeUntil(this.destroy$))
    this.objectives = await lastValueFrom(objectiveResult) as unknown as Objective[];
  }

  private checkWeightSum() {
    let weightValues = 0;
    let groups = this.objectiveScorecardFormGroups()

    groups.forEach(group => {
      Object.keys(group.controls).forEach(key => {
        if (key == 'weight') {
          let control = group.get(key) as AbstractControl
          weightValues += control.value
        }
      });
    });

    if (weightValues != 100) this.weightSumNotEnough = true
    else this.weightSumNotEnough = false

    return this.weightSumNotEnough;
  }

  private getGroupIndex(objectiveId: number): any {
    let groups = this.objectiveScorecardFormGroups()
    var value = null;

    groups.forEach((group, index) => {
      Object.keys(group.controls).forEach(key => {
        if (key == 'objectiveId' && group.controls['objectiveId'].value == objectiveId)
          value = index
      });
    });

    return value
  }

  private calculateWeightViaForm() {
    let weightValues = 0;
    let groups = this.objectiveScorecardFormGroups()

    groups.forEach(group => {
      Object.keys(group.controls).forEach(key => {
        if (key == 'weight') {
          let control = group.get(key) as AbstractControl
          weightValues += control.value
        }
      });
    });
    this.weightSum = weightValues;
  }

  // private prepareObjectiveProspectiveEnum() {
  //   this.objectiveProspectiveValues = enumToObject(ObjectiveProspectiveEnum)
  //   this.objectiveProspectiveValues.forEach(pro => pro.value = pro.name.split(/(?=[A-Z])/).toString().replaceAll(',', ' '))
  // }

    private async initProspectives() {
      let prospectivesResult = this.scorecardsService.getProspectives().pipe(takeUntil(this.destroy$))
      this.allProspectives = await lastValueFrom(prospectivesResult) as Prospective[];
    }

  private prepareAddUpdateModel() {
    let objectiveScorecards = this.objectiveScorecards().controls.map(element => {
      return {
        id: element.value?.id,
        objectiveId: element.value?.objectiveId,
        objectiveName: element.value?.objectiveName,
        objectiveProspective: Number.parseInt(element.value?.objectiveProspective),
        scorecardId: element.value?.scorecardId,
        weight: element.value?.weight,
      } as any
    });

    this.scorecard = new Scorecard({
      id: this.scorecard.id,
      name: this.scorecardForm.value.name,
      objectiveScorecards: objectiveScorecards
    })
  }

  private initForm() {
    let objectives = this.objectives.filter(obj => this.scorecard.objectiveScorecards?.map(obj => obj.objectiveId).includes(obj.id))

    this.scorecardForm.controls['selectedObjectives'].setValue(objectives)
    this.scorecardForm.controls['name'].setValue(this.scorecard.name || null)

    this.scorecard?.objectiveScorecards?.forEach((element: ObjectiveScorecard) => {
      let objective = this.objectives.find(obj => obj.id == element.objectiveId)
      this.addObjectiveScorecard(element, objective?.name)
      this.calculateWeightViaForm()
    });
  }

  private disableForm() { if (this.view) this.scorecardForm.disable() }

  //#endregion

}
