import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { User } from 'src/app/shared/entities/users/user';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class UserService
  extends BaseService<User>
  implements OnInit, OnDestroy
{
  //#region Constructor

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'Users';
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  //#endregion

  //#region Custom

  public getCurrentUserInfo() {
    return this.http.get(`${this.apiUrl}/CurrentUserInfo`, {
      headers: this.httpOptions,
    });
  }
  
  public getDataCustadionUsers() {
    return this.http.get(`${this.apiUrl}/GetAllCustadionUsers`, {
      headers: this.httpOptions,
    });
  }

  public getDataSponserUsers() {
    return this.http.get(`${this.apiUrl}/GetAllSponserUsers`, {
      headers: this.httpOptions,
    });
  }

  public getAllKPIOwners() {
    return this.http.get(`${this.apiUrl}/GetAllKPIOwners`, {
      headers: this.httpOptions,
    });
  }

  public searchActiveDirectoryUser(username: string) {
    return this.http.get(`${this.apiUrl}/AD/Search/${username}`, {
      headers: this.httpOptions,
    });
  }

  public getAllADUsers() {
    return this.http.get(`${this.apiUrl}/AD/user/all`, {
      headers: this.httpOptions,
    });
  }

  public getUserThumbnailPhoto(username: string) {
    return this.http.get(`${this.apiUrl}/AD/thumbnailphoto/${username}`, {
      headers: this.httpOptions,
    });
  }

  getDelegatedFromUsers() {
    return this.http.get(`${this.apiUrl}/GetDelegatedFromUsers`, { headers: this.httpOptions,});
  }

  //#endregion

  //#region  Shared

  public getPermissionGroups() {
    return this.sharedService.getPermissionGroups();
  }

  public getPermissionGroupsByUser(userId: number) {
    return this.sharedService.getPermissionGroupByUser(userId);
  }

  public getAllowedPermissionsForDelegation(userId: number) {
    return this.sharedService.getAllowedPermissionsForDelegation(userId);
  }

  public getUnits() {
    return this.sharedService.getUnits();
  }

  //#endregion
}
