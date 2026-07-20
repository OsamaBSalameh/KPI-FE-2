import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Delegation } from '../entities/delegation';
import { BaseService } from 'src/app/core/base-service/base-service';
import { PaginationItem } from 'src/app/shared/entities/pagination/pagination-item';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DelegationsService
  extends BaseService<Delegation>
  implements OnInit, OnDestroy
{
  //#region Constructor

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'Delegations';
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  getValuesPaginatedByDepartment(
    data: PaginationItem,
    departmentId: number
  ): Observable<Delegation[]> {
    let params = new HttpParams()
      .set('OrganizationUnitId', departmentId.toString())
      .set('strategyId', data.strategyId.toString())
      .set('PageNumber', data.pageNumber.toString())
      .set('PageSize', data.pageSize.toString());

    return this.http
      .get<Delegation[]>(`${this.apiUrl}/GetAllPaginated`, {
        headers: this.httpOptions,
        params,
      })
      .pipe(map((result: any) => result));
  }

  stopDelegation(delegationId: number) {
    return this.http.get(`${this.apiUrl}/StopDelegation/${delegationId}`, {
      headers: this.httpOptions,
    });
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title, { timeOut: 5000 });
  }

  //#endregion

  //#region Sheared
  public getUnits() {
    return this.sharedService.getUnits();
  }

  getDelegatedFromUsers() {
    return this.userService.getDelegatedFromUsers();
  }

  getAllowedPermissionsForDelegation(delegatedFromId: number) {
    this.sharedService.getAllowedPermissionsForDelegation(delegatedFromId);
  }
  //#endregion
}
