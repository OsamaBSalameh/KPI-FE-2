import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { Strategy } from '../../../entities/classes/strategy';
import { StrategiesService } from '../../../services/strategies.service';

@Component({
  selector: 'app-strategies-management',
  templateUrl: './strategies-management.component.html',
  styleUrls: ['./strategies-management.component.css'],
})
export class StrategiesManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedStrategies: Strategy[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    name: 'Name',
    startDate: 'Start',
    endDate: 'End',
    status: 'Status',
  };

  //#endregion

  //#region Constructor

  constructor(
    private strategiesService: StrategiesService,
    modalService: NgbModal
  ) {
    super(modalService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getPaginatedValues();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  //#endregion

  //#region Events

  getPaginatedValues() {
    this.getFormTypesPaginated();
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

  copy(data: any, content: any) {
    super.showCopyModal(data, content);
  }

  view(data: any, content: any) {
    super.showViewModal(data, content);
  }

  search() {
    this.paginationItem.searchValue = this.searchValue;
    this.preSearch();
    this.getPaginatedValues();
  }

  sort(sortBy: string) {
    switch (sortBy) {
      case this.sortingBy.id:
        this.paginatedStrategies.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedStrategies.sort((a, b) => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      case this.sortingBy.startDate:
        this.paginatedStrategies.sort((a, b) => {
          return (
            <any>+new Date(a.startDate as any) -
            <any>+new Date(b.startDate as any)
          );
        });
        break;

      case this.sortingBy.endDate:
        this.paginatedStrategies.sort((a, b): number => {
          return (
            <any>+new Date(a.endDate as any) - <any>+new Date(b.endDate as any)
          );
        });
        break;

      case this.sortingBy.status:
        this.paginatedStrategies.sort((a, b): number => {
          return a.status?.value?.localeCompare(
            b.status?.value as string
          ) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  strategyAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  strategyUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  strategyDeletedEventHandler(event: number) {
    this.strategiesService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.strategiesService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.strategiesService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.strategiesService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedStrategies = res.items as Strategy[];
      });
  }

  //#endregion
}
