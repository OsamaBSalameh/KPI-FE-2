import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Strategy } from 'src/app/modules/design/entities/classes/strategy';
import { User } from 'src/app/shared/entities/users/user';
import { ActionType } from 'src/app/shared/enums/action-type';
import { CustomValidator } from 'src/app/shared/tools/base-tools';
import { UnitKPIRequestService } from '../../../../services/unit-kpi-requests.service';

@Component({
  selector: 'app-add-unit-kpi-request',
  templateUrl: './add-unit-kpi-request.component.html',
  styleUrls: ['./add-unit-kpi-request.component.css']
})
export class AddUnitKPIRequestComponent implements OnInit, OnDestroy {

  //#region Variables

  @Input() public addModal: FormGroup = this.formBuilder.group({
    strategy: [0, [Validators.required, Validators.min(1)]],
    owner: [0, [Validators.required, Validators.min(1)]],
    responseDueDate: [
      null, [Validators.required, CustomValidator.lessThan("responseDueDate")]
    ],
    escalationDate: [
      null, [Validators.required, CustomValidator.greaterThan("escalationDate")]
    ],
    organizationUnitId: [0, []],
    selectedKPIs: [null, []],
    unitKPIsFormArray: this.formBuilder.array([])
  })

  @Input() public submitted: boolean = false
  @Input() public actionType: ActionType = ActionType.Update

  get formFileds() { return this.addModal.controls }

  strategies: Strategy[] = []
  kpiOwners: User[] = []
  selectedOwner: User = new User({})

  view: boolean = false

  //#endregion


  //#region Constructor

  constructor(
    private unitKPIRequestService: UnitKPIRequestService,
    private formBuilder: FormBuilder
  ) { }

  ngOnDestroy(): void { }

  async ngOnInit(): Promise<void> {
    await this.initStrategies()
    await this.initKPIOwners()

    this.initForm()
    this.disableForm()
  }

  //#endregion


  //#region Events

  onOwnerSelect(owner: any) {
    this.selectedOwner = this.kpiOwners.find(d => d.id == owner.value) as User
    this.addModal.controls['organizationUnitId'].setValue(this.kpiOwners.find(d => d.id == owner.value)?.organizationUnitId)
  }

  //#endregion


  //#region Private Functions

  private async initStrategies() {
    let result = this.actionType != ActionType.Add ? this.unitKPIRequestService.getAllStrategies().pipe() : this.unitKPIRequestService.getAllByWorkSpace().pipe()
    let strategies = await lastValueFrom(result) as Strategy[]
    this.strategies = strategies
  }

  private async initKPIOwners() {
    let result = this.unitKPIRequestService.getAllKPIOwners().pipe()
    let owners = await lastValueFrom(result) as User[]
    this.kpiOwners = owners
  }

  private initForm() {
    if (this.addModal.value.owner != null || this.addModal.value.owner != 0)
      this.onOwnerSelect({ value: this.addModal.value.owner })
  }

  private disableForm() {
    this.view = this.actionType != ActionType.Add
    if (this.view) this.addModal?.disable()
  }

  //#endregion

}