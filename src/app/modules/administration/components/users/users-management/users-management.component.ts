import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { User } from 'src/app/shared/entities/users/user';
import { ActionType } from 'src/app/shared/enums/action-type';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css'],
})
export class UsersManagementComponent
  extends ModalBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  paginatedUsers: User[] = [];
  searchValue: string = '';
  public actionType: ActionType | undefined;
  sortingBy = {
    id: 'Id',
    fullName: 'Name',
    unit: 'Unit',
  };

  //#endregion

  //#region Constructor

  constructor(private usersService: UserService, modalService: NgbModal) {
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
        this.paginatedUsers.sort((a, b) => {
          return <number>a.id - <number>b.id;
        });
        break;

      case this.sortingBy.fullName:
        this.paginatedUsers.sort((a, b) => {
          return a.fullName?.localeCompare(b.fullName as string) as number;
        });
        break;

      case this.sortingBy.unit:
        this.paginatedUsers.sort((a, b) => {
          return a.organizationUnit?.name?.localeCompare(
            b.organizationUnit?.name as string
          ) as number;
        });
        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Handlers

  userAddedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  userUpdatedEventHandler(event: any) {
    this.getPaginatedValues();
  }

  userDeletedEventHandler(event: number) {
    this.usersService
      .delete(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.usersService.errorToaster('Faild to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.usersService.successToaster('Deleted successfully');
        },
      });
  }

  userProfilePictureEventHandler(files: any) {
    this.getPaginatedValues();
  }

  //#endregion

  //#region Private Functions

  private getFormTypesPaginated() {
    this.usersService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.paginatedUsers = res.items.map(
          (user: Partial<User> | undefined) => {
            return new User(user);
          }
        );
      });
  }

  //#endregion
}
