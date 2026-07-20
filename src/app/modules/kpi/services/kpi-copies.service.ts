import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/core/base-service/base-service';
import { PaginationItem } from 'src/app/shared/entities/pagination/pagination-item';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { isNullOrUndefined, isNullOrUndefinedOrWhiteSpace } from 'src/app/shared/tools/base-tools';
import { KPICopy } from '../entities/classes/kpi-copy';

@Injectable({
  providedIn: 'root'
})
export class KPICopiesService extends BaseService<KPICopy> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    super(http, toaster);

    this.apiUrl = this.apiUrl + 'KPICopies'
  }

  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion


  //#region Custom

  public getKPICopiesPaginated(data: PaginationItem, departmentId: number | null) {
    let params = new HttpParams()
      .set("SearchValue", data.searchValue.toString())
      .set("PageNumber", data.pageNumber.toString())
      .set("DepartmentId", (!isNullOrUndefined(departmentId) ? departmentId?.toString() as string : ''))
      .set("PageSize", data.pageSize.toString());

    return this.http
      .get(`${this.apiUrl}/GetAllPaginated`, { headers: this.httpOptions, params });
  }

  public getCopyByTemplate(templateId: number): Observable<KPICopy> {
    return this.http
      .get<KPICopy>(`${this.apiUrl}/GetCopyByTemplate/${templateId}`, { headers: this.httpOptions });
  }

  //#endregion


  //#region Shared

  public getTags() {
    return this.sharedService.getTags()
  }

  public getDataCustadionUsers() {
    return this.userService.getDataCustadionUsers()
  }

  public getDataSponserUsers() {
    return this.userService.getDataSponserUsers()
  }

  //#endregion


  //#region  Measurment Unit

  public getMeasurmentUnits() {
    return this.sharedService.getMeasurmentUnits()
  }

  //#endregion

}
