import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { Prospective } from '../../../entities/lookups-entities';
import { ProspectivesService } from '../../../services/lookups.service';

@Component({
  selector: 'app-prospectives-management',
  templateUrl: './prospectives-management.component.html',
  styleUrls: ['./prospectives-management.component.css'],
})
export class ProspectivesManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedProspectives: Prospective[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    name: 'Name',
  };

  //#endregion

  //#region Constructor

  constructor(private prospectivesService: ProspectivesService, modalService: NgbModal) {
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

  update(formType: any, content: any) {
    super.showUpdateModal(formType, content);
  }

  view(formType: any, content: any) {
    super.showViewModal(formType, content);
  }

  search() {
    this.paginationItem.searchValue = this.searchValue;
    this.preSearch();
    this.getPaginatedValues();
  }

  sort(sortBy: string) {
    switch (sortBy) {
      case this.sortingBy.id:
        this.paginatedProspectives.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedProspectives.sort((a, b) => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  prospectiveAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  prospectiveUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  prospectiveDeletedEventHandler(event: number) {
    this.prospectivesService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.prospectivesService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.prospectivesService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.prospectivesService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedProspectives = res.items as Prospective[];
      });
  }

  //#endregion
}
