import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { User } from 'src/app/shared/entities/users/user';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css']
})
export class BasicInformationComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  user: User = new User()

  //#endregion


  //#region Constructor

  constructor() { super() }

  override ngOnInit(): void {
  }

  //#endregion


  //#region Events

  add() { }
  update() { }
  copy() { }

  //#endregion


  //#region Private

  //#endregion

}
