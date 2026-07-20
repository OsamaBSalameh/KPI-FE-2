import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { KPI } from '../entities/classes/kpi';

@Injectable({
  providedIn: 'root'
})
export class KPIsService extends BaseService<KPI> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    super(http, toaster);

    this.apiUrl = this.apiUrl + 'KPIs'
  }

  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion


  //#region Custom

  public getAllEagerly() {
    return this.http
      .get(`${this.apiUrl}/GetAllEagerly`, { headers: this.httpOptions })
  }

  public getAllTemplateNames(requestId: number) {
    return this.http
      .get(`${this.apiUrl}/GetAllTemplateNames/${requestId}`, { headers: this.httpOptions })
  }

  //#endregion


  //#region Shared

  public getTags() {
    return this.sharedService.getTags()
  }

  public getKPIData() {
    return this.sharedService.getKPIData()
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
