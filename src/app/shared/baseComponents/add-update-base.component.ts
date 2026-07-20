import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionType } from 'src/app/shared/enums/action-type';
import { DestroyBaseComponent } from './destroy-base.component';

@Component({
  selector: 'app-add-update-base',
  template: '',
})
export abstract class AddUpdateBaseComponent
  extends DestroyBaseComponent
  implements OnInit, OnDestroy
{
  //#region Variables

  @Input() public modal: any;

  public submitted: boolean = false;
  public view: boolean = false;
  public actionType: ActionType | undefined;

  addUpdateState: number = 0;
  numberPattern = '^[0-9]*$';

  translatedActionType: string | undefined;

  dropdownSettings = {
    idField: 'id',
    textField: 'name',
    noDataAvailablePlaceholderText: 'There is no item available to show',
    allowSearchFilter: true,
    singleSelection: false,
  };

  singleDropdownSettings = {
    idField: 'id',
    textField: 'name',
    noDataAvailablePlaceholderText: 'There is no item available to show',
    allowSearchFilter: true,
    singleSelection: true,
    itemsShowLimit: 5,
    closeDropDownOnSelection: true
  };

  //#endregion

  //#region Constructor

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.determineActionType();
    this.translateActionType();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.close()
    this.onReset();
  }

  //#endregion

  //#region Events

  onSubmit() {
    this.submitted = true;
  }

  save() {
    switch (this.actionType) {
      case ActionType.Add:
        this.add();
        break;

      case ActionType.SemiUpdate:
      case ActionType.Update:
        this.update();
        break;

      case ActionType.Copy:
        this.copy();
        break;

      case ActionType.View:
        break;

      default:
        break;
    }
  }

  abstract add(): any;

  abstract update(): any;

  abstract copy(): any;

  //#endregion

  close() {
    this.modal.modalReference.close();
  }

  determineActionType() {
    this.actionType = this.modal?.actionType;
    if (this.actionType == ActionType.View) this.view = true;
  }

  onReset() {
    this.submitted = false;
  }

  private translateActionType() {
    switch (this.actionType) {
      case ActionType.Add:
        this.translatedActionType = 'Common.Add';
        break;

      case ActionType.Copy:
        this.translatedActionType = 'Common.Copy';
        break;

      case ActionType.Update:
        this.translatedActionType = 'Common.Update';
        break;

      case ActionType.View:
        this.translatedActionType = 'Common.View';
        break;

      case ActionType.Review:
        this.translatedActionType = 'Common.Review';
        break;

      default:
        break;
    }
  }
}
