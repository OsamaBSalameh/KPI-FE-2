import {
  AfterContentChecked,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { UserRoles } from 'src/app/core/base-entity/base-enums';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { ActionType } from 'src/app/shared/enums/action-type';
import { AttachmentType } from 'src/app/shared/enums/attachment-type';
import { UnitKPIStatusEnum } from 'src/app/shared/enums/unit-kpi-status';
import * as XLSX from 'xlsx';
import {
  enumToObject,
  // fromDateToNgDate,
} from 'src/app/shared/tools/base-tools';
import { KPICopy } from '../../../entities/classes/kpi-copy';
import { UnitKPI } from '../../../entities/classes/unit-kpi';
import { UnitKPIRequestService } from '../../../services/unit-kpi-requests.service';
// import { PaginationItem } from 'src/app/shared/entities/pagination/pagination-item';
import { Unit } from 'src/app/modules/administration/components/entities/unit';
import { DatePipe } from '@angular/common';
import { Strategy } from 'src/app/modules/design/entities/classes/strategy';
import { StrategiesService } from 'src/app/modules/design/services/strategies.service';

@Component({
  selector: 'app-value-reports',
  templateUrl: './value-reports.component.html',
  styleUrls: ['./value-reports.component.css'],
})
export class ValueReportsComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy, AfterContentChecked {
  //#region Variables

  unitKPIsModal: FormGroup = this.formBuilder.group({
    unitKPIsFormArray: this.formBuilder.array([]),
  });

  public selectedStatus: any = 0;
  unitKPIStatuses: any[] = [];

  allUnits: Unit[] = [];
  selectedUnit: any = 0;

  commentsModal: any;
  attachmentsModal: any;

  submitted: boolean = false;
  userRoles = UserRoles;

  selectedRole: any;
  valuesModal: any;
  viewKpiModal: any;

  selectedStrategyId: number | undefined
  strategies: Strategy[] = [];
  //#endregion

  //#region Constructor

  constructor(
    private unitKPIRequestsService: UnitKPIRequestService,
    private formBuilder: FormBuilder,
    private innerModalService: NgbModal,
    modalService: NgbModal,
    private authService: AuthService,
    private datePipe: DatePipe,
    private strategiesService: StrategiesService
  ) {
    super(modalService);
  }

  ngAfterContentChecked(): void {
    document
      .getElementById(`${this.selectedRole}_BTN`)
      ?.classList.add('role-btn-active');
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.getAllStrategies();

    this.initUnitKPIStatusEnum();
    this.initUnits();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  //#endregion

  //#region Form

  addUnitKPI(data: UnitKPI) {
    this.unitKPIsFormArray().push(this.newUnitKPI(data));
  }

  removeUnitKPI(i: number) {
    this.unitKPIsFormArray().removeAt(i);
  }

  unitKPIsFormArray(): FormArray {
    return this.unitKPIsModal.get('unitKPIsFormArray') as FormArray;
  }

  unitKPIFormGroups(): FormGroup[] {
    return (this.unitKPIsModal.get('unitKPIsFormArray') as FormArray)
      .controls as FormGroup[];
  }

  newUnitKPI(data: UnitKPI): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      kpiCopyId: [data?.kpiCopy?.id || 0, []],
      kpiCopy: data?.kpiCopy,
      unitKPIRequestId: [data.unitKPIRequestId, []],
      kpiName: [data?.kpiCopy?.name || null, []],
      organizationName: [
        data?.unitKPIRequest?.organizationUnit?.name || null,
        [],
      ],
      kpiOwnerName: [data?.ownerName || null, []],
      // dataName: [data?.kpi?.kpiData?.name || null, []],
      dataCustodionName: [data?.kpiCopy?.dataCustodian?.fullName || 0, []],
      dataSponsorName: [data?.kpiCopy?.dataSponsor?.fullName || 0, []],
      measurmentUnit: [data?.kpiCopy?.measurmentUnit?.value || null, []],
      target: [data?.target || 0, []],
      reportingCategory: [data?.reportingCategory || null, []],
      // achievementDate: [fromDateToNgDate(data?.achievementDate) || null, []],
      achievementDate: [
        this.datePipe.transform(data?.achievementDate, 'dd/MM/yyyy, h:mm a') ||
        null,
        [],
      ],
      status: [data.status?.value || null, []],
      statusCode: [data.status?.code || null, []],
      weight: [data?.weight || null, []],
      values: [
        data?.values || null,
        [Validators.required, Validators.maxLength(100)],
      ],
    });
  }

  //#endregion

  //#region Actions

  override onLimitChange(event: any) {
    this.paginationItem.pageSize = event.value != 'all' ? event.value as number : this.paginationResult.totalCount
    this.getPaginatedValues(this.selectedRole);
  }

  onUnitKPIStatusSelect(data: any) {
    this.selectedStatus = data.value;
    this.getPaginatedValues(this.selectedRole);
  }

  onOrganizationSelect(data: any) {
    this.selectedUnit = data.value;
    this.getPaginatedValues(this.selectedRole);
  }

  exportToExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'myExcel.xlsx');
  }

  getPaginatedValues(permission: UserRoles | undefined = undefined): void {
    let data = {
      paignationRequest: this.paginationItem,
      userId: Number.parseInt(this.authService.getUserId() as string),
      unitKPIStatus: Number.parseInt(this.selectedStatus || 0),
    };

    document.getElementById(`DATA_CUSTADION_BTN`)?.classList.remove('role-btn-active');
    document.getElementById(`DATA_SPONSER_BTN`)?.classList.remove('role-btn-active');
    document.getElementById(`WORK_SPACE_ADMIN_BTN`)?.classList.remove('role-btn-active');
    document.getElementById(`KPI_OWNER_BTN`)?.classList.remove('role-btn-active');

    this.selectedRole = permission || this.selectedRole;
    document
      .getElementById(`${this.selectedRole}_BTN`)
      ?.classList.add('role-btn-active');

    switch (this.selectedRole) {
      case UserRoles.KPI_OWNER:
        this.unitKPIsForOwner(data);
        this.disableForm();
        break;

      case UserRoles.DATA_CUSTADION:
        this.unitKPIsForDataCustodian(data);
        break;

      case UserRoles.DATA_SPONSER:
        this.unitKPIsForDataSponser(data);
        this.disableForm();
        break;

      case UserRoles.WORK_SPACE_ADMIN:
        let workSpaceAdminData = {
          paignationRequest: this.paginationItem,
          organizationUnitId: Number.parseInt(this.selectedUnit || 0),
          unitKPIStatus: Number.parseInt(this.selectedStatus || 0),
        };
        this.unitKPIsForWorkSpaceAdmin(workSpaceAdminData);
        this.disableForm();
        break;

      default:
        break;
    }
  }

  viewComments(data: FormGroup | undefined, template: any) {
    this.commentsModal = this.prepareModal(
      data?.getRawValue(),
      template,
      ActionType.Update,
      false
    );
  }

  viewKPI(data: FormGroup | undefined, template: any) {
    let values = data?.getRawValue();
    let kpiCopy: KPICopy | undefined = values.kpiCopy;
    this.viewKpiModal = this.prepareModal(
      kpiCopy,
      template,
      ActionType.View,
      false
    );
  }

  reportingAttachmentsManagement(data: FormGroup | undefined, template: any) {
    let userRoles = this.authService.getUserRoles();
    let actionType = userRoles?.includes(UserRoles.DATA_CUSTADION)
      ? ActionType.Update
      : ActionType.Review;
    this.attachmentsModal = this.prepareAttachmentModal(
      data?.getRawValue(),
      template,
      actionType,
      AttachmentType.ReportingKPI,
      false
    );
  }

  unitKPIAttachmentsManagement(data: FormGroup | undefined, template: any) {
    this.attachmentsModal = this.prepareAttachmentModal(
      data?.getRawValue(),
      template,
      ActionType.View,
      AttachmentType.KPICopy,
      false
    );
  }

  manageUnitKpiValues(data: FormGroup | undefined, template: any, viewOnly: boolean) {
    var workSpaceAdminRole = UserRoles.WORK_SPACE_ADMIN;
    this.valuesModal = this.prepareModal(
      data?.getRawValue(),
      template,
      viewOnly ? ActionType.View : ActionType.Update,
      this.selectedRole == workSpaceAdminRole,
      false
    );
  }

  kpiValuesUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  report(data: FormGroup | undefined) {
    this.submitted = true;
    data?.controls['value'].markAsDirty();

    if (data?.controls['value'].invalid) return;

    this.unitKPIRequestsService
      .reportUnitKPIViaCUSTODIAN(
        data?.controls['id'].value,
        data?.controls['value'].value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.unitKPIRequestsService.successToaster('Reported successfully');
        this.getPaginatedValues(UserRoles.DATA_CUSTADION);
      });
  }

  //#region Sponser actions
  approveViaSponser(data: FormGroup | undefined) {
    this.unitKPIRequestsService
      .acceptKPIViaSponser(data?.controls['id'].value)
      .subscribe({
        error: () => {
          this.unitKPIRequestsService.errorToaster('Faild to Approve');
        },
        next: () => {
          this.unitKPIRequestsService.successToaster('Approved successfully');
          this.getPaginatedValues(UserRoles.DATA_SPONSER);
        },
      });
  }

  rejectViaSponser(data: FormGroup | undefined) {
    this.unitKPIRequestsService
      .rejectKPIViaSponser(data?.controls['id'].value)
      .subscribe({
        error: () => {
          this.unitKPIRequestsService.errorToaster('Faild to Reject');
        },
        next: () => {
          this.unitKPIRequestsService.successToaster('Rejected successfully');
          this.getPaginatedValues(UserRoles.DATA_SPONSER);
        },
      });
  }
  //#endregion

  //#region Owner actions
  approveViaOwner(data: FormGroup | undefined) {
    this.unitKPIRequestsService
      .approveViaOwner(data?.controls['id'].value)
      .subscribe({
        error: () => {
          this.unitKPIRequestsService.errorToaster('Faild to Approve');
        },
        next: () => {
          this.unitKPIRequestsService.successToaster('Approved successfully');
          this.getPaginatedValues(UserRoles.KPI_OWNER);
        },
      });
  }

  rejectViaOwner(data: FormGroup | undefined) {
    this.unitKPIRequestsService
      .rejectKPIViaOwner(data?.controls['id'].value)
      .subscribe({
        error: () => {
          this.unitKPIRequestsService.errorToaster('Faild to Reject');
        },
        next: () => {
          this.unitKPIRequestsService.successToaster('Rejected successfully');
          this.getPaginatedValues(UserRoles.KPI_OWNER);
        },
      });
  }
  //#endregion

  //#region WORK_SPACE_ADMIN actions
  approveViaWorkSpaceAdmin(data: FormGroup | undefined) {
    if (data?.controls['statusCode'].value == UnitKPIStatusEnum.WaitingForKpiOwnerApproval)
      this.unitKPIRequestsService
        .approveViaOwner(data?.controls['id'].value)
        .subscribe({
          error: () => {
            this.unitKPIRequestsService.errorToaster('Faild to Approve');
          },
          next: () => {
            this.unitKPIRequestsService.successToaster('Approved successfully');
            this.getPaginatedValues(UserRoles.WORK_SPACE_ADMIN);
          },
        });
    else if (data?.controls['statusCode'].value == UnitKPIStatusEnum.WaitingForDataSponserApproval)
      this.unitKPIRequestsService
        .acceptKPIViaSponser(data?.controls['id'].value)
        .subscribe({
          error: () => {
            this.unitKPIRequestsService.errorToaster('Faild to Approve');
          },
          next: () => {
            this.unitKPIRequestsService.successToaster('Approved successfully');
            this.getPaginatedValues(UserRoles.WORK_SPACE_ADMIN);
          },
        });
  }

  rejectViaWorkSpaceAdmin(data: FormGroup | undefined) {
    if (data?.controls['statusCode'].value == UnitKPIStatusEnum.WaitingForKpiOwnerApproval)
      this.unitKPIRequestsService
        .rejectKPIViaOwner(data?.controls['id'].value)
        .subscribe({
          error: () => {
            this.unitKPIRequestsService.errorToaster('Faild to Reject');
          },
          next: () => {
            this.unitKPIRequestsService.successToaster('Rejected successfully');
            this.getPaginatedValues(UserRoles.WORK_SPACE_ADMIN);
          },
        });
    else if (data?.controls['statusCode'].value == UnitKPIStatusEnum.WaitingForDataSponserApproval)
      this.unitKPIRequestsService
        .rejectKPIViaSponser(data?.controls['id'].value)
        .subscribe({
          error: () => {
            this.unitKPIRequestsService.errorToaster('Faild to Reject');
          },
          next: () => {
            this.unitKPIRequestsService.successToaster('Rejected successfully');
            this.getPaginatedValues(UserRoles.WORK_SPACE_ADMIN);
          },
        });
  }
  //#endregion

  unitKPIAchieved(data: FormGroup | undefined) {
    this.unitKPIRequestsService
      .unitKPIAchieved(data?.controls['id'].value)
      .subscribe({
        error: () => {
          this.unitKPIRequestsService.errorToaster('Faild to Achieve');
        },
        next: () => {
          this.unitKPIRequestsService.successToaster('Achieved successfully');
          this.getPaginatedValues(UserRoles.DATA_SPONSER);
        },
      });
  }

  isValueEditable() {
    var value = document
      .getElementById(`KPI_OWNER_BTN`)
      ?.classList.contains('role-btn-active');
    return !value;
  }

  public colorBasedOnStatusV1(unitKPI: any): String {
    switch (unitKPI.value.statusCode) {
      case UnitKPIStatusEnum.UnderReportingPeriod: 
        return 'grayColor';

      case UnitKPIStatusEnum.WaitingForReporting:
        return 'midBlueColor';

      case UnitKPIStatusEnum.WaitingForDataSponserApproval:
        return 'blueColor';

      case UnitKPIStatusEnum.ReturnedByDataSponser:
        return 'redColor';

      case UnitKPIStatusEnum.WaitingForKpiOwnerApproval:
        return 'orangeColor';

      case UnitKPIStatusEnum.ReturnedByKpiOwner:
        return 'redColor';

      case UnitKPIStatusEnum.ApprovedByKpiOwner:
        return 'greenColor';

      default:
        return 'grayColor'
    }
  }


  colorBasedOnStatus(unitKPI: any): string {
    const statusCode = unitKPI.get('statusCode')?.value;
    const statusValue = unitKPI.get('status')?.value?.toLowerCase();

    // Map status codes to CSS classes
    const statusMap: { [key: number]: string } = {
      1: 'pending',           // Pending
      2: 'approved',          // Approved
      3: 'active',         // Submitted/Pending Review
      4: 'rejected',            // Active/In Progress
      5: 'submitted',          // Rejected/Returned
      6: 'cancelled',          //  Cancelled/Inactive (ReturnedByKpiOwner)
      7: 'achieved',         // Achieved (ApprovedByKpiOwner)
      8: 'archived'           // Archived
    };

    // Use status code if available, otherwise fallback to status value
    if (statusCode && statusMap[statusCode]) {
      return `status-${statusMap[statusCode]}`;
    }

    // Fallback to status value mapping
    const valueMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'submitted': 'status-submitted',
      'pending review': 'status-pending-review',
      'in progress': 'status-in-progress',
      'active': 'status-active',
      'rejected': 'status-rejected',
      'returned': 'status-returned',
      'achieved': 'status-achieved',
      'cancelled': 'status-cancelled',
      'inactive': 'status-inactive',
      'archived': 'status-archived'
    };

    return valueMap[statusValue] || 'status-pending';
  }

  onStrategySelected(data: any) {
    this.selectedStrategyId = parseInt(data.value);
    this.paginationItem.strategyId = parseInt(data.value);
    this.getPaginatedValues();
  }

  //#endregion

  //#region Paignation

  public async unitKPIsForDataCustodian(data: any) {
    this.unitKPIRequestsService
      .unitKPIsForDataCustodian(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        let items = res.items as UnitKPI[];

        this.unitKPIsModal.controls['unitKPIsFormArray'].reset();
        this.unitKPIsFormArray().clear();
        this.fillUnitKPI(items);
      });
  }

  public async unitKPIsForDataSponser(data: any) {
    this.unitKPIRequestsService
      .unitKPIsForDataSponser(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        let items = res.items as UnitKPI[];

        this.unitKPIsModal.controls['unitKPIsFormArray'].reset();
        this.unitKPIsFormArray().clear();
        this.fillUnitKPI(items);
      });

    this.disableForm();
  }

  public async unitKPIsForOwner(data: any) {
    this.unitKPIRequestsService
      .unitKPIsForOwner(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        let items = res.items as UnitKPI[];

        this.unitKPIsModal.controls['unitKPIsFormArray'].reset();
        this.unitKPIsFormArray().clear();
        this.fillUnitKPI(items);
      });

    this.disableForm();
  }

  public async unitKPIsForWorkSpaceAdmin(data: any) {
    this.unitKPIRequestsService
      .unitKPIsForWorkSpaceAdmin(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        let items = res.items as UnitKPI[];

        this.unitKPIsModal.controls['unitKPIsFormArray'].reset();
        this.unitKPIsFormArray().clear();
        this.fillUnitKPI(items);
      });
  }

  //#endregion

  //#region Private Functions

  private initUnitKPIStatusEnum() {
    this.unitKPIStatuses = enumToObject(UnitKPIStatusEnum);
    this.unitKPIStatuses.forEach(
      (status) =>
      (status.value = status.name
        .split(/(?=[A-Z])/)
        .toString()
        .replaceAll(',', ' '))
    );
  }

  private disableForm() {
    this.unitKPIsModal.controls['unitKPIsFormArray'].disable();
  }

  private fillUnitKPI(unitKpis: UnitKPI[]) {
    unitKpis.forEach((kpi) => {
      let unitKPI = new UnitKPI({
        id: kpi.id || undefined,
        kpiCopyId: kpi?.kpiCopy?.id || undefined,
        unitKPIRequestId: kpi.unitKPIRequestId || undefined,
        unitKPIRequest: kpi.unitKPIRequest || undefined,
        reportingCategory: kpi?.reportingCategory || undefined,
        achievementDate: kpi?.achievementDate || undefined,
        status: kpi.status,
        target: kpi?.target,
        weight: kpi?.weight || undefined,
        values: kpi?.values || undefined,
        kpiCopy: kpi.kpiCopy,
        ownerName: kpi.ownerName,
      });
      this.addUnitKPI(unitKPI);
    });
  }

  private async initUnits() {
    let result = this.unitKPIRequestsService
      .getUnits()
      .pipe(takeUntil(this.destroy$));
    this.allUnits = (await lastValueFrom(result)) as Unit[];
  }

  private getAllStrategies() {
    this.strategiesService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.strategies = res;
        let orderedStrategies = this.strategies.sort((a, b) => new Date(b.createdAt as Date).getTime() - new Date(a.createdAt as Date).getTime());
        if (orderedStrategies[0] != null) {
          this.selectedStrategyId = orderedStrategies[0].id as number
          this.paginationItem.strategyId = orderedStrategies[0].id as number

          let roles = this.authService.getUserRoles()?.split(',')[0];
          let firstRole = roles?.toString() as UserRoles;
          this.getPaginatedValues(firstRole);
        }
      });
  }

  //#endregion

  //#region Modal

  private prepareAttachmentModal(
    data: any = null,
    template: any,
    actionType: ActionType = ActionType.View,
    type: AttachmentType,
    isSmall: boolean = false
  ) {
    let modalReference = this.innerOpenModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      actionType: actionType,
      attachmentType: type,
    };
    return baseModal;
  }

  private prepareModal(
    data: any = null,
    template: any,
    actionType: ActionType = ActionType.View,
    isWorkSpaceAdmin: boolean = false,
    isSmall: boolean = false,
  ) {
    let modalReference = this.innerOpenModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      actionType: actionType,
      isWorkSpaceAdmin: isWorkSpaceAdmin
    };
    return baseModal;
  }

  private innerOpenModal(template: any, isSmall: boolean = false) {
    let modalWindowClass = '';
    if (isSmall) modalWindowClass = 'modalSmallDialog';

    let modalReference = this.innerModalService.open(template, {
      windowClass: modalWindowClass,
      ariaLabelledBy: 'modal-basic-title',
    });
    return modalReference;
  }

  //#endregion
}
