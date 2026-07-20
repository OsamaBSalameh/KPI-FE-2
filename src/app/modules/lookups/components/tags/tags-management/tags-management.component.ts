import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { Tag } from '../../../entities/tag';
import { TagsService } from '../../../services/tags.service';

@Component({
  selector: 'app-tags-management',
  templateUrl: './tags-management.component.html',
  styleUrls: ['./tags-management.component.css'],
})
export class TagsManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedTags: Tag[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    name: 'Name',
  };

  //#endregion

  //#region Constructor

  constructor(private tagsService: TagsService, modalService: NgbModal) {
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
        this.paginatedTags.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedTags.sort((a, b) => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  tagAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  tagUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  tagDeletedEventHandler(event: number) {
    this.tagsService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.tagsService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.tagsService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.tagsService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedTags = res.items as Tag[];
      });
  }

  //#endregion
}
