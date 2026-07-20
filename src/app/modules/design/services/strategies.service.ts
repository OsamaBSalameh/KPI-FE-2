import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { Strategy } from '../entities/classes/strategy';

@Injectable({
  providedIn: 'root',
})
export class StrategiesService extends BaseService<Strategy> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {
    super(http, toaster);

    this.apiUrl = this.apiUrl + 'Strategies'
  }


  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  public getAllByWorkSpace() {
    return this.http
      .get(`${this.apiUrl}/GetAllByWorkSpace`, { headers: this.httpOptions })
  }
  //#endregion

}
