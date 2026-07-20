import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { Objective } from '../../../entities/classes/objective';
import { ObjectivesService } from '../../../services/objectives.service';

@Component({
  selector: 'app-objectives-management',
  templateUrl: './objectives-management.component.html',
  styleUrls: ['./objectives-management.component.css'],
})
export class ObjectivesManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy {
  //#region Variables

  paginatedObjectives: Objective[] = [];
  searchValue: string = '';

  sortingBy = {
    code: 'Code',
    name: 'Name',
    target: 'Target',
    measurmentUnit: 'MeasurmentUnit',
  };

  //#endregion

  //#region Constructor

  constructor(
    private objectivesService: ObjectivesService,
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

  copy(data: any, content: any) {
    super.showCopyModal(data, content);
  }

  update(data: any, content: any) {
    super.showUpdateModal(data, content);
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
        this.paginatedObjectives.sort((a, b): number => {
          return a.code?.localeCompare(b.code as string) as number;
        });
        break;

      case this.sortingBy.name:
        this.paginatedObjectives.sort((a, b): number => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      case this.sortingBy.target:
        this.paginatedObjectives.sort((a, b): number => {
          return (a.target as number) - (b.target as number);
        });
        break;

      case this.sortingBy.measurmentUnit:
        this.paginatedObjectives.sort((a, b): number => {
          return a.measurmentUnit?.value?.localeCompare(
            b.measurmentUnit?.value as string
          ) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  objectiveAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  objectiveUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  objectiveDeletedEventHandler(event: number) {
    this.objectivesService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.objectivesService.errorToaster('Failed to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.objectivesService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.objectivesService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedObjectives = res.items as Objective[];
      });
  }

  //#endregion
}
