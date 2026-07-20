import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { ActionType } from 'src/app/shared/enums/action-type';
import { UnitKPIRequest } from '../../../entities/classes/unit-kpi-request';
import { UnitKPIRequestService } from '../../../services/unit-kpi-requests.service';
import { StrategiesService } from 'src/app/modules/design/services/strategies.service';
import { Strategy } from 'src/app/modules/design/entities/classes/strategy';

@Component({
  selector: 'app-unit-kpi-requests-management',
  templateUrl: './unit-kpi-requests-management.component.html',
  styleUrls: ['./unit-kpi-requests-management.component.css'],
})
export class UnitKPIRequestsManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy {
  //#region Variables

  paginatedUnitKPIRequests: UnitKPIRequest[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    strategy: 'Department',
    kpiOwner: 'KPIOwner',
    creationDate: 'CreationDate',
    status: 'Status',
    lastModified: 'LastModified',
    replayDueDate: 'ReplayDueDate',
  };

  currentUserId: number = 0;

  selectedStrategyId: number = 0;
  strategies: Strategy[] = [];

  //#endregion

  //#region Constructor
  constructor(
    private unitKPIRequestsService: UnitKPIRequestService,
    modalService: NgbModal,
    private authService: AuthService,
    private strategiesService: StrategiesService
  ) {
    super(modalService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getAllStrategies();
    this.currentUserId = Number.parseInt(
      this.authService.getUserId() as string
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  //#endregion

  //#region Events

  getPaginatedValues() {
    this.getFormTypesPaginatedRoleBased();
  }

  delete(data: any, content: any) {
    super.showDeleteModal(data, content);
  }

  add(content: any) {
    super.showAddModal(content);
  }

  update(data: any, content: any) {
    super.showUpdateModal(data, content);
  }

  view(data: any, content: any) {
    super.showViewModal(data, content);
  }

  review(data: any, content: any) {
    super.showCustomModal(data, content, ActionType.Review, null);
  }

  search() {
    this.paginationItem.searchValue = this.searchValue;
    this.preSearch();
    this.getPaginatedValues();
  }

  sort(sortBy: string) {
    switch (sortBy) {
      case this.sortingBy.id:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.strategy:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return a.strategy?.name?.localeCompare(
            b.strategy?.name as string
          ) as number;
        });
        break;

      case this.sortingBy.kpiOwner:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return a.organizationUnit?.owner?.firstName?.localeCompare(
            b.organizationUnit?.owner?.firstName as string
          ) as number;
        });
        break;

      case this.sortingBy.creationDate:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return (
            <any>+new Date(a.createdAt as any) -
            <any>+new Date(b.createdAt as any)
          );
        });
        break;

      case this.sortingBy.status:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return a.status?.value?.localeCompare(
            b.status?.value as string
          ) as number;
        });
        break;

      case this.sortingBy.creationDate:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return (
            <any>+new Date(a.responseDueDate as any) -
            <any>+new Date(b.responseDueDate as any)
          );
        });
        break;

      case this.sortingBy.replayDueDate:
        this.paginatedUnitKPIRequests.sort((a, b): number => {
          return (
            <any>+new Date(a.responseDueDate as any) -
            <any>+new Date(b.responseDueDate as any)
          );
        });
        break;

      default:
        break;
    }
  }

  onStrategySelected(data: any) {
    this.selectedStrategyId = parseInt(data.value);
    this.paginationItem.strategyId = parseInt(data.value);
    this.getPaginatedValues();
  }
  //#endregion

  //#region Handlers

  unitKPIRequestAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  unitKPIRequestUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  unitKPIRequestDeletedEventHandler(event: number) {
    this.unitKPIRequestsService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.unitKPIRequestsService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.unitKPIRequestsService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginatedRoleBased() {
    this.unitKPIRequestsService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedUnitKPIRequests = res.items as UnitKPIRequest[];
        this.paginatedUnitKPIRequests.forEach((element) => {
          if (element.organizationUnit != undefined)
            element.organizationUnit.owner =
              element.organizationUnit?.users?.find((usr) => usr.isManager);
        });
      });
  }

  private getAllStrategies() {
    this.strategiesService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.strategies = res;
        let orderedStrategies = this.strategies.sort(
          (a, b) =>
            new Date(b.createdAt as Date).getTime() -
            new Date(a.createdAt as Date).getTime()
        );
        if (orderedStrategies[0] != null) {
          this.selectedStrategyId = orderedStrategies[0].id as number;
          this.paginationItem.strategyId = orderedStrategies[0].id as number;
          this.getPaginatedValues();
        }
      });
  }

  //#endregion
}
