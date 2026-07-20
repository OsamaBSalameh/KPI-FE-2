import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom, takeUntil } from 'rxjs';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { User } from 'src/app/shared/entities/users/user';
import { WorkSpace } from '../../entities/work-space';
import { WorkSpaceService } from '../../services/work-space.service';
import { Unit } from 'src/app/modules/administration/components/entities/unit';

@Component({
  selector: 'app-add-update-work-space',
  templateUrl: './add-update-work-space.component.html',
  styleUrls: ['./add-update-work-space.component.css']
})
export class AddUpdateWorkSpaceComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {
  //#region Variables

  @Output() workSpaceAddedEvent = new EventEmitter<any>();
  @Output() workSpaceUpdatedEvent = new EventEmitter<any>();

  workSpace: WorkSpace = new WorkSpace({
    name: undefined,
    id: undefined,
    isEnabled: true
  });

  allUsers: User[] = []
  allUnits: Unit[] = []
  selectedDepartmentUsers: User[] = []

  workSpaceForm = this.formBuilder.group({
    name: [this.workSpace.name || null, [Validators.required, Validators.maxLength(100)]],

    logo_SVG: [this.workSpace.logo_SVG || null],
    logo_Name: [this.workSpace.logo_Name || null],
    logo_Description: [this.workSpace.logo_Description || null],

    adminList: [this.workSpace.adminList || null],
    departmentId: [this.workSpace.departmentId || null, [Validators.required]],

    selectedUsers: [[], []],
  });
  get formFileds() { return this.workSpaceForm.controls }
  //#endregion


  //#region Constructor
  constructor(
    private workSpacesService: WorkSpaceService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  override ngOnDestroy(): void { super.ngOnDestroy() }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit()
    this.initModal()

    await this.initUnits()
    await this.initUsers()

    this.initForm()
    this.determineActionType()

    this.disableForm()
  }
  //#endregion


  //#region Events
  override onSubmit() {
    super.onSubmit()

    if (this.workSpaceForm.invalid) return

    this.prepareAddUpdateModel()
    this.save();
  }

  override save() { super.save() }

  add() { this.addWorkSpace() }

  update() { this.updateUnit() }

  copy() { throw new Error('Method not implemented.'); }
  //#endregion


  //#region Selection
  onUserSelect(user: any) {
    this.workSpace.adminList?.push(this.allUsers.find(usr => usr.id == user.id) as User)
  }

  onDeSelectUser(usr: any) {
    let index = this.workSpace.adminList?.indexOf(usr) as number
    this.workSpace.adminList?.splice(index, 1)
  }

  onDeSelectAll() {
    this.workSpace.adminList = [];
  }

  onSelectAllUsers(usrs: any) {
    usrs.forEach((usr: { id: any; name: string | undefined; }) => {
      this.onUserSelect(usr)
    });
  }

  departmentChange(){
    this.workSpaceForm.controls['selectedUsers'].setValue([])
    let selectedDepartmentId = this.workSpaceForm.value.departmentId
    this.selectedDepartmentUsers = this.allUsers.filter(usr => usr.organizationUnitId == selectedDepartmentId);
  }
  //#endregion


  //#region Unit User [Form Array]
  // addUnitUser(data: any = null) { this.unitUsers().push(this.newUnitUser(data)) }

  // removeUnitUser(i: number) { this.unitUsers().removeAt(i) }

  // unitUsers(): FormArray {return (this.unitForm.get('users') as FormArray)}

  // unitUsersFormGroups(): FormGroup[] {return (this.unitForm.get('users') as FormArray).controls as FormGroup[]}

  // newUnitUser(data: User): FormGroup {
  //   return this.formBuilder.group({
  //     id: [data?.id || null, []],
  //     fullName: [`${data?.firstName} ${data?.lastName}` || null, []],
  //     email: [data.email, []],
  //     organizationUnitId: [data.organizationUnitId, []],
  //     // userPermissionGroupId: [data.userPermissionGroupId, []]
  //   })
  // }
  //#endregion


  //#region Private Functions

  private initModal() { this.workSpace = this.modal?.data || this.workSpace }

  private addWorkSpace() {
    this.workSpaceAddedEvent.emit(this.workSpace)
    this.close()
  }

  private updateUnit() {
    this.workSpaceUpdatedEvent.emit(this.workSpace)
    this.close()
  }

  private async initUsers() {
    let result = this.workSpacesService.getAllUsers().pipe(takeUntil(this.destroy$))
    this.allUsers = await lastValueFrom(result) as User[]
    this.allUsers.map(usr => usr.name = `${usr.firstName} ${usr.lastName}`)
  }

  private async initUnits() {
    let result = this.workSpacesService.getUnits().pipe(takeUntil(this.destroy$));
    this.allUnits = (await lastValueFrom(result)) as Unit[];
  }

  private prepareAddUpdateModel() {
    let adminList = this.workSpaceForm.value.selectedUsers

    this.workSpace = new WorkSpace({
      id: this.workSpace.id,
      name: this.workSpaceForm.value.name,
      departmentId: this.workSpaceForm.value.departmentId,

      logo_SVG: this.workSpaceForm.value.logo_SVG,
      logo_Name: this.workSpaceForm.value.logo_Name,
      logo_Description: this.workSpaceForm.value.logo_Description,

      adminList: adminList
    })
  }

  private initForm() {
    let adminList: User[] = []
    this.workSpace?.adminList?.forEach(emp => {
      adminList.push(this.allUsers.find(t => t.id == emp.id) as User)
    });

    this.workSpaceForm.controls['name'].setValue(this.workSpace.name || null)
    this.workSpaceForm.controls['departmentId'].setValue(this.workSpace.departmentId || null)

    this.workSpaceForm.controls['logo_SVG'].setValue(this.workSpace.logo_SVG || null)
    this.workSpaceForm.controls['logo_Name'].setValue(this.workSpace.logo_Name || null)
    this.workSpaceForm.controls['logo_Description'].setValue(this.workSpace.logo_Description || null)

    let selectedUsers = this.allUsers.filter(usr => this.workSpace?.adminList?.map(usr => usr.id).includes(usr.id))
    this.workSpaceForm.controls['selectedUsers'].setValue(selectedUsers)

    this.workSpaceForm.controls['adminList'].setValue(adminList)

    this.selectedDepartmentUsers = this.selectedDepartmentUsers = this.allUsers.filter(usr => usr.organizationUnitId == this.workSpace.departmentId);
  }

  private disableForm() {
    if (this.view) this.workSpaceForm.disable()
  }
  //#endregion

}
