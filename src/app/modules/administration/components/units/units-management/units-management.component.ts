import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { UnitsService } from '../../../services/unit.service';
import { Unit } from '../../entities/unit';

@Component({
  selector: 'app-units-management',
  templateUrl: './units-management.component.html',
  styleUrls: ['./units-management.component.css'],
})
export class UnitsManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedUnits: Unit[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    name: 'Name',
    code: 'Code',
  };

  //#endregion

  //#region Constructor

  constructor(private unitsService: UnitsService, modalService: NgbModal) {
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
        this.paginatedUnits.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedUnits.sort((a, b) => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      case this.sortingBy.code:
        this.paginatedUnits.sort((a, b) => {
          return a.code?.localeCompare(b.code as string) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  unitAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  unitUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  unitDeletedEventHandler(event: number) {
    this.unitsService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.unitsService.errorToaster('Failed to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.unitsService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.unitsService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedUnits = res.items as Unit[];

        this.paginatedUnits.map((dep) => {
          let owner = dep.users?.find(usr => usr.isManager)

          dep.ownerName = `${owner?.firstName} ${owner?.lastName}`
        })
      });
  }

  //#endregion
}
