import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { Scorecard } from '../../../entities/classes/scorecard';
import { ScorecardsService } from '../../../services/scorecards.service';

@Component({
  selector: 'app-scorecards-management',
  templateUrl: './scorecards-management.component.html',
  styleUrls: ['./scorecards-management.component.css'],
})
export class ScorecardsManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedScorecards: Scorecard[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    name: 'Name',
  };

  //#endregion

  //#region Constructor

  constructor(
    private scorecardsService: ScorecardsService,
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
        this.paginatedScorecards.sort((a, b): number => {
          return (a.id as number) - (b.id as number);
        });
        break;

      case this.sortingBy.name:
        this.paginatedScorecards.sort((a, b): number => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  scorecardAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  scorecardUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  scorecardDeletedEventHandler(event: number) {
    this.scorecardsService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.scorecardsService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.scorecardsService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.scorecardsService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedScorecards = res.items as Scorecard[];
      });
  }

  //#endregion
}
