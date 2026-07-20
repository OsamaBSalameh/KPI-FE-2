import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Unit } from '../components/entities/unit';
import { WorkSpaceService } from '../modules/work-space/services/work-space.service';

@Injectable()
export class UnitsService extends BaseService<Unit> implements OnInit, OnDestroy {

  //#region Constructor
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private userService: UserService,
    private workSpaceService: WorkSpaceService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'Units'
  }

  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }
  //#endregion


  //#region  Measurment Unit
  public getMeasurmentUnits() {
    return this.sharedService.getMeasurmentUnits()
  }

  public getAllUsers() {
    return this.userService.get()
  }
  //#endregion

  //#region Work Space
  public getWorkSpaces(){
    return this.workSpaceService.get();
  }

  //#endregion

}
