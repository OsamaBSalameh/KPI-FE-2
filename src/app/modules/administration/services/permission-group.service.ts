import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PermissionGroup } from '../components/entities/permissionGroup';

@Injectable()
export class PermissionGroupsService extends BaseService<PermissionGroup> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'PermissionGroups'
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
