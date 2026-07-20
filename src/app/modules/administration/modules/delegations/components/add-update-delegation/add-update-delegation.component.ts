import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { Delegation } from '../../entities/delegation';
import { DelegationsService } from '../../services/delegations.service';
import { User } from 'src/app/shared/entities/users/user';
import { PermissionGroup } from 'src/app/modules/administration/components/entities/permissionGroup';
import { UserService } from 'src/app/shared/services/user.service';
import { lastValueFrom, takeUntil } from 'rxjs';
import {
  CustomValidator,
  fromDateToNgDate,
  fromNgDateToDate,
} from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-add-update-delegation',
  templateUrl: './add-update-delegation.component.html',
  styleUrls: ['./add-update-delegation.component.css'],
})
export class AddUpdateDelegationComponent
  extends AddUpdateBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  @Output() delegationAddedEvent = new EventEmitter<any>();
  @Output() delegationUpdatedEvent = new EventEmitter<any>();

  delegation: Delegation = new Delegation({});
  delegatedFromUsers: User[] = [];
  delegatedToUsers: User[] = [];

  allPermissionGroups: PermissionGroup[] = [];

  isDropdownDisabled: boolean = false;

  selectConfig: any = {
    displayFn: (item: any) => {
      return item.fullName;
    }, //a replacement ofr displayKey to support flexible text displaying for each item
    displayKey: 'fullName', //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Search and select a user', // text to be displayed when no item is selected defaults to Select,
    limitTo: 20, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'more...', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    //searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  };

  delegationForm = this.formBuilder.group({
    id: [this.delegation.delegatedFromId || 0, []],

    delegatedFromId: [
      this.delegation.delegatedFromId || 0,
      [Validators.required, Validators.min(1)],
    ],
    delegatedToId: [this.delegation.delegatedToId || 0, [Validators.min(1)]],
    permissionGroupId: [
      this.delegation.permissionGroupId || 0,
      [Validators.required, Validators.min(1)],
    ],
    startDate: [
      fromDateToNgDate(this.delegation?.startDate) || null,
      [Validators.required, CustomValidator.lessThan('endDate')],
    ],
    endDate: [
      fromDateToNgDate(this.delegation?.endDate) || null,
      [Validators.required, CustomValidator.greaterThan('startDate')],
    ],
  });

  get formFields() {
    return this.delegationForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private delegationsService: DelegationsService,
    private formBuilder: FormBuilder,
    private usersService: UserService
  ) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.initModal();

    await this.initDelegatedFromUsers();

    this.initForm();
    this.determineActionType();

    this.disableForm();
  }

  //#endregion

  //#region Events

  override onSubmit() {
    super.onSubmit();

    if (this.delegationForm.invalid) return;

    this.prepareData();
    this.save();
  }

  override save() {
    super.save();
  }

  add() {
    this.addDelegation();
  }

  update() {
    this.updateDelegation();
  }

  override copy() {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region Selection

  async onDelegatedFromSelected(delegatedFromId: any) {
    this.delegation.delegatedFrom = delegatedFromId.value;

    // get allowed permissions by using getAllowedPermissionsForDelegation
    let result = await this.initPermissionGroups(
      this.delegation.delegatedFrom?.id as number
    );

    this.allPermissionGroups = [];

    if (result.length == 0)
      this.delegationsService.showWarning(
        'The selected user has no permissions',
        'no permissions'
      );
    else this.allPermissionGroups = result;

    // Reset selected permission
    this.delegation.permissionGroup = undefined;
    this.delegationForm.patchValue({
      permissionGroupId: null,
    });

    // Initiate delegated to list
    this.initDelegatedToUsers();
  }

  onDelegatedToSelected(delegatedToId: any) {
    this.delegation.delegatedTo = this.delegatedToUsers.find(
      (d) => d.id == delegatedToId.value
    );
  }

  onPermissionSelected(permissionGroupId: any) {
    this.delegation.permissionGroup = this.allPermissionGroups.find(
      (d) => d.id == permissionGroupId.value
    );
  }

  onUserSearch(user: any) {}

  //#endregion

  //#region Prepare data

  private async initPermissionGroups(userId: number) {
    let result = this.usersService
      .getAllowedPermissionsForDelegation(userId)
      .pipe(takeUntil(this.destroy$));
    return (await lastValueFrom(result)) as PermissionGroup[];
  }

  private async initDelegatedFromUsers() {
    let result = this.delegationsService
      .getDelegatedFromUsers()
      .pipe(takeUntil(this.destroy$));
    let users = (await lastValueFrom(result)) as User[];

    users.map(
      (user) => (user.fullName = `${user?.firstName} ${user?.lastName}`)
    );
    this.delegatedFromUsers = users;
  }

  private async initDelegatedToUsers() {
    let result = this.delegatedFromUsers.filter(
      (usr) =>
        usr.organizationUnitId ==
        this.delegation.delegatedFrom?.organizationUnitId
    );
    this.delegatedToUsers = result;
  }

  //#endregion

  //#region Private Functions

  private initModal() {
    this.delegation = this.modal?.data || this.delegation;
  }

  private addDelegation() {
    this.delegationAddedEvent.emit(this.delegation);
    this.close();
  }

  private updateDelegation() {
    this.delegationUpdatedEvent.emit(this.delegation);
    this.close();
  }

  private async initForm() {
    this.initDelegatedToUsers();

    if (this.delegation.delegatedFrom != null) {
      let permissionGroups = await this.initPermissionGroups(
        this.delegation.delegatedFrom?.id as number
      );

      if (permissionGroups.length != 0)
        this.allPermissionGroups = permissionGroups;
    }

    this.delegationForm.controls['id'].setValue(this.delegation.id || null);
    this.delegationForm.controls['startDate'].setValue(
      fromDateToNgDate(this.delegation.startDate) || null
    );
    this.delegationForm.controls['endDate'].setValue(
      fromDateToNgDate(this.delegation.endDate) || null
    );

    this.delegationForm.controls['delegatedFromId'].setValue(
      this.delegation.delegatedFromId || 0
    );
    this.delegationForm.controls['delegatedToId'].setValue(
      this.delegation.delegatedToId || 0
    );
    this.delegationForm.controls['permissionGroupId'].setValue(
      this.delegation.permissionGroupId || 0
    );
  }

  private prepareData() {
    this.delegation = new Delegation({
      id: this.delegation.id,

      delegatedFromId: this.delegationForm.value.delegatedFromId.id,
      delegatedToId: this.delegationForm.value.delegatedToId.id,
      permissionGroupId: this.delegationForm.value.permissionGroupId,

      startDate: fromNgDateToDate(this.delegationForm.value.startDate),
      endDate: fromNgDateToDate(this.delegationForm.value.endDate),
    });
  }

  private disableForm() {
    if (this.view) {
      this.isDropdownDisabled = true;
      this.delegationForm.disable();
    }
  }

  //#endregion
}
