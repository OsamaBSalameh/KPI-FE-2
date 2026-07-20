import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { Objective } from 'src/app/modules/design/entities/classes/objective';
import { ObjectivesService } from 'src/app/modules/design/services/objectives.service';
import { Tag } from 'src/app/modules/lookups/entities/tag';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { KPICopyTag } from 'src/app/shared/entities/kpi-copies-tags';
import { MeasurmentUnit } from 'src/app/shared/entities/MeasurmentUnit';
import { DataCustodianUser } from 'src/app/shared/entities/users/data-custadion-user';
import { DataSponserUser } from 'src/app/shared/entities/users/data-sponser-user';
import { enumToObject } from 'src/app/shared/tools/base-tools';
import { KPICopy } from '../../../entities/classes/kpi-copy';
import { ValueSenseEnum } from '../../../entities/enums/value-sense-enum';
import { KPICopiesService } from '../../../services/kpi-copies.service';
import { ActionType } from 'src/app/shared/enums/action-type';

@Component({
  selector: 'app-add-update-kpi-copy',
  templateUrl: './add-update-kpi-copy.component.html',
  styleUrls: ['./add-update-kpi-copy.component.css'],
})
export class AddUpdateKPICopyComponent
  extends AddUpdateBaseComponent
  implements OnInit, OnDestroy {
  //#region Variables

  @Output() kpiCopyAddedEvent = new EventEmitter<any>();
  @Output() kpiCopyUpdatedEvent = new EventEmitter<any>();

  kpiCopy: KPICopy = new KPICopy({});
  tags: Tag[] = [];
  objectives: Objective[] = [];
  measurmentUnits: MeasurmentUnit[] = [];
  custadionUsers: DataCustodianUser[] = [];
  sponsorUsers: DataSponserUser[] = [];

  isDropdownDisabled: boolean = false;
  selectedMeasurmentUnit: MeasurmentUnit | undefined = new MeasurmentUnit({});
  valueSenseList: { id: number; name: string }[] = [];

  kpiCopyForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(100)]],
    id: [null, []],
    code: [null, []],
    kpiTemplateId: [null, []],
    description: [null, [Validators.maxLength(500)]],
    valueSense: [null, [Validators.required]],
    dataCustodianId: [0, [Validators.required]],
    dataSponsorId: [null, [Validators.required]],
    dataCustodian: [null],
    dataSponsor: [null],
    objectiveId: [null],
    measurmentUnitId: [null, [Validators.required, Validators.min(1)]],
    kpiCopyTags: [null, []],
  });
  get formFileds() {
    return this.kpiCopyForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private _KPICopiesService: KPICopiesService,
    private formBuilder: FormBuilder,
    private objectivesService: ObjectivesService
  ) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.initModal();

    await this.initDataCustadionUsers();
    await this.initDataSponserUsers();

    await this.initMeasurmentUnits();
    await this.initTags();

    await this.initObjectives();
    this.prepareObjectiveProspectiveEnum();

    this.initForm();
    this.determineActionType();

    this.prepareSemiUpdate();
    this.disableForm();
  }

  //#endregion

  //#region Events

  override onSubmit() {
    super.onSubmit();

    if (this.kpiCopyForm.invalid) return;

    this.prepareData();
    this.save();
  }

  override save() {
    super.save();
  }

  add() {
    this.addKPICopy();
  }

  update() {
    this.updateKPICopy();
  }

  copy() {
    this.copyKPICopy();
  }

  //#endregion

  //#region Selection

  onMeasurmentUnitSelect(kpiCopyMeasurment: any) {
    this.selectedMeasurmentUnit = this.measurmentUnits.find(
      (d) => d.id == kpiCopyMeasurment.value
    );
  }

  //#endregion

  //#region Prepare data

  private async initTags() {
    let tagsResult = this._KPICopiesService
      .getTags()
      .pipe(takeUntil(this.destroy$));
    this.tags = (await lastValueFrom(tagsResult)) as Tag[];
  }

  private async initMeasurmentUnits() {
    let measurmentUnitResult = this._KPICopiesService
      .getMeasurmentUnits()
      .pipe(takeUntil(this.destroy$));
    this.measurmentUnits = (await lastValueFrom(
      measurmentUnitResult
    )) as MeasurmentUnit[];
  }

  private prepareObjectiveProspectiveEnum() {
    this.valueSenseList = enumToObject(ValueSenseEnum);
  }

  private async initDataCustadionUsers() {
    let result = this._KPICopiesService
      .getDataCustadionUsers()
      .pipe(takeUntil(this.destroy$));
    let users = (await lastValueFrom(result)) as DataCustodianUser[];

    users.map(
      (user) =>
        (user.fullName = `${user.user?.firstName} ${user.user?.lastName}`)
    );
    this.custadionUsers = users;
  }

  private async initDataSponserUsers() {
    let result = this._KPICopiesService
      .getDataSponserUsers()
      .pipe(takeUntil(this.destroy$));
    let users = (await lastValueFrom(result)) as DataSponserUser[];

    users.map(
      (user) =>
        (user.fullName = `${user.user?.firstName} ${user.user?.lastName}`)
    );
    this.sponsorUsers = users;
  }

  private async initObjectives() {
    let objectiveResult = this.objectivesService
      .get()
      .pipe(takeUntil(this.destroy$));
    this.objectives = (await lastValueFrom(
      objectiveResult
    )) as unknown as Objective[];
  }

  //#endregion

  //#region Private Functions

  private initModal() {
    this.kpiCopy = this.modal?.data || this.kpiCopy;
  }

  private addKPICopy() {
    this._KPICopiesService.add(this.kpiCopy).subscribe({
      error: () => {
        this._KPICopiesService.errorToaster('Faild to save');
        this.addUpdateState = 2;
      },
      next: () => {
        this.addUpdateState = 1;
        this.kpiCopy.dataCustodian = this.custadionUsers.find(
          (usr) => usr.id == this.kpiCopy.dataCustodianId
        );
        this.kpiCopy.dataSponsor = this.sponsorUsers.find(
          (usr) => usr.id == this.kpiCopy.dataSponsorId
        );

        this.kpiCopyAddedEvent.emit(this.kpiCopy);
        this._KPICopiesService.successToaster('saved successfully');
        this.close();
      },
    });
  }

  private updateKPICopy() {
    this._KPICopiesService.update(this.kpiCopy).subscribe({
      error: () => {
        this._KPICopiesService.errorToaster('Faild to update');
        this.addUpdateState = 2;
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.kpiCopy.dataCustodian = this.custadionUsers.find(
          (usr) => usr.id == this.kpiCopy.dataCustodianId
        );
        this.kpiCopy.dataSponsor = this.sponsorUsers.find(
          (usr) => usr.id == this.kpiCopy.dataSponsorId
        );
        this.kpiCopy.measurmentUnit = this.measurmentUnits.find(
          (msr) => msr.id == this.kpiCopy.measurmentUnitId
        );

        this.kpiCopyUpdatedEvent.emit(this.kpiCopy);
        this._KPICopiesService.successToaster('updated successfully');
        this.close();
      },
    });
  }

  private copyKPICopy() {
    this.kpiCopy.id = undefined;
    this.kpiCopy.kpiCopyTags?.map((t) => (t.id = undefined));
    this._KPICopiesService.add(this.kpiCopy).subscribe({
      error: () => {
        this._KPICopiesService.errorToaster('Faild to copy');
        this.addUpdateState = 2;
      },
      next: () => {
        this.addUpdateState = 1;
        this.kpiCopyUpdatedEvent.emit(this.kpiCopy);
        this._KPICopiesService.successToaster('copied successfully');
        this.close();
      },
    });
  }

  private initForm() {
    let tags: Tag[] = [];
    this.kpiCopy?.kpiCopyTags?.forEach((tag) => {
      tags.push(this.tags.find((t) => t.id == tag.tagId) as Tag);
    });

    let sense = 0;
    if (this.kpiCopy.valueSense != undefined)
      sense = this.kpiCopy.valueSense ? 2 : 1;

    this.kpiCopyForm.controls['name'].setValue(this.kpiCopy.name || null);
    this.kpiCopyForm.controls['id'].setValue(this.kpiCopy.id || null);
    this.kpiCopyForm.controls['description'].setValue(
      this.kpiCopy.description || null
    );
    this.kpiCopyForm.controls['code'].setValue(this.kpiCopy.code || null);
    this.kpiCopyForm.controls['kpiTemplateId'].setValue(
      this.kpiCopy.kpiTemplateId || null
    );
    this.kpiCopyForm.controls['valueSense'].setValue(sense);
    this.kpiCopyForm.controls['dataCustodianId'].setValue(
      this.kpiCopy.dataCustodianId || 0
    );
    this.kpiCopyForm.controls['dataSponsorId'].setValue(
      this.kpiCopy.dataSponsorId || 0
    );
    this.kpiCopyForm.controls['objectiveId'].setValue(
      this.kpiCopy.objectiveId || 0
    );
    this.kpiCopyForm.controls['measurmentUnitId'].setValue(
      this.kpiCopy.measurmentUnitId || 0
    );
    this.kpiCopyForm.controls['kpiCopyTags'].setValue(tags || null);
    this.selectedMeasurmentUnit = this.measurmentUnits.find(
      (d) => d.id == this.kpiCopy.measurmentUnitId
    );
  }

  private prepareData() {
    let formValue = this.kpiCopyForm.getRawValue()

    let tags: KPICopyTag[] = [];
    formValue?.kpiCopyTags?.forEach((tag: { id: any }) => {
      let data: KPICopyTag = new KPICopyTag({
        tagId: tag.id,
        isEnabled: true,
        kpiCopyId: undefined,
      });
      tags?.push(data);
    });

    this.kpiCopy = new KPICopy({
      id: this.kpiCopy.id,
      code: formValue.code,
      kpiTemplateId: formValue.kpiTemplateId,
      name: formValue.name,
      dataCustodianId: formValue.dataCustodianId,
      dataSponsorId: formValue.dataSponsorId,
      objectiveId: formValue.objectiveId,
      description: formValue.description,
      // kpiDataId: formValue.kpiDataId,
      measurmentUnitId: formValue.measurmentUnitId,
      kpiCopyTags: tags,
      // valueHigherLimit: !isNullOrUndefinedOrWhiteSpace(formValue.valueHigherLimit) ? formValue.valueHigherLimit : undefined,
      // valueLowerLimit: !isNullOrUndefinedOrWhiteSpace(formValue.valueLowerLimit) ? formValue.valueLowerLimit : undefined,
      valueSense:
        Number.parseInt(formValue.valueSense) ==
        ValueSenseEnum.Increase,
    });
  }

  private disableForm() {
    if (this.view) {
      this.isDropdownDisabled = true;
      this.kpiCopyForm.disable();
    }
  }

  private prepareSemiUpdate() {
    if (this.actionType == ActionType.SemiUpdate) {
      for (const field in this.kpiCopyForm.controls) {
        if (!this.modal.toBeUpdatedList.includes(field))
          this.kpiCopyForm.get(field)?.disable();
      }
    }
  }
  //#endregion
}
