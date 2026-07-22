import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
// import { BaseService } from 'src/app/shared/baseComponents/service-base.service';
import { Prospective, Tag } from '../entities/lookups-entities';

@Injectable()
export class TagsService extends BaseService<Tag> implements OnInit, OnDestroy {

  //#region Constructor
  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'Tags'
  }


  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }
  //#endregion
}


@Injectable()
export class ProspectivesService extends BaseService<Prospective> implements OnInit, OnDestroy {

  //#region Constructor
  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'Prospectives'
  }


  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }
  //#endregion
}
