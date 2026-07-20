import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnitKPIValue } from '../../../entities/classes/unit-kpi-value';
import { ReportingCategory } from '../../../entities/enums/value-sense-enum';
import { ActionType } from 'src/app/shared/enums/action-type';
import { UnitKPIRequestService } from '../../../services/unit-kpi-requests.service';

@Component({
  selector: 'app-manage-unit-kpi-values',
  templateUrl: './manage-unit-kpi-values.component.html',
  styleUrls: ['./manage-unit-kpi-values.component.css'],
})
export class ManageUnitKpiValuesComponent implements OnInit {
  //#region Variables
  @Input() public modal: any;

  @Output() kpiValuesUpdatedEvent = new EventEmitter<any>();

  unitKPIValues: UnitKPIValue[] | undefined;

  unitKPIValue: UnitKPIValue = {
    value: undefined,
    startDate: undefined,
    endDate: undefined,
    order: undefined,
    type: undefined,
    isVerified: undefined,
    isEnabled: false,
    toJson: function () {
      throw new Error('Function not implemented.');
    },
  };

  kpi: any;
  reportingCategory: ReportingCategory | undefined;
  value: number | undefined;
  currentDate: Date = new Date();
  viewOnly: boolean = false;
  //#endregion

  //#region Constructor
  constructor(private unitKPIRequestsService: UnitKPIRequestService) {}

  ngOnInit(): void {
    this.prepareValues();
    this.prepareActionType();
  }
  //#endregion

  //#region Events
  report() {
    let value =
      this.reportingCategory == ReportingCategory.Yearly
        ? (this.value?.toString() as string)
        : (this.unitKPIValues
            ?.filter((va) => this.WithinInterval(va.startDate, va.endDate))[0]
            .value?.toString() as string);

    this.unitKPIRequestsService
      .reportUnitKPIViaCUSTODIAN(this.kpi.id, value)
      .subscribe((res: any) => {
        this.unitKPIRequestsService.successToaster('Reported successfully');
        this.kpiValuesUpdatedEvent.emit();
        this.close();
      });
  }

  close() {
    this.modal.modalReference.close();
  }

  verify(valueId: number | undefined) {
    this.unitKPIRequestsService
      .updateKPIValueVerificationStatus({
        isVerified: true,
        valueId: valueId as number,
      })
      .subscribe((res: any) => {
        this.unitKPIRequestsService.successToaster('Verified');
        this.unitKPIValues?.map((v) => {
          if (v.id == valueId) v.isVerified = true;
        });

        this.kpiValuesUpdatedEvent.emit();
      });
  }

  deny(valueId: number | undefined) {
    this.unitKPIRequestsService
      .updateKPIValueVerificationStatus({
        isVerified: false,
        valueId: valueId as number,
      })
      .subscribe((res: any) => {
        this.unitKPIRequestsService.successToaster('Unverified');
        this.unitKPIValues?.map((v) => {
          if (v.id == valueId) v.isVerified = false;
        });

        this.kpiValuesUpdatedEvent.emit();
      });
  }
  //#endregion

  //#region Public
  public WithinInterval(
    firstDate: Date | undefined,
    secondDate: Date | undefined
  ) {
    let first = new Date(firstDate?.toString() as string);
    let second = new Date(secondDate?.toString() as string);

    let value = first <= this.currentDate && second >= this.currentDate;
    return value;
  }
  //#endregion

  //#region Private
  private prepareValues() {
    this.unitKPIValues = this.modal?.data?.values as UnitKPIValue[];
    this.unitKPIValues.sort((a, b) => <number>a.order - <number>b.order);

    this.kpi = this.modal?.data;
    this.reportingCategory = this.modal?.data?.reportingCategory;

    this.value =
      this.reportingCategory == ReportingCategory.Yearly
        ? this.unitKPIValues[0].value
        : undefined;
    this.unitKPIValue = this.unitKPIValues[0];
  }

  private prepareActionType() {
    this.viewOnly = this.modal?.actionType == ActionType.View;
  }
  //#endregion
}
