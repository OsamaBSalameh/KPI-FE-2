import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { WorkSpace } from '../entities/work-space';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class WorkSpaceService extends BaseService<WorkSpace> implements OnInit, OnDestroy {

  //#region Constructor
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'WorkSpace';
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title, { timeOut: 5000 });
  }
  //#endregion

  //#region Sheared
  public getUnits() {
    return this.sharedService.getUnits();
  }

    public getAllUsers() {
    return this.userService.get()
  }
  //#endregion

}
