import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { PermissionGroupsService } from '../../../services/permission-group.service';
import { PermissionGroup } from '../../entities/permissionGroup';

@Component({
  selector: 'app-groups-management',
  templateUrl: './groups-management.component.html',
  styleUrls: ['./groups-management.component.css'],
})
export class GroupsManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedPermissionGroups: PermissionGroup[] = [];
  searchValue: string = '';

  sortingBy = {
    id: 'Id',
    name: 'Name',
  };

  //#endregion

  //#region Constructor

  constructor(
    private permissionGroupsService: PermissionGroupsService,
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
        this.paginatedPermissionGroups.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.name:
        this.paginatedPermissionGroups.sort((a, b) => {
          return a.name?.localeCompare(b.name as string) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  permissionGroupAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  permissionGroupUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  permissionGroupDeletedEventHandler(event: number) {
    this.permissionGroupsService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.permissionGroupsService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.permissionGroupsService.successToaster('Deleted successfully');
        },
      });
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.permissionGroupsService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedPermissionGroups = res.items as PermissionGroup[];
      });
  }

  //#endregion
}
