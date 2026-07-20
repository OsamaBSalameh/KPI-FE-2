import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { BaseService } from 'src/app/core/base-service/base-service';
import { PaginationItem } from 'src/app/shared/entities/pagination/pagination-item';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UnitKPI } from '../entities/classes/unit-kpi';
import { UnitKPIRequest } from '../entities/classes/unit-kpi-request';
import { UnitKPIRequestHistory } from '../entities/classes/unit-kpi-request-history';

@Injectable({
  providedIn: 'root',
})
export class UnitKPIRequestService
  extends BaseService<UnitKPIRequest>
  implements OnInit, OnDestroy
{
  //#region Constructor

  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    super(http, toaster);

    this.apiUrl = this.apiUrl + 'UnitKPIRequests';
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  override getValuesPaginated(
    data: PaginationItem
  ): Observable<UnitKPIRequest[]> {
    let params = new HttpParams()
      .set('SearchValue', data.searchValue.toString())
      .set('strategyId', data.strategyId.toString())
      .set('PageNumber', data.pageNumber.toString())
      .set('PageSize', data.pageSize.toString());

    return this.http
      .get<UnitKPIRequest[]>(`${this.apiUrl}/GetAllPaginated`, {
        headers: this.httpOptions,
        params,
      })
      .pipe(map((result: any) => result));
  }

  //#endregion

  //#region Shared

  public getAllStrategies() {
    return this.sharedService.getAllStrategies();
  }

  public getAllByWorkSpace() {
    return this.sharedService.getAllByWorkSpace();
  }
  
  public getAllKPIOwners() {
    return this.userService.getAllKPIOwners();
  }

  public getUnits() {
    return this.sharedService.getUnits();
  }

  //#endregion

  //#region Accept And Reject

  public acceptViaWorkSpaceAdmin(id: number) {
    return this.http.post(`${this.apiUrl}/AcceptViaWorkSpaceAdmin/${id}`, {
      headers: this.httpOptions,
    });
  }

  public rejectViaWorkSpaceAdmin(data: {
    requestId: number, returnReason:string
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/RejectViaWorkSpaceAdmin`,
      data
    );
  }

  public acceptViaCEO(id: number) {
    return this.http.post(`${this.apiUrl}/AcceptViaCEO/${id}`, {
      headers: this.httpOptions,
    });
  }

  public rejectViaCEO(data: {
    requestId: number, returnReason:string
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/RejectViaCEO`,
      data
    );
  }

  public acceptKPIViaSponser(id: number) {
    return this.http.post(`${this.apiUrl}/AcceptKPIViaSPONSER/${id}`, {
      headers: this.httpOptions,
    });
  }

  public rejectKPIViaSponser(id: number) {
    return this.http.post(`${this.apiUrl}/RejectKPIViaSPONSER/${id}`, {
      headers: this.httpOptions,
    });
  }

  public approveViaOwner(id: number) {
    return this.http.post(`${this.apiUrl}/AcceptKPIViaOWNER/${id}`, {
      headers: this.httpOptions,
    });
  }

  public rejectKPIViaOwner(id: number) {
    return this.http.post(`${this.apiUrl}/RejectKPIViaOWNER/${id}`, {
      headers: this.httpOptions,
    });
  }

  public unitKPIAchieved(id: number) {
    return this.http.post(`${this.apiUrl}/UnitKPIAchieved/${id}`, {
      headers: this.httpOptions,
    });
  }

  //#endregion

  //#region Unit KPIs

  public deleteUnitKPI(id: number) {
    return this.http.delete(`${this.apiUrl}/DeleteUnitKPI/${id}`, {
      headers: this.httpOptions,
    });
  }

  public getUnitKPIsByRequest(requestId: number): Observable<UnitKPI[]> {
    return this.http
      .get<UnitKPI[]>(`${this.apiUrl}/GetUnitKPIsByRequest/${requestId}`, {
        headers: this.httpOptions,
      })
      .pipe(map((result) => result));
  }

  public unitKPIsForDataCustodian(data: {
    paignationRequest: PaginationItem;
    userId: number;
    unitKPIStatus: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/UnitKPIsForDataCustodian`,
      data
    );
  }

  public unitKPIsForDataSponser(data: {
    paignationRequest: PaginationItem;
    userId: number;
    unitKPIStatus: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/UnitKPIsForDataSponser`,
      data
    );
  }

  public unitKPIsForOwner(data: {
    paignationRequest: PaginationItem;
    userId: number;
    unitKPIStatus: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(`${this.apiUrl}/UnitKPIsForOwner`, data);
  }

  public unitKPIsForWorkSpaceAdmin(data: {
    paignationRequest: PaginationItem;
    organizationUnitId: number;
    unitKPIStatus: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(`${this.apiUrl}/UnitKPIsForWORK_SPACE_ADMIN`, data);
  }

  public viewUnitKPIsForOwner(data: {
    paignationRequest: PaginationItem;
    unitKPIStatus: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/ViewUnitKPIsForOwner`,
      data
    );
  }

  public viewPaginatedFilteredUnitKPIs(data: {
    paignationRequest: PaginationItem;
    organizationUnitId: number;
    unitKPIStatus: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/ViewPaginatedFilteredUnitKPIs`,
      data
    );
  }

  public achievedUnitKPIsForDataCustodian(data: {
    paignationRequest: PaginationItem;
    userId: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/AchievedUnitKPIsForDataCustodian`,
      data
    );
  }

  public achievedUnitKPIsForOwner(data: {
    paignationRequest: PaginationItem;
    userId: number;
  }): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/AchievedUnitKPIsForOwner`,
      data
    );
  }

  public reportUnitKPIViaCUSTODIAN(
    unitKPId: number,
    value: string
  ): Observable<UnitKPI[]> {
    return this.http.post<UnitKPI[]>(
      `${this.apiUrl}/ReportUnitKPIViaCUSTODIAN`,
      { unitKPId: unitKPId, value: value }
    );
  }

  public updateKPIValueVerificationStatus(data: {
    isVerified: boolean;
    valueId: number;
  }): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/UpdateKPIValueVerificationStatus`,
      data
    );
  }

  public draftSave(unitKPIRequest: UnitKPIRequest): Observable<UnitKPIRequest> {
    return this.http
      .put<UnitKPIRequest>(`${this.apiUrl}/DraftSave`, unitKPIRequest)
      .pipe(map((result) => result));
  }

  //#endregion

  //#region Unit KPI Request History

  public getHistroyByRequestId(
    requestId: number
  ): Observable<UnitKPIRequestHistory[]> {
    return this.http
      .get<UnitKPIRequestHistory[]>(
        `${this.apiUrl}/GetHistroyByRequestId/${requestId}`,
        { headers: this.httpOptions }
      )
      .pipe(map((result) => result));
  }

  //#endregion
}
