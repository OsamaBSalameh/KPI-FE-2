import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Data } from '../components/entities/data';

@Injectable()
export class DataService extends BaseService<Data> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'KPIData'
  }


  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion

  
  //#region  Measurment Unit

  public getMeasurmentUnits() {
    return this.sharedService.getMeasurmentUnits()
  }

  //#endregion

}
