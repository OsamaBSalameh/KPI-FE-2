import {
  AfterViewChecked,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { UserRoles } from 'src/app/core/base-entity/base-enums';
import { KPI } from 'src/app/modules/kpi/entities/classes/kpi';
import { KPICopy } from 'src/app/modules/kpi/entities/classes/kpi-copy';
import { UnitKPI } from 'src/app/modules/kpi/entities/classes/unit-kpi';
import { UnitKPIRequest } from 'src/app/modules/kpi/entities/classes/unit-kpi-request';
import { ReportingCategory } from 'src/app/modules/kpi/entities/enums/value-sense-enum';
import { KPICopiesService } from 'src/app/modules/kpi/services/kpi-copies.service';
import { KPIsService } from 'src/app/modules/kpi/services/kpis.service';
import { UnitKPIRequestService } from 'src/app/modules/kpi/services/unit-kpi-requests.service';
import { DestroyBaseComponent } from 'src/app/shared/baseComponents/destroy-base.component';
import { ActionType } from 'src/app/shared/enums/action-type';
import { AttachmentType } from 'src/app/shared/enums/attachment-type';
import { UnitKPIRequestStatusEnum } from 'src/app/shared/enums/unit-kpi-request-status';
import {
  CustomValidator,
  enumToObject,
  fromDateToNgDate,
  isNullOrUndefined,
} from 'src/app/shared/tools/base-tools';

declare var $: any;

@Component({
  selector: 'app-selected-unit-kpis-management',
  templateUrl: './selected-unit-kpis-management.component.html',
  styleUrls: ['./selected-unit-kpis-management.component.css'],
})
export class SelectedUnitKPIsManagementComponent
  extends DestroyBaseComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  //#region Variables
  @Input() public actionType: ActionType = ActionType.Update;

  @Input() public selectUnitKPIsModal: FormGroup = this.formBuilder.group({
    strategy: [0, [Validators.required, Validators.min(1)]],
    owner: [0, [Validators.required, Validators.min(1)]],
    responseDueDate: [
      null,
      [Validators.required, CustomValidator.lessThan('responseDueDate')],
    ],
    escalationDate: [
      null,
      [Validators.required, CustomValidator.greaterThan('escalationDate')],
    ],
    organizationUnitId: [0, []],
    selectedKPIs: [
      { value: null, disabled: this.actionType != ActionType.Update },
      [],
    ],
    unitKPIsFormArray: this.formBuilder.array([]),
  });

  @Input() public submitted: boolean = false;
  @Input() public unitKPIRequest: UnitKPIRequest = new UnitKPIRequest({
    id: undefined,
    isEnabled: true,
  });

  searchValue: string = '';

  kpis: KPI[] = [];
  reportingCategories = [] as any[];
  weightSum: number = 0;

  @Input() public weightSumNotEnough: boolean = false;

  commentsModal: any;
  attachmentsModal: any;
  viewKpiModal: any;

  expandedRowIndex: number | null = null; // Tracks which row is open

  sortingBy = {
    id: 'Id',
    strategy: 'Strategy',
    kpiOwner: 'KPIOwner',
    creationDate: 'CreationDate',
    status: 'Status',
    lastModified: 'LastModified',
    replayDueDate: 'ReplayDueDate',
  };

  dropdownSettings = {
    idField: 'id',
    textField: 'name',
    noDataAvailablePlaceholderText: 'There is no item availabale to show',
    allowSearchFilter: true,
    singleSelection: false,
  };
  //#endregion

  //#region Constructor

  constructor(
    private unitKPIRequestsService: UnitKPIRequestService,
    private _KPIsService: KPIsService,
    private _KPICopiesService: KPICopiesService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private auth: AuthService
  ) {
    super();
  }

  ngAfterViewChecked(): void {
    this.checkWeightSum(null);
  }

  override async ngOnInit(): Promise<void> {
    debugger
    super.ngOnInit();

    // await this.initKPIs()
    if (!isNullOrUndefined(this.unitKPIRequest?.id)) {
      await this.initKPISelectionList();
      await this.getUnitKPIsByRequest();
    }

    this.iniFrequencyList();
    this.determineActionType();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  //#endregion

  //#region Events

  viewComments(data: FormGroup | undefined, template: any) {
    this.commentsModal = this.prepareModal(
      data?.getRawValue(),
      template,
      false
    );
  }

  viewKPI(data: FormGroup | undefined, template: any) {
    let values = data?.getRawValue();
    let kpiCopy: KPICopy | undefined = values.kpiCopy;
    this.viewKpiModal = this.prepareModal(
      kpiCopy,
      template,
      false,
      ActionType.View
    );
  }

  updateKPI_ByOWNER(data: FormGroup | undefined, template: any) {
    let values = data?.getRawValue();
    let kpiCopy: KPICopy | undefined = values.kpiCopy;

    if (values.kpiCopyId != null && values.kpiCopyId > 0)
      this.viewKpiModal = this.prepareModal(
        kpiCopy,
        template,
        false,
        ActionType.Update
      );
    else
      this.viewKpiModal = this.prepareModal(
        kpiCopy,
        template,
        false,
        ActionType.Add
      );
  }

  updateKPI_By_WORK_SPACE_ADMIN(data: FormGroup | undefined, template: any) {
    let values = data?.getRawValue();
    let kpiCopy: KPICopy | undefined = values.kpiCopy;

    if (values.kpiCopyId != null && values.kpiCopyId > 0)
      this.viewKpiModal = this.prepareSemiUpdateModal(
        kpiCopy,
        template,
        false,
        ['dataCustodianId', 'dataSponsorId'],
        ActionType.SemiUpdate
      );
  }

  unitKPIAttachmentsManagement(data: FormGroup | undefined, template: any) {
    this.attachmentsModal = this.prepareAttachmentModal(
      data?.getRawValue(),
      template,
      AttachmentType.KPICopy,
      false
    );
  }

  checkWeightSum(event: any) {
    let allWeights = document.getElementsByClassName('dummyWeightClass') as any;

    this.weightSum = 0;
    for (const weight of allWeights) {
      if (!isNullOrUndefined(weight.value) && weight.value != '')
        this.weightSum += Number.parseInt(weight.value);
    }
  }

  kpiCopyAddedEventHandler(event: any) {
    this.unitKPIsFormArray().controls.find((cont) => {
      var innerControl: FormGroup = cont as FormGroup;
      innerControl.controls['kpiCopy'].setValue(event);
      innerControl.controls['dataCustodionName'].setValue(
        event.dataCustodian.fullName
      );
      innerControl.controls['dataSponsorName'].setValue(
        event.dataSponsor.fullName
      );
      innerControl.controls['measurmentUnit'].setValue(
        event.measurmentUnit.value
      );
    });
  }

  kpiCopyUpdatedEventHandler(event: any) {
    this.unitKPIsFormArray().controls.forEach((cont: any) => {
      if (cont.controls['kpiCopy'].value.kpiTemplateId == event.kpiTemplateId) {
        cont.controls['kpiCopy'].setValue(event);
        cont.controls['dataCustodionName'].setValue(
          event.dataCustodian.fullName
        );
        cont.controls['dataSponsorName'].setValue(event.dataSponsor.fullName);
        cont.controls['measurmentUnit'].setValue(event.measurmentUnit.value);
      }
    });
  }

  toggleRow(index: number) {
    // Toggle: if clicking the same row, close it; otherwise open the new one
    this.expandedRowIndex = (this.expandedRowIndex === index) ? null : index;
  }

  //#endregion

  //#region Selection

  async onKPISelect(kpi: any) {
    // select KPI from DB
    let newUnitKPI = new UnitKPI({
      kpiCopy: await this.getCopyByTemplate(kpi.id),
    });
    this.addUnitKPI(newUnitKPI);
  }

  onDeSelectKPI(kpi: any) {
    let groupIndex = this.getGroupIndex(kpi.id);
    this.removeUnitKPI(groupIndex);
  }

  onDeSelectAll() {
    let groups = this.unitKPIsFormArray();
    while (groups.length !== 0) groups.removeAt(0);
  }

  onSelectAllKPIs(kpis: any) {
    let newKPIs = kpis.filter(
      (k: { id: any }) =>
        !this.selectUnitKPIsModal.value.selectedKPIs
          ?.map((i: { id: any }) => {
            return i.id;
          })
          .includes(k.id)
    );

    newKPIs.forEach((kpi: { id: any; name: string | undefined }) => {
      this.onKPISelect(kpi);
      this.selectUnitKPIsModal.value?.selectedKPIs?.push(kpi);
    });
  }

  public is_KPI_OWNER_ActionNeeded() {
    return (
      this.unitKPIRequest.status?.code == UnitKPIRequestStatusEnum.Requested_By_WORK_SPACE_ADMIN ||
      this.unitKPIRequest.status?.code == UnitKPIRequestStatusEnum.Returned_By_CEO ||
      this.unitKPIRequest.status?.code == UnitKPIRequestStatusEnum.Returned_By_WORK_SPACE_ADMIN ||
      this.unitKPIRequest.status?.code == UnitKPIRequestStatusEnum.Draft_Save_By_KPI_OWNER
    );
  }

  public has_KPI_OWNER_Permissin() {
    let roles = this.auth.getUserRoles()?.split(',');
    return roles?.includes(UserRoles.KPI_OWNER);
  }

  public is_Approved_Via_CEO() {
    return (
      this.unitKPIRequest.status?.code == UnitKPIRequestStatusEnum.Approved_By_CEO
    );
  }

  public has_WORK_SPACE_ADMIN_Permission() {
    let roles = this.auth.getUserRoles()?.split(',');
    return roles?.includes(UserRoles.WORK_SPACE_ADMIN);
  }
  //#endregion

  //#region Unit KPIs [Form Array]

  addUnitKPI(data: any = null) {
    this.unitKPIsFormArray().push(this.newUnitKPI(data));
  }

  removeUnitKPI(i: number) {
    this.unitKPIsFormArray().removeAt(i);
  }

  unitKPIsFormArray(): FormArray {
    return this.selectUnitKPIsModal.get('unitKPIsFormArray') as FormArray;
  }

  unitKPIFormGroups(): FormGroup[] {
    return (this.selectUnitKPIsModal.get('unitKPIsFormArray') as FormArray)
      .controls as FormGroup[];
  }

  getKPICopyViaKpiId() {
    let formControls = this.unitKPIsFormArray().controls;
  }

  newUnitKPI(data: UnitKPI): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      kpiCopyId: [data?.kpiCopy?.id || 0, []],
      kpiCopy: data?.kpiCopy,
      unitKPIRequestId: [this.unitKPIRequest?.id, []],
      kpiName: [data?.kpiCopy?.name || null, []],
      // dataName: [data?.kpi?.kpiData?.name || null, []],
      dataCustodionName: [data?.kpiCopy?.dataCustodian?.fullName || 0, []],
      dataSponsorName: [data?.kpiCopy?.dataSponsor?.fullName || 0, []],
      measurmentUnit: [data?.kpiCopy?.measurmentUnit?.value || null, []],
      target: [
        data?.target || 0,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.min(1),
        ],
      ],
      reportingCategory: [
        data?.reportingCategory || 0,
        [Validators.required, Validators.min(1)],
      ],
      achievementDate: [
        fromDateToNgDate(data?.achievementDate) || null,
        [Validators.required],
      ],
      weight: [
        data?.weight || null,
        [Validators.required, Validators.max(100), Validators.min(1)],
      ],
      createdAt: [data?.createdAt || new Date(Date.now())],
      createdBy: [data?.createdBy || this.auth.getUserId()],
    });
  }

  //#endregion

  //#region Private Functions

  private prepareTable() {
    // $('#myTable')
    //   .DataTable({ paging: false, searching: false, ordering: false, info: false,
    //     responsive: false, lengthChange: false, autoWidth: false,
    //     buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis'],
    //   })
    //   .buttons().container().appendTo('#myTable_wrapper .col-md-6:eq(0)');

    $(function () {
      $('#myTable')
        .DataTable({
          paging: false,
          lengthChange: false,
          searching: false,
          ordering: false,
          info: true,
          responsive: true,
          autoWidth: false,
          buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'colvis'],
        })
        .buttons()
        .container()
        .appendTo('#myTable_wrapper .col-md-6:eq(0)');
    });
  }

  private async getUnitKPIsByRequest() {
    let unitKPIs = this.unitKPIRequestsService
      .getUnitKPIsByRequest(this.unitKPIRequest?.id as number)
      .pipe(takeUntil(this.destroy$));
    let result = await lastValueFrom(unitKPIs);

    result.forEach((unitKPI: any) => {
      this.addUnitKPI(unitKPI);
    });

    let kpis = result.map((re) => {
      return { id: re.kpiCopy?.kpiTemplateId, name: re.kpiCopy?.name };
    });
    this.selectUnitKPIsModal.controls['selectedKPIs'].setValue(kpis || null);
  }

  // private async initKPIs() {
  //   let KPIsResult = this._KPIsService.getAllEagerly().pipe(takeUntil(this.destroy$))
  //   this.kpis = await lastValueFrom(KPIsResult) as unknown as KPI[];
  // }

  private async initKPISelectionList() {
    debugger
    let KPIsResult = this._KPIsService
      .getAllTemplateNames(this.unitKPIRequest?.id as number)
      .pipe(takeUntil(this.destroy$));
    this.kpis = (await lastValueFrom(KPIsResult)) as unknown as KPI[];
  }

  private getGroupIndex(id: number): any {
    let groups = this.unitKPIFormGroups();
    var value = null;

    groups.forEach((group, index) => {
      Object.keys(group.controls).forEach((key) => {
        if (
          key == 'kpiCopy' &&
          group.controls['kpiCopy'].value['kpiTemplateId'] == id
        )
          value = index;
      });
    });

    return value;
  }

  private iniFrequencyList() {
    this.reportingCategories = enumToObject(ReportingCategory);
  }

  private determineActionType() {
    if (
      this.actionType != ActionType.Update ||
      !this.is_KPI_OWNER_ActionNeeded()
    ) {
      this.selectUnitKPIsModal.controls['unitKPIsFormArray'].disable();
      this.selectUnitKPIsModal.controls['selectedKPIs'].disable();
    } else {
      this.selectUnitKPIsModal.controls['unitKPIsFormArray'].enable();
      this.selectUnitKPIsModal.controls['selectedKPIs'].enable();
    }
  }

  private async getCopyByTemplate(templateId: number): Promise<KPICopy> {
    let copy = this._KPICopiesService
      .getCopyByTemplate(templateId)
      .pipe(takeUntil(this.destroy$));
    let result = await lastValueFrom(copy);
    return result;
  }

  //#endregion

  //#region Modal

  private prepareAttachmentModal(
    data: any = null,
    template: any,
    type: AttachmentType,
    isSmall: boolean = false
  ) {
    let modalReference = this.openModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      actionType: this.actionType,
      attachmentType: type,
    };
    return baseModal;
  }

  private prepareModal(
    data: any = null,
    template: any,
    isSmall: boolean = false,
    actionType: ActionType = this.actionType
  ) {
    let modalReference = this.openModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      actionType: actionType,
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

  private prepareSemiUpdateModal(
    data: any = null,
    template: any,
    isSmall: boolean = false,
    toBeUpdatedList: string[],
    actionType: ActionType = this.actionType
  ) {
    let modalReference = this.openModal(template, isSmall);
    let baseModal: any = {
      modalReference: modalReference,
      data: data,
      toBeUpdatedList: toBeUpdatedList,
      actionType: actionType,
    };
    return baseModal;
  }

  //#endregion
}
