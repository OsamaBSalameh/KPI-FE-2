import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { KPI } from '../../../entities/classes/kpi';
import { KPIsService } from '../../../services/kpis.service';

@Component({
  selector: 'app-kpi-management',
  templateUrl: './kpi-management.component.html',
  styleUrls: ['./kpi-management.component.css'],
})
export class KPIManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedKPIs: KPI[] = [];
  searchValue: string = '';

  sortingBy = {
    code: 'Code',
    name: 'Name',
    sense: 'Sense',
    // data: 'Data'
  };

  //#endregion

  //#region Constructor

  constructor(private kpisService: KPIsService, modalService: NgbModal) {
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
        this.paginatedKPIs.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedKPIs.sort((a, b): number => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      case this.sortingBy.sense:
        this.paginatedKPIs.sort((a, b): number => {
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

  kpiAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  kpiUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  kpiDeletedEventHandler(event: number) {
    this.kpisService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.kpisService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.kpisService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.kpisService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedKPIs = res.items as KPI[];
      });
  }

  //#endregion
}
