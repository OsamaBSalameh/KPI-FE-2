import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionGroup } from '../components/entities/user-permission-group';

@Injectable()
export class UserPermissionGroupsService extends BaseService<UserPermissionGroup> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'UserPermissionGroups'
  }

  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion


  //#region  shared

  public getAllUsers() {
    return this.userService.get()
  }

  //#endregion

}
