import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { DelegationsService } from '../../services/delegations.service';
import { Delegation } from '../../entities/delegation';
import { lastValueFrom, takeUntil } from 'rxjs';
import { Unit } from 'src/app/modules/administration/components/entities/unit';
import { DelegationStatusEnum } from '../../entities/delegation-status';
import { ActionType } from 'src/app/shared/enums/action-type';

@Component({
  selector: 'app-delegation-management',
  templateUrl: './delegation-management.component.html',
  styleUrls: ['./delegation-management.component.css'],
})
export class DelegationManagementComponent extends ModalBaseComponent implements OnInit, OnDestroy {
  //#region Variables
  @ViewChild('confirmationModal') confirmationPop: ElementRef | undefined =
  undefined;

  paginatedDelegations: Delegation[] = [];

  allUnits: Unit[] = [];
  selectedUnit: any = 0;

  sortingBy = {
    id: 'Id',
    delegateFrom: 'DelegateFrom',
    delegateTo: 'DelegateTo',
    startDate: 'StartDate',
    endDate: 'EndDate',
    status: 'Status',
  };

  Pending: number = DelegationStatusEnum.Pending;
  Active: number = DelegationStatusEnum.Active;
  Stopped: number = DelegationStatusEnum.Stopped;
  Completed: number = DelegationStatusEnum.Completed;

  popupConfirmationMessage: string = '';

  confirmationModalReference: any;
  //#endregion

  //#region Constructor
  constructor(
    private delegationsService: DelegationsService,
    modalService: NgbModal
  ) {
    super(modalService);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.getPaginatedValues();
    this.allUnits = await this.initUnits();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
  //#endregion

  //#region Events
  getPaginatedValues() {
    this.getDelegationsPaginated();
  }

  add(content: any) {
    super.showAddModal(content);
  }

  update(data: any, content: any) {
    super.showUpdateModal(data, content);
  }

  copy(data: any, content: any) {
    super.showCopyModal(data, content);
  }

  view(data: any, content: any) {
    super.showViewModal(data, content);
  }

  stopDelegation(data: any, content: any) {
    let modalReference = this.openConfirmationModal(content, true);
    this.confirmationModalReference = {
      modalReference: modalReference,
      modalData: data,
      message: 'Please Confirm Stop action',
      type: ActionType.View,
    };
  }

  sort(sortBy: string) {
    switch (sortBy) {
      case this.sortingBy.id:
        this.paginatedDelegations.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.delegateFrom:
        this.paginatedDelegations.sort((a, b): number => {
          return a.delegatedFrom?.fullName?.localeCompare(
            b.delegatedFrom?.fullName as string
          ) as number;
        });
        break;

      case this.sortingBy.delegateTo:
        -this.paginatedDelegations.sort((a, b): number => {
          return a.delegatedTo?.fullName?.localeCompare(
            b.delegatedFrom?.fullName as string
          ) as number;
        });
        break;

      case this.sortingBy.startDate:
        this.paginatedDelegations.sort((a, b): number => {
          return (
            <any>+new Date(a.startDate as any) -
            <any>+new Date(b.startDate as any)
          );
        });
        break;

      case this.sortingBy.endDate:
        this.paginatedDelegations.sort((a, b): number => {
          return (
            <any>+new Date(a.endDate as any) - <any>+new Date(b.endDate as any)
          );
        });
        break;

      case this.sortingBy.status:
        -this.paginatedDelegations.sort((a, b): number => {
          return a.status?.value?.localeCompare(
            b.status?.value as string
          ) as number;
        });
        break;

      default:
        break;
    }
  }

  onOrganizationSelect(data: any) {
    this.selectedUnit = data.value;
    this.getPaginatedValues();
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case this.Active: return 'status-active';
      case this.Pending: return 'status-pending';
      case this.Completed: return 'status-completed';
      case this.Stopped: return 'status-stopped';
      default: return 'status-pending';
    }
  }

  getStatusIcon(statusId: number): string {
    switch (statusId) {
      case this.Active: return 'fa-check-circle';
      case this.Pending: return 'fa-clock';
      case this.Completed: return 'fa-check-double';
      case this.Stopped: return 'fa-stop-circle';
      default: return 'fa-question-circle';
    }
  }
  //#endregion

  //#region Handlers
  delegationAddedEventHandler(event: any) {
    let modalReference = this.openConfirmationModal(this.confirmationPop, true);
    this.confirmationModalReference = {
      modalReference: modalReference,
      modalData: event,
      message: 'Please Confirm Add',
      type: ActionType.Add,
    };
  }

  delegationUpdatedEventHandler(event: any) {
    let modalReference = this.openConfirmationModal(this.confirmationPop, true);
    this.confirmationModalReference = {
      modalReference: modalReference,
      modalData: event,
      message: 'Please Confirm Update',
      type: ActionType.Update,
    };
  }

  confirmedEventHandler(event: any) {
    if (this.confirmationModalReference.type == ActionType.Add)
      this.addDelegation(event);

    if (this.confirmationModalReference.type == ActionType.Update)
      this.updateDelegation(event);

    if (this.confirmationModalReference.type == ActionType.View)
      this.stopDelegate(event.id);
  }

  //#endregion

  //#region Private Functions

  private getDelegationsPaginated() {
    this.delegationsService
      .getValuesPaginatedByDepartment(this.paginationItem, this.selectedUnit)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedDelegations = res.items as Delegation[];
      });
  }

  private async initUnits() {
    let result = this.delegationsService
      .getUnits()
      .pipe(takeUntil(this.destroy$));
    return (await lastValueFrom(result)) as Unit[];
  }

  private addDelegation(delegation: Delegation) {
    this.delegationsService.add(delegation).subscribe({
      error: () => {
        this.delegationsService.errorToaster('Failed to save');
      },
      next: () => {
        this.delegationsService.successToaster('Saved successfully');
        this.getPaginatedValues();
      },
    });
  }

  private updateDelegation(delegation: Delegation) {
    this.delegationsService.update(delegation).subscribe({
      error: () => {
        this.delegationsService.errorToaster('Failed to update');
      },
      next: () => {
        this.delegationsService.successToaster('Updated successfully');
        this.getPaginatedValues();
      },
    });
  }

  private stopDelegate(id: number) {
    this.delegationsService
      .stopDelegation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.delegationsService.errorToaster('Failed to stop delegation');
        },
        next: () => {
          this.delegationsService.successToaster('Stopped successfully');
          this.getPaginatedValues();
        },
      });
  }

  //#endregion
}
