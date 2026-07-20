import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { User } from 'src/app/shared/entities/users/user';
import { UnitsService } from '../../../services/unit.service';
import { Unit } from '../../entities/unit';
import { WorkSpace } from '../../../modules/work-space/entities/work-space';

@Component({
  selector: 'app-add-update-unit',
  templateUrl: './add-update-unit.component.html',
  styleUrls: ['./add-update-unit.component.css']
})
export class AddUpdateUnitComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  @Output() unitAddedEvent = new EventEmitter<any>();
  @Output() unitUpdatedEvent = new EventEmitter<any>();

  unit: Unit = new Unit({
    name: undefined,
    code: undefined,
    id: undefined,
    users: undefined,
    isEnabled: true
  });

  allUsers: User[] = []
  // allWorkSpaces : WorkSpace[] = []

  unitForm = this.formBuilder.group({
    name: [this.unit.name || null, [Validators.required, Validators.maxLength(100)]],
    code: [this.unit.code || null, [Validators.required, Validators.maxLength(100)]],
    selectedUsers: [[]],
    users: this.formBuilder.array([]),
    // workSpaceId: [this.unit.workSpaceId || null, [Validators.required]]
  });
  get formFileds() { return this.unitForm.controls }

  //#endregion


  //#region Constructor

  constructor(
    private unitsService: UnitsService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()

    await this.initUsers()
    // await this.initWorkSpaces()

    this.initForm()
    this.determineActionType()

    this.disableForm()
  }

  //#endregion


  //#region Events

  override onSubmit() {
    super.onSubmit()

    if (this.unitForm.invalid) return

    this.prepareAddUpdateModel()
    this.save();
  }

  override save() { super.save() }

  add() { this.addUnit() }

  update() { this.updateUnit() }

  copy() { this.copyUnit() }

  //#endregion


  //#region Selection

  onUserSelect(user: any) {
    this.addUnitUser(this.allUsers.find(usr => usr.id == user.id))
  }

  onDeSelectUser(usr: any) {
    let index = this.getGroupIndex(usr.id)
    this.removeUnitUser(index)
  }

  onDeSelectAll() {
    let groups = this.unitUsers()
    while (groups.length !== 0) {
      groups.removeAt(0)
    }
  }

  onSelectAllUsers(usrs: any) {
    usrs.forEach((usr: { id: any; name: string | undefined; }) => {
      this.onUserSelect(usr)
    });
  }

  //#endregion


  //#region Unit User [Form Array]

  addUnitUser(data: any = null) { this.unitUsers().push(this.newUnitUser(data)) }

  removeUnitUser(i: number) { this.unitUsers().removeAt(i) }

  unitUsers(): FormArray {return (this.unitForm.get('users') as FormArray)}

  unitUsersFormGroups(): FormGroup[] {return (this.unitForm.get('users') as FormArray).controls as FormGroup[]}

  newUnitUser(data: User): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null, []],
      fullName: [`${data?.firstName} ${data?.lastName}` || null, []],
      email: [data.email, []],
      organizationUnitId: [data.organizationUnitId, []],
      // userPermissionGroupId: [data.userPermissionGroupId, []]
    })
  }

  //#endregion


  //#region Private Functions

  private initModal() { this.unit = this.modal?.data || this.unit }

  private addUnit() {
    this.unitsService.add(this.unit).subscribe({
      error: () => {
        this.unitsService.errorToaster("Faild to save")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitAddedEvent.emit(this.unit)
        this.unitsService.successToaster("saved successfully")
        this.close()
      }
    })
  }

  private updateUnit() {
    this.unitsService.update(this.unit).subscribe({
      error: () => {
        this.unitsService.errorToaster("Faild to update")
        this.addUpdateState = 2
        this.close()
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitUpdatedEvent.emit(this.unit)
        this.unitsService.successToaster("updated successfully")
        this.close()
      }
    })
  }

  private copyUnit() {
    this.unit.id = undefined
    this.unitsService.add(this.unit).subscribe({
      error: () => {
        this.unitsService.errorToaster("Faild to copy")
        this.addUpdateState = 2
      },
      next: () => {
        this.addUpdateState = 1;
        this.unitUpdatedEvent.emit(this.unit)
        this.unitsService.successToaster("copied successfully")
        this.close()
      }
    })
  }

  private async initUsers() {
    let result = this.unitsService.getAllUsers().pipe(takeUntil(this.destroy$))
    this.allUsers = await lastValueFrom(result) as User[]
    this.allUsers.map(usr => usr.name = `${usr.firstName} ${usr.lastName}`)
  }

  // private async initWorkSpaces() {
  //   let result = this.unitsService.getWorkSpaces().pipe(takeUntil(this.destroy$))
  //   this.allWorkSpaces = await lastValueFrom(result) as WorkSpace[]
  // }

  private getGroupIndex(usrId: number): any {
    let groups = this.unitUsersFormGroups()
    var value = null;

    groups.forEach((group, index) => {
      Object.keys(group.controls).forEach(key => {
        if (key == 'id' && group.controls['id'].value == usrId)
          value = index
      });
    });

    return value
  }

  private prepareAddUpdateModel() {
    let users = this.unitUsers().controls.map(element => {
      return element.value
    });

    this.unit = new Unit({
      id: this.unit.id,
      name: this.unitForm.value.name,
      code: this.unitForm.value.code,
      users: users,
      // workSpaceId: this.unitForm.value.workSpaceId
    })
  }

  private initForm() {
    let users: User[] = []
    this.unit?.users?.forEach(emp => {
      users.push(this.allUsers.find(t => t.id == emp.id) as User)
    });

    this.unitForm.controls['name'].setValue(this.unit.name || null)
    this.unitForm.controls['code'].setValue(this.unit.code || null)

    let selectedUsers = this.allUsers.filter(usr => this.unit?.users?.map(usr => usr.id).includes(usr.id))
    this.unitForm.controls['selectedUsers'].setValue(selectedUsers)

    this.unit?.users?.forEach((element: any) => {
      this.addUnitUser(element)
    });
  }

  private disableForm() {
    if (this.view) this.unitForm.disable()
  }

  //#endregion

}
