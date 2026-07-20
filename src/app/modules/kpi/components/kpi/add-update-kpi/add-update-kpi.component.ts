import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { Objective } from 'src/app/modules/design/entities/classes/objective';
import { ObjectivesService } from 'src/app/modules/design/services/objectives.service';
import { Tag } from 'src/app/modules/lookups/entities/tag';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { KPITag } from 'src/app/shared/entities/kpis-tags';
import { MeasurmentUnit } from 'src/app/shared/entities/MeasurmentUnit';
import { DataCustodianUser } from 'src/app/shared/entities/users/data-custadion-user';
import { DataSponserUser } from 'src/app/shared/entities/users/data-sponser-user';
import { enumToObject } from 'src/app/shared/tools/base-tools';
import { KPI } from '../../../entities/classes/kpi';
import { ValueSenseEnum } from '../../../entities/enums/value-sense-enum';
import { KPIsService } from '../../../services/kpis.service';

@Component({
  selector: 'app-add-update-kpi',
  templateUrl: './add-update-kpi.component.html',
  styleUrls: ['./add-update-kpi.component.css']
})
export class AddUpdateKPIComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() kpiAddedEvent = new EventEmitter<any>();
  @Output() kpiUpdatedEvent = new EventEmitter<any>();

  kpi: KPI = new KPI({});
  tags: Tag[] = []
  objectives: Objective[] = []
  // dataList: Data[] = []
  measurmentUnits: MeasurmentUnit[] = []
  custadionUsers: DataCustodianUser[] = []
  sponsorUsers: DataSponserUser[] = []

  isDropdownDisabled: boolean = false;
  // selectedData: Data | undefined = new Data({})
  selectedMeasurmentUnit: MeasurmentUnit | undefined = new MeasurmentUnit({})
  valueSenseList: { id: number; name: string }[] = [];

  kpiForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(100)]],
    id: [null, []],
    description: [null, [Validators.maxLength(500)]],
    valueSense: [null, [Validators.required, Validators.min(1)]],
    // valueLowerLimit: [null, [Validators.maxLength(100), Validators.pattern(this.numberPattern)]],
    // valueHigherLimit: [null, [Validators.maxLength(100), Validators.pattern(this.numberPattern)]],
    dataCustodianId: [null, [Validators.required, Validators.min(1)]],
    dataSponsorId: [null, [Validators.required, Validators.min(1)]],
    objectiveId: [null, [Validators.required, Validators.min(1)]],
    // kpiDataId: [null, [Validators.required]],
    measurmentUnitId: [null, [Validators.required, Validators.min(1)]],
    kpiTags: [null, []]
  });
  get formFileds() { return this.kpiForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private _KPIsService: KPIsService,
    private formBuilder: FormBuilder,
    private objectivesService: ObjectivesService
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()

    await this.initDataCustadionUsers()
    await this.initDataSponserUsers()

    // await this.initData()
    await this.initMeasurmentUnits()
    await this.initTags()

    await this.initObjectives()

    this.prepareObjectiveProspectiveEnum()

    this.initForm()
    this.determineActionType()

    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    
    super.onSubmit()

    if (this.kpiForm.invalid) return

    this.prepareData()
    this.save();
  }

  override save() { super.save() }

  add() { this.addKPI() }

  update() { this.updateKPI() }

  copy() { this.copyKPI() }

  //#endregion


  //#region Selection

  // onKPIDataSelect(kpiData: any) {
  //   this.selectedData = this.dataList.find(d => d.id == kpiData.value)
  // }

  onMeasurmentUnitSelect(kpiMeasurment: any) {
    this.selectedMeasurmentUnit = this.measurmentUnits.find(d => d.id == kpiMeasurment.value)
  }

  //#endregion


  //#region Prepare data

  private async initTags() {
    let tagsResult = this._KPIsService.getTags().pipe(takeUntil(this.destroy$))
    this.tags = await lastValueFrom(tagsResult) as Tag[];
  }

  // private async initData() {
  //   let dataListResult = this._KPIsService.getKPIData().pipe(takeUntil(this.destroy$))
  //   this.dataList = await lastValueFrom(dataListResult) as Data[];
  // }

  private async initMeasurmentUnits() {
    let measurmentUnitResult = this._KPIsService.getMeasurmentUnits().pipe(takeUntil(this.destroy$))
    this.measurmentUnits = await lastValueFrom(measurmentUnitResult) as MeasurmentUnit[];
  }


  private prepareObjectiveProspectiveEnum() {
    this.valueSenseList = enumToObject(ValueSenseEnum)
  }

  private async initDataCustadionUsers() {
    let result = this._KPIsService.getDataCustadionUsers().pipe(takeUntil(this.destroy$))
    let users = await lastValueFrom(result) as DataCustodianUser[]

    users.map(user => user.fullName = `${user.user?.firstName} ${user.user?.lastName}`)
    this.custadionUsers = users
  }

  private async initDataSponserUsers() {
    let result = this._KPIsService.getDataSponserUsers().pipe(takeUntil(this.destroy$))
    let users = await lastValueFrom(result) as DataSponserUser[];

    users.map(user => user.fullName = `${user.user?.firstName} ${user.user?.lastName}`)
    this.sponsorUsers = users
  }

  private async initObjectives() {
    let objectiveResult = this.objectivesService.get().pipe(takeUntil(this.destroy$))
    this.objectives = await lastValueFrom(objectiveResult) as unknown as Objective[];
  }

  //#endregion


  //#region Private Functions

  private initModal() { this.kpi = this.modal?.data || this.kpi }

  private addKPI() {
    this._KPIsService.add(this.kpi).subscribe({
      error: () => {
        this._KPIsService.errorToaster("Faild to save")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.kpiAddedEvent.emit(this.kpi)
        this._KPIsService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateKPI() {
    this._KPIsService.update(this.kpi).subscribe({
      error: () => {
        this._KPIsService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.kpiUpdatedEvent.emit(this.kpi)
        this._KPIsService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private copyKPI() {
    this.kpi.id = undefined
    this.kpi.kpiTags?.map(t => t.id = undefined)
    this._KPIsService.add(this.kpi).subscribe({
      error: () => {
        this._KPIsService.errorToaster("Faild to copy")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.kpiUpdatedEvent.emit(this.kpi)
        this._KPIsService.successToaster("copied successfully")
        this.close()
      }
    })
  }

  private initForm() {
    let tags: Tag[] = []
    this.kpi?.kpiTags?.forEach(tag => {
      tags.push(this.tags.find(t => t.id == tag.tagId) as Tag)
    });

    let sense = 0
    if (this.kpi.valueSense != undefined)
      sense = this.kpi.valueSense ? 2 : 1

    this.kpiForm.controls['name'].setValue(this.kpi.name || null)
    this.kpiForm.controls['id'].setValue(this.kpi.id || null)
    this.kpiForm.controls['description'].setValue(this.kpi.description || null)
    this.kpiForm.controls['valueSense'].setValue(sense)
    // this.kpiForm.controls['valueLowerLimit'].setValue(!isNullOrUndefinedOrWhiteSpace(this.kpi.valueLowerLimit) ? this.kpi.valueLowerLimit : null)
    // this.kpiForm.controls['valueHigherLimit'].setValue(this.kpi.valueHigherLimit || null)
    this.kpiForm.controls['dataCustodianId'].setValue(this.kpi.dataCustodianId || 0)
    this.kpiForm.controls['dataSponsorId'].setValue(this.kpi.dataSponsorId || 0)
    this.kpiForm.controls['objectiveId'].setValue(this.kpi.objectiveId || 0)
    // this.kpiForm.controls['kpiDataId'].setValue(this.kpi.kpiDataId || 0)
    this.kpiForm.controls['measurmentUnitId'].setValue(this.kpi.measurmentUnitId || 0)
    this.kpiForm.controls['kpiTags'].setValue(tags || null)

    // this.selectedData = this.dataList.find(d => d.id =s= this.kpi.kpiDataId)
    this.selectedMeasurmentUnit = this.measurmentUnits.find(d => d.id == this.kpi.measurmentUnitId)
  }

  private prepareData() {

    let tags: KPITag[] = []
    this.kpiForm.value.kpiTags.forEach((tag: { id: any; }) => {
      let data: KPITag = new KPITag({ tagId: tag.id, isEnabled: true, kpiId: undefined })
      tags?.push(data)
    });

    this.kpi = new KPI({
      id: this.kpi.id,
      // code: this.kpiForm.value.code,
      name: this.kpiForm.value.name,
      dataCustodianId: this.kpiForm.value.dataCustodianId,
      dataSponsorId: this.kpiForm.value.dataSponsorId,
      objectiveId: this.kpiForm.value.objectiveId,
      description: this.kpiForm.value.description,
      // kpiDataId: this.kpiForm.value.kpiDataId,
      measurmentUnitId: this.kpiForm.value.measurmentUnitId,
      kpiTags: tags,
      // valueHigherLimit: !isNullOrUndefinedOrWhiteSpace(this.kpiForm.value.valueHigherLimit) ? this.kpiForm.value.valueHigherLimit : undefined,
      // valueLowerLimit: !isNullOrUndefinedOrWhiteSpace(this.kpiForm.value.valueLowerLimit) ? this.kpiForm.value.valueLowerLimit : undefined,
      valueSense: Number.parseInt(this.kpiForm.value.valueSense) == ValueSenseEnum.Increase
    })
  }

  private disableForm() {
    if (this.view) { this.isDropdownDisabled = true; this.kpiForm.disable(); }
  }

  //#endregion

}