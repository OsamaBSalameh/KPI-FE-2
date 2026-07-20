import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { User } from 'src/app/shared/entities/users/user';
import { PermissionGroupsService } from '../../../services/permission-group.service';
import { PermissionGroup } from '../../entities/permissionGroup';
import { UserPermissionGroup } from '../../entities/user-permission-group';

@Component({
  selector: 'app-add-update-group',
  templateUrl: './add-update-group.component.html',
  styleUrls: ['./add-update-group.component.css']
})
export class AddUpdateGroupComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() permissionGroupAddedEvent = new EventEmitter<any>();
  @Output() permissionGroupUpdatedEvent = new EventEmitter<any>();

  permissionGroup: PermissionGroup = new PermissionGroup({});
  allUsers: User[] = []

  permissionGroupForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.maxLength(1000)]],
    code: [null, [Validators.required, Validators.maxLength(100)]],
    selectedUsers: [null, []],
    userPermissionGroups: this.formBuilder.array([])
  });
  get formFileds() { return this.permissionGroupForm.controls }

  override dropdownSettings = {
    idField: 'id',
    textField: 'fullName',
    noDataAvailablePlaceholderText: "There is no item availabale to show",
    allowSearchFilter: true,
    singleSelection: false
  };

  //#endregion


  //#region Constructor

  constructor(
    private permissionGroupsService: PermissionGroupsService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()

    await this.initUsers()
    this.initForm()

    this.determineActionType()
    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    super.onSubmit()

    if (this.permissionGroupForm.invalid) return

    this.prepareAddUpdateModel()
    this.save();
  }

  override save() { super.save() }

  add() { this.addPermissionGroup() }

  update() { this.updatePermissionGroup() }

  copy() { this.copyPermissionGroup() }

  //#endregion


  //#region Selection

  onUserSelect(user: any) {
    let userPermissionGroup: UserPermissionGroup = new UserPermissionGroup({
      userId: user?.id,
      permissionGroupId: undefined,
      id: undefined,
      isEnabled: true
    })

    this.addUserPermissionGroup(userPermissionGroup)
  }

  onDeSelectUser(user: any) {
    let index = this.getGroupIndex(user.id)
    this.removeUserPermissionGroup(index)
  }

  onDeSelectAll() {
    let groups = this.userPermissionGroups()
    while (groups.length !== 0) {
      groups.removeAt(0)
    }
  }

  onSelectAllUsers(users: any) {
    users.forEach((user: { id: any; name: string | undefined; }) => {
      this.onUserSelect(user)
    });
  }

  //#endregion


  //#region User Permission Group [Form Array]

  addUserPermissionGroup(data: any = null) {
    this.userPermissionGroups().push(this.newUserPermissionGroup(data))
  }

  removeUserPermissionGroup(i: number) {
    this.userPermissionGroups().removeAt(i);
  }

  userPermissionGroups(): FormArray {
    return (this.permissionGroupForm.get('userPermissionGroups') as FormArray)
  }

  userPermissionGroupFormGroups(): FormGroup[] {
    return (this.permissionGroupForm.get('userPermissionGroups') as FormArray).controls as FormGroup[]
  }

  newUserPermissionGroup(data: UserPermissionGroup): FormGroup {
    let user = this.allUsers.find(usr => usr.id == data.userId)
    return this.formBuilder.group({
      id: [data?.id || null, []],
      permissionGroupId: [data?.permissionGroupId || null, []],
      userId: [data?.userId || 0, []],
      userName: [user?.fullName || "-", []],
      unitName: [user?.organizationUnit?.name || "-", []]
    })
  }

  //#endregion


  //#region Private Functions

  private initModal() { this.permissionGroup = this.modal?.data || this.permissionGroup }

  private addPermissionGroup() {
    this.permissionGroupsService.add(this.permissionGroup).subscribe({
      error: () => {
        this.permissionGroupsService.errorToaster("Faild to save")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.permissionGroupAddedEvent.emit(this.permissionGroup)
        this.permissionGroupsService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updatePermissionGroup() {
    this.permissionGroupsService.update(this.permissionGroup).subscribe({
      error: () => {
        this.permissionGroupsService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.permissionGroupUpdatedEvent.emit(this.permissionGroup)
        this.permissionGroupsService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private copyPermissionGroup() {
    this.permissionGroup.id = undefined
    this.permissionGroup.userPermissionGroups?.map(p => p.id = undefined)
    this.permissionGroupsService.add(this.permissionGroup).subscribe({
      error: () => {
        this.permissionGroupsService.errorToaster("Faild to copy")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.permissionGroupUpdatedEvent.emit(this.permissionGroup)
        this.permissionGroupsService.successToaster("copied successfully")
        this.close()
      }
    })
  }

  private async initUsers() {
    let result = this.permissionGroupsService.getAllUsers().pipe(takeUntil(this.destroy$))
    this.allUsers = await lastValueFrom(result) as User[]
    this.allUsers.map(usr => usr.fullName = `${usr.firstName} ${usr.lastName}`)
  }

  private initForm() {
    let users: User[] = []

    this.permissionGroup?.userPermissionGroups?.forEach(group => {
      users.push(this.allUsers.find(t => t.id == group.userId) as User)
    })

    this.permissionGroupForm.controls['name'].setValue(this.permissionGroup.name || null)
    this.permissionGroupForm.controls['code'].setValue(this.permissionGroup.code || null)

    let selectedUsers = users
    this.permissionGroupForm.controls['selectedUsers'].setValue(selectedUsers)

    selectedUsers?.forEach((element: any) => {
      this.onUserSelect(element)
    });
  }

  private getGroupIndex(permissionGroupId: number): any {
    let groups = this.userPermissionGroupFormGroups()
    var value = null;

    groups.forEach((group, index) => {
      Object.keys(group.controls).forEach(key => {
        if (key == 'permissionGroupId' && group.controls['permissionGroupId'].value == permissionGroupId)
          value = index
      });
    });

    return value
  }

  private prepareAddUpdateModel() {
    let userPermissionGroups = this.userPermissionGroups().controls.map(element => {
      return element.value
    });

    this.permissionGroup = new PermissionGroup({
      id: this.permissionGroup.id,
      name: this.permissionGroupForm.value.name,
      code: this.permissionGroupForm.value.code,
      isEnabled: true,
      userPermissionGroups: userPermissionGroups
    })
  }

  private disableForm() { if (this.view) this.permissionGroupForm.disable() }

  //#endregion

}
