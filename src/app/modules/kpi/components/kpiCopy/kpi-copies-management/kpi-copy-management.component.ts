import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { KPICopy } from '../../../entities/classes/kpi-copy';
import { KPICopiesService } from '../../../services/kpi-copies.service';

@Component({
  selector: 'app-kpi-copy-management',
  templateUrl: './kpi-copy-management.component.html',
  styleUrls: ['./kpi-copy-management.component.css'],
})
export class KPICopyManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedKPICopies: KPICopy[] = [];
  searchValue: string = '';

  sortingBy = {
    code: 'Code',
    name: 'Name',
    sense: 'Sense',
  };

  //#endregion

  //#region Constructor

  constructor(
    private kpiCopiesService: KPICopiesService,
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
      case this.sortingBy.code:

      case this.sortingBy.code:
        this.paginatedKPICopies.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedKPICopies.sort((a, b): number => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      case this.sortingBy.sense:
        this.paginatedKPICopies.sort((a, b): number => {
          return String(a.valueSense).localeCompare(
            String(b.valueSense)
          ) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  kpiCopyAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  kpiCopyUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  kpiCopyDeletedEventHandler(event: number) {
    this.kpiCopiesService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.kpiCopiesService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.kpiCopiesService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.kpiCopiesService
      .getKPICopiesPaginated(this.paginationItem, null)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedKPICopies = res.items as KPICopy[];
      });
  }

  //#endregion
}
