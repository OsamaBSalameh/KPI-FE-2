import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { Objective } from '../entities/classes/objective';

@Injectable()
export class ScorecardsService extends BaseService<Objective> implements OnInit, OnDestroy {

    //#region Constructor

    constructor(
      private http: HttpClient,
      private toaster: ToastrService
    ) {
      super(http, toaster);
  
      this.apiUrl = this.apiUrl + 'Scorecards'
    }
  
  
    override ngOnInit(): void { super.ngOnInit() }
  
    override ngOnDestroy() { super.ngOnDestroy() }
  
    //#endregion

}
