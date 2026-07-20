import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Objective } from '../entities/classes/objective';

@Injectable()
export class ObjectivesService extends BaseService<Objective> implements OnInit, OnDestroy {

    //#region Constructor

    constructor(
      private http: HttpClient,
      private toaster: ToastrService,
      private sharedService: SharedService
    ) {
      super(http, toaster);
  
      this.apiUrl = this.apiUrl + 'Objectives'
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
