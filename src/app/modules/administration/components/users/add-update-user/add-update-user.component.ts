import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { User } from 'src/app/shared/entities/users/user';
import { ActionType } from 'src/app/shared/enums/action-type';
import { UserService } from 'src/app/shared/services/user.service';
import { PermissionGroup } from '../../entities/permissionGroup';
import { Unit } from '../../entities/unit';
import { UserPermissionGroup } from '../../entities/user-permission-group';
import { isNullOrUndefinedOrWhiteSpace } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.css'],
})
export class AddUpdateUserComponent
  extends AddUpdateBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  @Output() userAddedEvent = new EventEmitter<any>();
  @Output() userUpdatedEvent = new EventEmitter<any>();

  user: User = new User({
    fullName: undefined,
    id: undefined,
    isSystemUserEnabled: true,
  });

  updateActionType = ActionType.Update;

  allUnits: Unit[] = [];
  allPermissionGroups: PermissionGroup[] = [];
  searchByUserNameValue: string = '';
  adUsers: User[] = [];
  currentUserThumbNail: string = ''

  selectConfig: any = {
    displayFn: (item: any) => {
      return item.fullName;
    }, //a replacement ofr displayKey to support flexible text displaying for each item
    displayKey: 'fullName', //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Search and select a user', // text to be displayed when no item is selected defaults to Select,
    limitTo: 5, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'more...', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    //searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };

  userForm = this.formBuilder.group({
    firstName: [this.user.firstName || [Validators.required]],
    lastName: [this.user.lastName || [Validators.required]],
    userName: [this.user.userName || [Validators.required]],
    email: [this.user.email || [Validators.required]],
    isManager: [this.user.isManager || null, []],
    isSystemUserEnabled: [this.user.isSystemUserEnabled || null, []],
    organizationUnitId: [
      this.user.organizationUnitId || null,
      [Validators.required],
    ],

    selectedPermissions: [null, [Validators.required]],
    userPermissionGroups: this.formBuilder.array([]),
  });
  get formFileds() {
    return this.userForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private usersService: UserService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.initModal();

    await this.initPermissionGroups();
    await this.initUnits();

    this.initForm();
    this.determineActionType();
    if(this.actionType != this.updateActionType) this.initADUsers();
    this.disableForm();
  }

  //#endregion

  //#region Events

  override onSubmit() {
    super.onSubmit();

    if (this.userForm.invalid) return;

    this.prepareAddUpdateModel();
    this.save();
  }

  override save() {
    super.save();
  }

  add() {
    this.addUser();
  }

  update() {
    this.updateUser();
  }

  copy() {
    throw new Error('Method not implemented.');
  }

  // userProfilePictureEventHandler(files: any) {
  //   // let user = this._authService.getUserInfo() as User
  //   // user.profilePicturePath = ""
  //   // this._authService.setUserStorage(user)
  // }

  searchByUserName() {
    this.usersService
      .searchActiveDirectoryUser(this.searchByUserNameValue)
      .subscribe({
        error: () => {
          // empty user values
          this.user.firstName = '';
          this.user.lastName = '';
          this.user.email = '';
          this.user.organizationUnitId = undefined;
          this.user.userPermissionGroups = undefined;
          this.initForm();

          this.usersService.errorToaster(
            'There is no user with provided username'
          );
        },
        next: (result: any) => {
          this.user.firstName = result.firstName;
          this.user.lastName = result.lastName;
          this.user.email = result.email;

          this.userForm.controls['userName'].setValue(
            this.searchByUserNameValue
          );
          this.userForm.controls['firstName'].setValue(result.firstName);
          this.userForm.controls['lastName'].setValue(result.lastName);
          this.userForm.controls['email'].setValue(result.email);
        },
      });
  }

  //#endregion

  //#region Selection

  onPermissionGroupSelect(group: any) {
    let userPermissionGroup: UserPermissionGroup = new UserPermissionGroup({
      userId: undefined,
      permissionGroupId: group?.id,
      id: undefined,
      isEnabled: true,
    });

    this.addUserPermissionGroup(userPermissionGroup);
  }

  onDeSelectPermissionGroup(group: any) {
    let index = this.getGroupIndex(group.id);
    this.removeUserPermissionGroup(index);
  }

  onDeSelectAll() {
    let groups = this.userPermissionGroups();
    while (groups.length !== 0) {
      groups.removeAt(0);
    }
  }

  onSelectAllPermissionGroups(groups: any) {
    groups.forEach((group: { id: any; name: string | undefined }) => {
      this.onPermissionGroupSelect(group);
    });
  }

  initADUsers() {
    this.usersService.getAllADUsers().subscribe({
      error: () => {},
      next: (result: any) => {
        this.adUsers = result;
      },
    });
  }

  onUserSearch(user: any) {
  }

  onUserSelect(user: any) {
    if (!isNullOrUndefinedOrWhiteSpace(this.user.thumbnailPhoto))
      this.usersService.getUserThumbnailPhoto(user.value.username).subscribe({
        error: () => {},
        next: (result: any) => {
          this.user.thumbnailPhoto =
            result != null
              ? 'data:image/png;base64,' + result
              : this.user.profilePicturePath;

          this.currentUserThumbNail = this.user.thumbnailPhoto as string;
        },
      });

    this.user.firstName = user.value.firstName;
    this.user.lastName = user.value.lastName;
    this.user.email = user.value.email;
    this.user.userName = user.value.username;

    this.userForm.controls['userName'].setValue(user.value.username);
    this.userForm.controls['firstName'].setValue(user.value.firstName);
    this.userForm.controls['lastName'].setValue(user.value.lastName);
    this.userForm.controls['email'].setValue(user.value.email);
  }

  onDeSelectUser(user: any) {
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.email = '';
    this.user.organizationUnitId = undefined;
    this.user.userPermissionGroups = undefined;
    this.initForm();
  }
  //#endregion

  //#region User Permission Group [Form Array]

  addUserPermissionGroup(data: any = null) {
    this.userPermissionGroups().push(this.newUserPermissionGroup(data));
  }

  removeUserPermissionGroup(i: number) {
    this.userPermissionGroups().removeAt(i);
  }

  userPermissionGroups(): FormArray {
    return this.userForm.get('userPermissionGroups') as FormArray;
  }

  userPermissionGroupFormGroups(): FormGroup[] {
    return (this.userForm.get('userPermissionGroups') as FormArray)
      .controls as FormGroup[];
  }

  newUserPermissionGroup(data: UserPermissionGroup): FormGroup {
    let grp = this.allPermissionGroups.find((grp) => grp.id == data.userId);
    return this.formBuilder.group({
      id: [data?.id || null, []],
      permissionGroupId: [data?.permissionGroupId || null, []],
      userId: [data?.userId || 0, []],
      groupName: [grp?.name || '-', []],
    });
  }

  //#endregion

  //#region Private Functions

  private initModal() {
    this.user = this.modal?.data || this.user;
    this.currentUserThumbNail = this.user.thumbnailPhoto as string;
  }

  private addUser() {
    this.usersService.add(this.user).subscribe({
      error: () => {
        this.userAddedEvent.emit(null);
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.userAddedEvent.emit(this.user);
        this.usersService.successToaster('saved successfully');
        this.close();
      },
    });
  }

  private updateUser() {
    this.usersService.update(this.user).subscribe({
      error: () => {
        this.userUpdatedEvent.emit(this.user);
        this.addUpdateState = 2;
        this.close();
      },
      next: () => {
        this.addUpdateState = 1;
        this.userUpdatedEvent.emit(this.user);
        this.usersService.successToaster('updated successfully');
        this.close();
      },
    });
  }

  private async initUnits() {
    let result = this.usersService.getUnits().pipe(takeUntil(this.destroy$));
    this.allUnits = (await lastValueFrom(result)) as Unit[];
  }

  private async initPermissionGroups() {
    let result = this.usersService
      .getPermissionGroups()
      .pipe(takeUntil(this.destroy$));
    this.allPermissionGroups = (await lastValueFrom(
      result
    )) as PermissionGroup[];
  }

  private prepareAddUpdateModel() {
    let userPermissionGroups = this.userPermissionGroups().controls.map(
      (element) => {
        return element.value;
      }
    );

    this.user = new User({
      id: this.user.id,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      fullName: `${this.userForm.value.firstName} ${this.userForm.value.lastName}`,

      userName: this.userForm.value.userName,

      email: this.userForm.value.email,
      isManager: this.userForm.value.isManager,
      isSystemUserEnabled: this.userForm.value.isSystemUserEnabled,
      userPermissionGroups: userPermissionGroups,
      organizationUnitId: Number.parseInt(
        this.userForm.value.organizationUnitId
      ),
    });

    this.user.thumbnailPhoto = undefined;
  }

  private getGroupIndex(permissionGroupId: number): any {
    let groups = this.userPermissionGroupFormGroups();
    var value = null;

    groups.forEach((group, index) => {
      Object.keys(group.controls).forEach((key) => {
        if (
          key == 'permissionGroupId' &&
          group.controls['permissionGroupId'].value == permissionGroupId
        )
          value = index;
      });
    });

    return value;
  }

  private initForm() {
    let permissionGroups: PermissionGroup[] = [];
    this.user?.userPermissionGroups?.forEach((usr) => {
      let group = this.allPermissionGroups.find(
        (t) => t.id == usr.permissionGroupId
      ) as PermissionGroup;
      if (group != undefined || group != null) permissionGroups.push(group);
    });

    this.userForm.controls['firstName'].setValue(this.user.firstName || null);
    this.userForm.controls['lastName'].setValue(this.user.lastName || null);

    this.userForm.controls['userName'].setValue(this.user.userName || null);

    this.userForm.controls['email'].setValue(this.user.email || null);
    this.userForm.controls['isManager'].setValue(this.user.isManager || null);
    this.userForm.controls['isSystemUserEnabled'].setValue(
      this.user.isSystemUserEnabled || null
    );
    this.userForm.controls['organizationUnitId'].setValue(
      this.user.organizationUnitId || null
    );

    let selectedPermissions = permissionGroups;
    this.userForm.controls['selectedPermissions'].setValue(selectedPermissions);

    selectedPermissions?.forEach((element: any) => {
      this.onPermissionGroupSelect(element);
    });

    if (this.actionType == ActionType.Update)
      this.searchByUserNameValue = this.user.userName as string;
  }

  private disableForm() {
    if (this.view) this.userForm.disable();
  }

  //#endregion
}
