import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { MeasurmentUnit } from 'src/app/shared/entities/MeasurmentUnit';
import { DataService } from '../../../services/data.service';
import { Data } from '../../entities/data';

@Component({
  selector: 'app-add-update-data',
  templateUrl: './add-update-data.component.html',
  styleUrls: ['./add-update-data.component.css']
})
export class AddUpdateDataComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() dataAddedEvent = new EventEmitter<any>();
  @Output() dataUpdatedEvent = new EventEmitter<any>();

  data: Data = new Data({
    name: undefined,
    id: undefined,
    isEnabled: true,
    calculationGuide: undefined,
    measurmentUnit: undefined,
    measurmentUnitId: undefined
  });
  measurmentUnits: MeasurmentUnit[] = []

  dataForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(100)]],
    measurmentUnit: [null, []],
    calculationGuide: [null, [Validators.maxLength(100)]]
  });
  get formFileds() { return this.dataForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private _dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()

    await this.initMeasurmentUnits();

    this.initForm()
    this.determineActionType();

    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    super.onSubmit()

    if (this.dataForm.invalid) return

    this.data = new Data({
      id: this.data.id,
      name: this.dataForm.value.name,
      measurmentUnitId: this.dataForm.value.measurmentUnit,
      calculationGuide: this.dataForm.value.calculationGuide
    })

    this.save();
  }

  override save() { super.save() }

  add() { this.addData() }

  update() { this.updateData() }

  copy() { this.copyData() }

  //#endregion


  //#region Private Functions

  private initModal() { this.data = this.modal?.data || this.data }

  private addData() {
    this._dataService.add(this.data).subscribe({
      error: () => {
        this._dataService.errorToaster("Faild to save")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.dataAddedEvent.emit(this.data)
        this._dataService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateData() {
    this._dataService.update(this.data).subscribe({
      error: () => {
        this._dataService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.dataUpdatedEvent.emit(this.data)
        this._dataService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private copyData() {
    this.data.id = undefined
    this._dataService.add(this.data).subscribe({
      error: () => {
        this._dataService.errorToaster("Faild to copy")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.dataUpdatedEvent.emit(this.data)
        this._dataService.successToaster("copied successfully")
        this.close()
      }
    })
  }

  private async initMeasurmentUnits() {
    let measurmentUnitResult = this._dataService.getMeasurmentUnits().pipe(takeUntil(this.destroy$))
    this.measurmentUnits = await lastValueFrom(measurmentUnitResult) as MeasurmentUnit[];
  }

  private initForm() {
    this.dataForm = this.formBuilder.group({
      name: [this.data.name || null, [Validators.required, Validators.maxLength(100)]],
      measurmentUnit: [this.data.measurmentUnit?.id || 0, [Validators.min(1)]],
      calculationGuide: [this.data.calculationGuide || null, [Validators.maxLength(100)]]
    });
  }

  private disableForm() { if (this.view) this.dataForm.disable() }

  //#endregion

}
