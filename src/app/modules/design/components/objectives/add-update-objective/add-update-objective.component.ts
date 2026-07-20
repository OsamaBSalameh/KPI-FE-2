import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KPI } from 'src/app/modules/kpi/entities/classes/kpi';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { MeasurmentUnit } from 'src/app/shared/entities/MeasurmentUnit';
import { isNullOrUndefined } from 'src/app/shared/tools/base-tools';
import { Objective } from '../../../entities/classes/objective';
import { ObjectiveKPI } from '../../../entities/classes/objective-kpi';
import { ObjectivesService } from '../../../services/objectives.service';

@Component({
  selector: 'app-add-update-objective',
  templateUrl: './add-update-objective.component.html',
  styleUrls: ['./add-update-objective.component.css']
})
export class AddUpdateObjectiveComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() objectiveAddedEvent = new EventEmitter<any>();
  @Output() objectiveUpdatedEvent = new EventEmitter<any>();

  objective: Objective = new Objective({});
  measurmentUnits: MeasurmentUnit[] = []
  weightSumNotEnough: boolean = false;
  kpis: KPI[] = []
  weightSum: number = 0;

  objectiveForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(1000)]],
    code: [null, [Validators.required, Validators.maxLength(100)]],
    target: [null, [Validators.maxLength(100), Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    measurmentUnit: [null, [Validators.min(1)]],
    // selectedKPIs: [null, []],
    // objectiveKPIs: this.formBuilder.array([])
  });
  get formFileds() { return this.objectiveForm.controls }


  //#endregion


  //#region Constructor

  constructor(
    private objectivesService: ObjectivesService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {

    super.ngOnInit()
    this.initModal()

    await this.initMeasurmentUnits();
    // await this.initKPIs()

    this.initForm()
    this.determineActionType();

    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    
    super.onSubmit()

    // if (this.checkWeightSum() || this.objectiveForm.invalid) return
    if (this.objectiveForm.invalid) return

    this.prepareData()
    this.save();
  }

  override save() { super.save() }

  add() { this.addObjective() }

  update() { this.updateObjective() }

  copy() { this.copyObjective() }

  calculateWeight(event: any) {
    let allWeights = document.getElementsByClassName('dummyWeightClass') as any;

    this.weightSum = 0
    for (const weight of allWeights) {
      if (!isNullOrUndefined(weight.value) && (weight.value != ""))
        this.weightSum += Number.parseInt(weight.value)
    }
  }

  //#endregion


  //#region Selection

  // onKPISelect(kpi: any) {
  //   let objectiveKPI: ObjectiveKPI = new ObjectiveKPI({
  //     kpiId: kpi?.id,
  //     objectiveId: undefined,
  //     weight: undefined,
  //     id: undefined,
  //     isEnabled: true
  //   })

  //   this.addObjectiveKPI(objectiveKPI, kpi.name)
  // }

  // onDeSelectKPI(kpi: any) {
  //   let index = this.getGroupIndex(kpi.id)
  //   this.removeObjectiveKPI(index)
  // }

  // onDeSelectAll() {
  //   let groups = this.objectiveKPIs()
  //   while (groups.length !== 0)
  //     groups.removeAt(0)
  // }

  // onSelectAllKPIs(kpis: any[]) {
  //   let currentKPIs = this.objectiveKPIFormGroups().map(kpi => {
  //     return kpi.controls['KPIId'].value
  //   });

  //   let unselectedKPIs = kpis.filter(kpi => !currentKPIs.includes(kpi.id))
  //   unselectedKPIs.forEach(kpi => {
  //     this.onKPISelect(kpi)
  //   });
  // }

  //#endregion


  //#region Objective KPIs [Form Array]

  addObjectiveKPI(data: any = null, scorecaredName: string | undefined) {
    this.objectiveKPIs().push(this.newObjectiveKPI(data, scorecaredName))
  }

  removeObjectiveKPI(i: number) {
    this.objectiveKPIs().removeAt(i);
  }

  objectiveKPIs(): FormArray {
    return (this.objectiveForm.get('objectiveKPIs') as FormArray)
  }

  objectiveKPIFormGroups(): FormGroup[] {
    return (this.objectiveForm.get('objectiveKPIs') as FormArray).controls as FormGroup[]
  }

  newObjectiveKPI(data: ObjectiveKPI, KPIName: string | undefined): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      objectiveId: [data?.objectiveId || null, []],
      KPIName: [KPIName, []],
      KPIId: [data?.kpiId || 0, []],
      weight: [data?.weight || null, [Validators.required]],
    })
  }

  //#endregion


  //#region Private Functions

  private initModal() { this.objective = this.modal?.data || this.objective }

  private addObjective() {
    this.objectivesService.add(this.objective).subscribe({
      error: () => {
        this.objectivesService.errorToaster("Faild to save")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.objectiveAddedEvent.emit(this.objective)
        this.objectivesService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateObjective() {
    this.objectivesService.update(this.objective).subscribe({
      error: () => {
        this.objectivesService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.objectiveUpdatedEvent.emit(this.objective)
        this.objectivesService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private copyObjective() {
    this.objective.id = undefined;
    this.objective.objectiveKPIs?.map(k => k.id = undefined)
    this.objectivesService.add(this.objective).subscribe({
      error: () => {
        this.objectivesService.errorToaster("Faild to copy")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.objectiveUpdatedEvent.emit(this.objective)
        this.objectivesService.successToaster("copied successfully")
        this.close()
      }
    })
  }

  private async initMeasurmentUnits() {
    
    // let measurmentUnitResult = this.objectivesService.getMeasurmentUnits().pipe(takeUntil(this.destroy$))
    // this.measurmentUnits = await lastValueFrom(measurmentUnitResult) as MeasurmentUnit[];
    let measurmentUnit: MeasurmentUnit = new MeasurmentUnit({ id: 3, name: "Percentage", value: "%" })
    this.measurmentUnits = [measurmentUnit]
  }

  // private async initKPIs() {
  //   let KPIsResult = this._KPIsService.get().pipe(takeUntil(this.destroy$))
  //   this.kpis = await lastValueFrom(KPIsResult) as unknown as KPI[];
  // }

  private initForm() {
    // let kpis = this.kpis.filter(kpi => this.objective?.objectiveKPIs?.map(kpi => kpi.kpiId).includes(kpi.id))

    // this.objectiveForm.controls['selectedKPIs'].setValue(kpis)
    this.objectiveForm.controls['name'].setValue(this.objective.name || null)
    this.objectiveForm.controls['code'].setValue(this.objective.code || null)
    this.objectiveForm.controls['target'].setValue(this.objective.target || null)
    this.objectiveForm.controls['measurmentUnit'].setValue(this.objective.measurmentUnit?.id || 3)

    // this.objective?.objectiveKPIs?.forEach((element: any) => {
    //   let kpi = this.kpis.find(kpi => kpi.id == element.kpiId)
    //   this.addObjectiveKPI(element, kpi?.name)
    //   // this.calculateWeightViaForm()
    // });
  }

  // private getGroupIndex(objectiveId: number): any {
  //   let groups = this.objectiveKPIFormGroups()
  //   var value = null;

  //   groups.forEach((group, index) => {
  //     Object.keys(group.controls).forEach(key => {
  //       if (key == 'objectiveId' && group.controls['objectiveId'].value == objectiveId)
  //         value = index
  //     });
  //   });

  //   return value
  // }

  // private calculateWeightViaForm() {
  //   let weightValues = 0;
  //   let groups = this.objectiveKPIFormGroups()

  //   groups.forEach(group => {
  //     Object.keys(group.controls).forEach(key => {
  //       if (key == 'weight') {
  //         let control = group.get(key) as AbstractControl
  //         weightValues += control.value
  //       }
  //     });
  //   });
  //   this.weightSum = weightValues;
  // }

  // private checkWeightSum() {
  //   let weightValues = 0;
  //   let groups = this.objectiveKPIFormGroups()

  //   groups.forEach(group => {
  //     Object.keys(group.controls).forEach(key => {
  //       if (key == 'weight') {
  //         let control = group.get(key) as AbstractControl
  //         weightValues += control.value
  //       }
  //     });
  //   });

  //   if (weightValues != 100) this.weightSumNotEnough = true
  //   else this.weightSumNotEnough = false

  //   return this.weightSumNotEnough;
  // }

  private prepareData() {
    // let objectiveKPIs = this.objectiveKPIs().controls.map(element => {
    //   return element.value
    // });

    this.objective = new Objective({
      id: this.objective.id,
      code: this.objectiveForm.value.code,
      measurmentUnitId: this.objectiveForm.value.measurmentUnit,
      target: this.objectiveForm.value.target,
      name: this.objectiveForm.value.name,
      // objectiveKPIs: objectiveKPIs
    })
  }

  private disableForm() { if (this.view) this.objectiveForm.disable() }

  //#endregion

}