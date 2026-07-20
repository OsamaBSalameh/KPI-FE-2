import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { UserRoles } from 'src/app/core/base-entity/base-enums';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { ActionType } from 'src/app/shared/enums/action-type';
import { AttachmentType } from 'src/app/shared/enums/attachment-type';
import { UnitKPI } from '../../../entities/classes/unit-kpi';
import { UnitKPIRequestService } from '../../../services/unit-kpi-requests.service';
import { DatePipe } from '@angular/common';
import { UnitKPIStatusEnum } from 'src/app/shared/enums/unit-kpi-status';

@Component({
  selector: 'app-achieved-kpis',
  templateUrl: './achieved-kpis.component.html',
  styleUrls: ['./achieved-kpis.component.css']
})
export class AchievedKpisComponent extends ModalBaseComponent implements OnInit, OnDestroy, AfterContentChecked {

  //#region Variables

  unitKPIsModal: FormGroup = this.formBuilder.group({
    unitKPIsFormArray: this.formBuilder.array([])
  })

  commentsModal: any
  attachmentsModal: any

  userRoles = UserRoles
  selectedRole: any

  //#endregion


  //#region Constructor

  constructor(
    private unitKPIRequestsService: UnitKPIRequestService,
    private formBuilder: FormBuilder,
    private innerModalService: NgbModal,
    modalService: NgbModal,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    super(modalService);
  }

  ngAfterContentChecked(): void {
    document.getElementById(`${this.selectedRole}_BTN`)?.classList.add('active')
  }

  override async ngOnInit(): Promise<void> {
    
    super.ngOnInit()
    let roles = this.authService.getUserRoles()?.split(',').filter(ro => ro.toString() == UserRoles.KPI_OWNER || ro.toString() == UserRoles.DATA_CUSTADION)
    let firstRole = roles?.toString() as UserRoles
    this.getPaginatedValues(firstRole)
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  //#endregion


  //#region Form

  addUnitKPI(data: UnitKPI) { this.unitKPIsFormArray().push(this.newUnitKPI(data)) }

  removeUnitKPI(i: number) { this.unitKPIsFormArray().removeAt(i) }

  unitKPIsFormArray(): FormArray { return (this.unitKPIsModal.get('unitKPIsFormArray') as FormArray) }

  unitKPIFormGroups(): FormGroup[] { return (this.unitKPIsModal.get('unitKPIsFormArray') as FormArray).controls as FormGroup[] }

  newUnitKPI(data: UnitKPI): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      kpiCopyId: [data?.kpiCopy?.id || null, []],
      unitKPIRequestId: [data.unitKPIRequestId, []],
      kpiName: [data?.kpiCopy?.name || null, []],
      organizationName: [data?.unitKPIRequest?.organizationUnit?.name || null, []],
      kpiOwnerName: [data?.ownerName || null, []],
      // dataName: [data?.kpiCopy?.kpiData?.name || null, []],
      measurmentUnit: [data?.kpiCopy?.measurmentUnit?.value || null, []],
      target: [data?.target || 0, []],
      reportingCategory: [data?.reportingCategory || 0, []],
      achievementDate: [this.datePipe.transform(data?.achievementDate, 'dd/MM/yyyy, h:mm a') || null, []],
      status: [data.status?.value || null, []],
      statusCode: [data.status?.code || null, []],
      weight: [data?.weight || null, []],
      // value: [data?.value || null, [Validators.required, Validators.maxLength(100)]]
    })
  }

  //#endregion


  //#region Actions

  override onLimitChange(event: any){
    this.paginationItem.pageSize = event.value != 'all' ? event.value as number : this.paginationResult.totalCount
    this.getPaginatedValues(this.selectedRole);
  }

  getPaginatedValues(permission: UserRoles | undefined = undefined): void {
    let data = {
      paignationRequest: this.paginationItem,
      userId: Number.parseInt(this.authService.getUserId() as string)
    }

    this.selectedRole = permission || this.selectedRole;
    document.getElementById(`${this.selectedRole}_BTN`)?.classList.add('active')

    switch (this.selectedRole) {
      case UserRoles.KPI_OWNER:
        this.achievedUnitKPIsForOwner(data)
        this.disableForm()
        document.getElementById(`DATA_CUSTADION_BTN`)?.classList.remove('active')
        document.getElementById(`DATA_SPONSER_BTN`)?.classList.remove('active')
        break;

      case UserRoles.DATA_CUSTADION:
        this.achievedUnitKPIsForDataCustodian(data)
        document.getElementById(`KPI_OWNER_BTN`)?.classList.remove('active')
        document.getElementById(`DATA_SPONSER_BTN`)?.classList.remove('active')
        break;

      default:
        break;
    }
  }

  viewComments(data: FormGroup | undefined, template: any) {
    this.commentsModal = this.prepareModal(data?.getRawValue(), template, ActionType.Update, false)
  }

  reportingAttachmentsManagement(data: FormGroup | undefined, template: any) {
    
    let userRoles = this.authService.getUserRoles()
    let actionType = userRoles?.includes(UserRoles.DATA_CUSTADION) ? ActionType.Update : ActionType.Review
    this.attachmentsModal = this.prepareAttachmentModal(data?.getRawValue(), template, actionType, AttachmentType.ReportingKPI, false)
  }

  unitKPIAttachmentsManagement(data: FormGroup | undefined, template: any) {
    
    this.attachmentsModal = this.prepareAttachmentModal(data?.getRawValue(), template, ActionType.View, AttachmentType.KPICopy, false)
  }

  public colorBasedOnStatus(unitKPI: any): String  {
    switch (unitKPI.value.statusCode) {
      case UnitKPIStatusEnum.UnderReportingPeriod:
        return 'btn-outline-secondary';

      case UnitKPIStatusEnum.WaitingForReporting:
        return 'btn-outline-info';

      case UnitKPIStatusEnum.WaitingForDataSponserApproval:
        return 'btn-outline-secondary';

      case UnitKPIStatusEnum.ReturnedByDataSponser:
        return 'btn-outline-danger';

      case UnitKPIStatusEnum.WaitingForKpiOwnerApproval:
        return 'btn-outline-secondary';

      case UnitKPIStatusEnum.ReturnedByKpiOwner:
        return 'btn-outline-danger';

      case UnitKPIStatusEnum.ApprovedByKpiOwner:
        return 'btn-outline-success';

      default:
        return 'btn-outline-secondary'
    }
  }

  //#endregion


  //#region Paignation 

  public async achievedUnitKPIsForDataCustodian(data: any) {
    this.unitKPIRequestsService.achievedUnitKPIsForDataCustodian(data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.fillPaginationData(res)
      let items = res.items as UnitKPI[];

      this.unitKPIsModal.controls["unitKPIsFormArray"].reset();
      this.unitKPIsFormArray().clear();
      this.fillUnitKPI(items)
    })
  }

  public async achievedUnitKPIsForOwner(data: any) {
    this.unitKPIRequestsService.achievedUnitKPIsForOwner(data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.fillPaginationData(res)
      let items = res.items as UnitKPI[];

      this.unitKPIsModal.controls["unitKPIsFormArray"].reset();
      this.unitKPIsFormArray().clear();
      this.fillUnitKPI(items)
    })

    this.disableForm()
  }

  //#endregion


  //#region Private Functions

  private disableForm() { this.unitKPIsModal.controls['unitKPIsFormArray'].disable() }

  private fillUnitKPI(unitKpis: UnitKPI[]) {
    unitKpis.forEach(kpi => {
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
        // value: kpi?.value || undefined,
        kpiCopy: kpi.kpiCopy,
        ownerName: kpi.ownerName
      })
      this.addUnitKPI(unitKPI)
    })
  }

  //#endregion


  //#region Modal

  private prepareAttachmentModal(data: any = null, template: any, actionType: ActionType = ActionType.View, type: AttachmentType, isSmall: boolean = false) {
    let modalReference = this.innerOpenModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      actionType: actionType,
      attachmentType: type
    }
    return baseModal
  }

  private prepareModal(data: any = null, template: any, actionType: ActionType = ActionType.View, isSmall: boolean = false) {
    let modalReference = this.innerOpenModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      actionType: actionType,
    }
    return baseModal
  }

  private innerOpenModal(template: any, isSmall: boolean = false) {
    let modalWindowClass = "";
    if (isSmall) modalWindowClass = "modalSmallDialog";

    let modalReference = this.innerModalService.open(template, { windowClass: modalWindowClass, ariaLabelledBy: 'modal-basic-title' });
    return modalReference
  }

  //#endregion

}
