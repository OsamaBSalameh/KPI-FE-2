import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { ActionType } from 'src/app/shared/enums/action-type';
import { UnitKPIRequestStatusEnum } from 'src/app/shared/enums/unit-kpi-request-status';
import {
  CustomValidator,
  fromDateToNgDate,
  fromNgDateToDate,
  fromStringDateToNgDate,
  isNullOrUndefined,
} from 'src/app/shared/tools/base-tools';
import { UnitKPIRequest } from '../../../entities/classes/unit-kpi-request';
import { UnitKPIRequestService } from '../../../services/unit-kpi-requests.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRoles } from 'src/app/core/base-entity/base-enums';

@Component({
  selector: 'app-add-update-unit-kpi-request',
  templateUrl: './add-update-unit-kpi-request.component.html',
  styleUrls: ['./add-update-unit-kpi-request.component.css'],
})
export class AddUpdateUnitKPIRequestComponent
  extends AddUpdateBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  @Output() unitKPIRequestAddedEvent = new EventEmitter<any>();
  @Output() unitKPIRequestUpdatedEvent = new EventEmitter<any>();

  returnReasonModal: any;

  unitKPIRequest: UnitKPIRequest = new UnitKPIRequest({
    id: undefined,
    isEnabled: true,
  });

  weightSumNotEnough: boolean = false;

  unitKPIRequestForm = this.formBuilder.group({
    strategy: [0, [Validators.required, Validators.min(1)]],
    owner: [0, [Validators.required, Validators.min(1)]],
    responseDueDate: [
      null,
      [Validators.required, CustomValidator.lessThan('escalationDate')],
    ],
    escalationDate: [
      null,
      [Validators.required, CustomValidator.greaterThan('responseDueDate')],
    ],
    organizationUnitId: [0, []],
    selectedKPIs: [null, []],
    unitKPIsFormArray: this.formBuilder.array([]),
  });

  workSpaceAdminUserRole: string = UserRoles.WORK_SPACE_ADMIN;
  ceoUserRole: string = UserRoles.CEO;

  get formFields() {
    return this.unitKPIRequestForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private unitKPIRequestService: UnitKPIRequestService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.initModal();

    this.initForm();
    this.determineActionType();

    this.disableForm();
  }

  //#endregion

  //#region Events

  override onSubmit() {
    super.onSubmit();
    if (
      !isNullOrUndefined(
        this.unitKPIRequestForm.controls['responseDueDate'].value
      ) &&
      !isNullOrUndefined(
        this.unitKPIRequestForm.controls['responseDueDate'].errors
      )
    )
      this.unitKPIRequestForm.controls['responseDueDate'].setValue(
        fromStringDateToNgDate(
          this.unitKPIRequestForm.controls['responseDueDate'].value
        )
      );

    if (
      !isNullOrUndefined(
        this.unitKPIRequestForm.controls['escalationDate'].value
      ) &&
      !isNullOrUndefined(
        this.unitKPIRequestForm.controls['escalationDate'].errors
      )
    )
      this.unitKPIRequestForm.controls['escalationDate'].setValue(
        fromStringDateToNgDate(
          this.unitKPIRequestForm.controls['escalationDate'].value
        )
      );

    this.checkAchievementDateControl();

    if (this.modal.actionType == ActionType.Update) this.checkWeightSum();
    if (this.weightSumNotEnough || this.unitKPIRequestForm.invalid) return;

    if (!isNullOrUndefined(this.unitKPIRequestForm?.value?.unitKPIsFormArray))
      this.unitKPIRequestForm?.value?.unitKPIsFormArray?.forEach(
        (element: any) => {
          // element.achievementDate = fromNgDateToDate(element.achievementDate)
          element.reportingCategory = Number.parseInt(
            element.reportingCategory
          );
          element.kpiCopy.dataCustodian = null;
          element.kpiCopy.dataSponsor = null;
          element.kpiCopy.measurmentUnit = null;
        }
      );

    this.prepareAddUpdateModel();
    this.save();
  }

  draftSave() {
    this.submitted = true;
    this.checkAchievementDateControl();

    if (this.modal.actionType == ActionType.Update) this.checkWeightSum();
    if (this.weightSumNotEnough || this.unitKPIRequestForm.invalid) return;

    if (!isNullOrUndefined(this.unitKPIRequestForm?.value?.unitKPIsFormArray))
      this.unitKPIRequestForm?.value?.unitKPIsFormArray?.forEach(
        (element: any) => {
          element.achievementDate = fromNgDateToDate(element.achievementDate);
          element.reportingCategory = Number.parseInt(
            element.reportingCategory
          );
          element.kpiCopy.dataCustodian = null;
          element.kpiCopy.dataSponsor = null;
          element.kpiCopy.measurmentUnit = null;
        }
      );

    let request: UnitKPIRequest = new UnitKPIRequest({
      id: this.unitKPIRequest.id,
      strategyId:
        this.unitKPIRequestForm.controls['strategy'].value ||
        this.unitKPIRequestForm.value.strategy,
      organizationUnitId:
        this.unitKPIRequestForm.controls['organizationUnitId'].value ||
        this.unitKPIRequestForm.value.organizationUnitId,
      responseDueDate: fromNgDateToDate(
        this.unitKPIRequestForm.controls['responseDueDate'].value ||
          this.unitKPIRequestForm.value.responseDueDate
      ),
      escalationDate: fromNgDateToDate(
        this.unitKPIRequestForm.controls['escalationDate'].value ||
          this.unitKPIRequestForm.value.escalationDate
      ),
      unitKPIs: this.unitKPIRequestForm.value.unitKPIsFormArray,
      // isDraft: true,
      isEnabled: true,
      // unitKPIRequestStatusId: 1
    }).toJson();

    this.draftSavingUnitKPIRequest(request);
  }

  override save() {
    super.save();
  }

  add() {
    this.addUnitKPIRequest();
  }

  update() {
    this.updateUnitKPIRequest();
  }

  copy() {
    throw new Error('Method not implemented.');
  }

  public is_WORK_SPACE_ADMIN_ActionNeeded() {
    return (
      this.unitKPIRequest.status?.code ==
        UnitKPIRequestStatusEnum.Responded_By_KPI_OWNER ||
      this.unitKPIRequest.status?.code ==
        UnitKPIRequestStatusEnum.Approved_By_WORK_SPACE_ADMIN_1
    );
  }

  public is_KPI_OWNER_ActionNeeded() {
    return (
      this.unitKPIRequest.status?.code ==
        UnitKPIRequestStatusEnum.Requested_By_WORK_SPACE_ADMIN ||
      this.unitKPIRequest.status?.code ==
        UnitKPIRequestStatusEnum.Returned_By_CEO ||
      this.unitKPIRequest.status?.code ==
        UnitKPIRequestStatusEnum.Returned_By_WORK_SPACE_ADMIN ||
      this.unitKPIRequest.status?.code ==
        UnitKPIRequestStatusEnum.Draft_Save_By_KPI_OWNER
    );
  }

  public is_CEO_ActionNeeded() {
    return (
      this.unitKPIRequest.status?.code ==
      UnitKPIRequestStatusEnum.Approved_By_WORK_SPACE_ADMIN_2
    );
  }

  //#endregion

  //#region Actions

  acceptViaWorkSpaceAdmin() {
    this.unitKPIRequestService.acceptViaWorkSpaceAdmin(this.modal.data.id).subscribe({
      error: () => {
        this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
        this.addUpdateState = 2;
        this.close();
      },
      next: (res: any) => {
        if (res == null) {
          this.unitKPIRequestService.warningToaster(
            'Another Work Space Admin should approve this'
          );
        } else {
          this.addUpdateState = 1;
          this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
          this.unitKPIRequestService.successToaster('Accepted successfully');
          this.close();
        }
      },
    });
  }

  rejectViaWorkSpaceAdmin(returnReason: string) {
    this.unitKPIRequestService
      .rejectViaWorkSpaceAdmin({
        requestId: this.modal.data.id,
        returnReason: returnReason,
      })
      .subscribe({
        error: () => {
          this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
          this.addUpdateState = 2;
          this.close();
        },
        next: () => {
          this.addUpdateState = 1;
          this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
          this.unitKPIRequestService.successToaster('Rejected successfully');
          this.close();
        },
      });
  }

  acceptViaCEO() {
    this.unitKPIRequestService.acceptViaCEO(this.modal.data.id).subscribe({
      error: () => {
        this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
        this.addUpdateState = 2;
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
        this.unitKPIRequestService.successToaster('Accepted successfully');
        this.close();
      },
    });
  }

  rejectViaCEO(returnReason: string) {
    this.unitKPIRequestService
      .rejectViaCEO({
        requestId: this.modal.data.id,
        returnReason: returnReason,
      })
      .subscribe({
        error: () => {
          this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
          this.addUpdateState = 2;
          this.close();
        },
        next: () => {
          this.addUpdateState = 1;
          this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
          this.unitKPIRequestService.successToaster('Rejected successfully');
          this.close();
        },
      });
  }

  viewReturnReasonModal(template: any, actionBy: string) {
    this.returnReasonModal = this.prepareModal(template, actionBy, true);
  }

  returnReasonAddedEventHandler(event: any) {
    if (this.returnReasonModal.actionBy == this.workSpaceAdminUserRole)
      this.rejectViaWorkSpaceAdmin(event);
    else if (this.returnReasonModal.actionBy == this.ceoUserRole)
      this.rejectViaCEO(event);
  }
  //#endregion

  //#region Private Functions

  private initModal() {
    this.unitKPIRequest = this.modal?.data || this.unitKPIRequest;
  }

  private addUnitKPIRequest() {
    this.unitKPIRequestService.add(this.unitKPIRequest).subscribe({
      error: () => {
        this.unitKPIRequestUpdatedEvent.emit(this.unitKPIRequest);
        this.addUpdateState = 2;
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitKPIRequestAddedEvent.emit(this.unitKPIRequest);
        this.unitKPIRequestService.successToaster('saved successfully');
        this.close();
      },
    });
  }

  private updateUnitKPIRequest() {
    this.unitKPIRequestService.update(this.unitKPIRequest).subscribe({
      error: () => {
        this.unitKPIRequestUpdatedEvent.emit(this.unitKPIRequest);
        this.addUpdateState = 2;
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitKPIRequestUpdatedEvent.emit(this.unitKPIRequest);
        this.unitKPIRequestService.successToaster('updated successfully');
        this.close();
      },
    });
  }

  private draftSavingUnitKPIRequest(data: UnitKPIRequest) {
    this.unitKPIRequestService.draftSave(data).subscribe({
      error: () => {
        this.addUpdateState = 2;
        this.unitKPIRequestUpdatedEvent.emit(this.unitKPIRequest);
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitKPIRequestUpdatedEvent.emit(this.unitKPIRequest);
        this.unitKPIRequestService.successToaster('updated successfully');
        this.close();
      },
    });
  }

  private checkWeightSum() {
    let weightValues = 0;
    let groups = (this.unitKPIRequestForm.get('unitKPIsFormArray') as FormArray)
      .controls as FormGroup[];

    groups.forEach((group) => {
      Object.keys(group.controls).forEach((key) => {
        if (key == 'weight') {
          let control = group.get(key) as AbstractControl;
          weightValues += control.value;
        }
      });
    });

    if (weightValues != 100) this.weightSumNotEnough = true;
    else this.weightSumNotEnough = false;

    return this.weightSumNotEnough;
  }

  private prepareAddUpdateModel() {
    if (!isNullOrUndefined(this.unitKPIRequestForm?.value?.unitKPIsFormArray))
      this.unitKPIRequestForm?.value?.unitKPIsFormArray?.forEach(
        (element: any) => {
          element.achievementDate = fromNgDateToDate(element.achievementDate);
        }
      );

    this.unitKPIRequest = new UnitKPIRequest({
      id: this.unitKPIRequest.id,
      strategyId:
        this.unitKPIRequestForm.controls['strategy'].value ||
        this.unitKPIRequestForm.value.strategy,
      organizationUnitId:
        this.unitKPIRequestForm.controls['organizationUnitId'].value ||
        this.unitKPIRequestForm.value.organizationUnitId,
      responseDueDate: fromNgDateToDate(
        this.unitKPIRequestForm.controls['responseDueDate'].value ||
          this.unitKPIRequestForm.value.responseDueDate
      ),
      escalationDate: fromNgDateToDate(
        this.unitKPIRequestForm.controls['escalationDate'].value ||
          this.unitKPIRequestForm.value.escalationDate
      ),
      unitKPIs: this.unitKPIRequestForm.value.unitKPIsFormArray,
    });
  }

  private initForm() {
    this.unitKPIRequestForm.controls['strategy'].setValue(
      this.unitKPIRequest.strategyId || 0
    );
    this.unitKPIRequestForm.controls['owner'].setValue(
      this.unitKPIRequest.organizationUnit?.owner?.id || 0
    );
    this.unitKPIRequestForm.controls['responseDueDate'].setValue(
      fromDateToNgDate(this.unitKPIRequest.responseDueDate) || null
    );
    this.unitKPIRequestForm.controls['escalationDate'].setValue(
      fromDateToNgDate(this.unitKPIRequest.escalationDate) || null
    );
  }

  override determineActionType() {
    super.determineActionType();
    if (this.actionType == ActionType.Review) this.view = true;
  }

  private disableForm() {
    if (this.view) this.unitKPIRequestForm.disable();
    else this.unitKPIRequestForm.enable();
  }

  private checkAchievementDateControl() {
    if (!isNullOrUndefined(this.unitKPIRequestForm?.value?.unitKPIsFormArray))
      (
        this.unitKPIRequestForm.controls['unitKPIsFormArray'] as FormArray
      ).controls?.forEach((element: any) => {
        if (
          !isNullOrUndefined(element.controls['achievementDate'].value) &&
          !isNullOrUndefined(element.controls['achievementDate'].errors)
        )
          element.controls['achievementDate'].setValue(
            fromStringDateToNgDate(element.controls['achievementDate'].value)
          );
      });
  }

  private prepareModal(
    template: any,
    actionBy: string,
    isSmall: boolean = false
  ) {
    let modalReference = this.openModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      actionBy: actionBy,
    };
    return baseModal;
  }

  private openModal(template: any, isSmall: boolean = false) {
    let modalWindowClass = '';
    if (isSmall) modalWindowClass = 'modalSmallDialog';

    let modalReference = this.modalService.open(template, {
      windowClass: modalWindowClass,
      ariaLabelledBy: 'modal-basic-title',
    });
    return modalReference;
  }

  //#endregion
}
