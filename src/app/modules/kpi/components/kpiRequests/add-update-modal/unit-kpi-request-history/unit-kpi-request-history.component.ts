import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { UnitKPIRequestHistory } from 'src/app/modules/kpi/entities/classes/unit-kpi-request-history';
import { UnitKPIRequestService } from 'src/app/modules/kpi/services/unit-kpi-requests.service';
import { DestroyBaseComponent } from 'src/app/shared/baseComponents/destroy-base.component';
import { isNullOrUndefined } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-unit-kpi-request-history',
  templateUrl: './unit-kpi-request-history.component.html',
  styleUrls: ['./unit-kpi-request-history.component.css']
})
export class UnitKPIRequestHistoryComponent extends DestroyBaseComponent implements OnInit, OnDestroy {

  //#region  Variables

  @Input() public requestId: number | undefined = 0

  requestHistoryList: UnitKPIRequestHistory[] = []

  //#endregion


  //#region Constructor

  constructor(private unitKPIRequestService: UnitKPIRequestService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit()
    this.getHistory()
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy()
  }

  //#endregion


  //#region Private

  private getHistory() {
    if (!isNullOrUndefined(this.requestId))
      this.unitKPIRequestService.getHistroyByRequestId(this.requestId as number).pipe(takeUntil(this.destroy$)).subscribe(result => {
        this.requestHistoryList = result
      });
  }

  //#endregion

}
