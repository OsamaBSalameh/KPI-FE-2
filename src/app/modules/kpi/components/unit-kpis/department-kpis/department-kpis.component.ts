import { Component, OnInit } from '@angular/core';
import { UnitKPIRequestService } from '../../../services/unit-kpi-requests.service';
import { enumToObject } from 'src/app/shared/tools/base-tools';
import { UnitKPIStatusEnum } from 'src/app/shared/enums/unit-kpi-status';
import { UnitKPI } from '../../../entities/classes/unit-kpi';
import { PaginationBaseComponent } from 'src/app/shared/baseComponents/pagination-base.component';
import * as XLSX from 'xlsx';
import { lastValueFrom, takeUntil } from 'rxjs';
import { PaginationItem } from 'src/app/shared/entities/pagination/pagination-item';
import { Strategy } from 'src/app/modules/design/entities/classes/strategy';
import { StrategiesService } from 'src/app/modules/design/services/strategies.service';
import { Unit } from 'src/app/modules/administration/components/entities/unit';

@Component({
  selector: 'app-department-kpis',
  templateUrl: './department-kpis.component.html',
  styleUrls: ['./department-kpis.component.css'],
})
export class DepartmentKPIsComponent
  extends PaginationBaseComponent
  implements OnInit {
  //#region Variables
  public selectedStatus: any = 0;
  unitKPIStatuses: any[] = [];
  valuesModal: any;
  unitKPIs: UnitKPI[] = [];
  allUnits: Unit[] = [];

  selectedUnit: any = 0;
  selectedStrategyId: number = 0;
  strategies: Strategy[] = [];
  //#endregion

  //#region Constructor
  constructor(
    private unitKPIRequestsService: UnitKPIRequestService,
    private strategiesService: StrategiesService
  ) {
    super();
  }

  override async ngOnInit(): Promise<void> {
    this.getAllStrategies();
    this.initUnitKPIStatusEnum();
    this.initUnits();
  }
  //#endregion

  //#region Actions
  onUnitKPIStatusSelect(data: any) {
    this.selectedStatus = data.value;
    this.preSearch();
    this.getPaginatedValues();
  }

  exportToExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'myExcel.xlsx');
  }

  getPaginatedValues(): void {
    let data: { paignationRequest: PaginationItem; organizationUnitId: number; unitKPIStatus: number } = {
      paignationRequest: this.paginationItem,
      organizationUnitId: this.selectedUnit,
      unitKPIStatus: Number.parseInt(this.selectedStatus || 0),
    };

    // this.viewUnitKPIsForOwner(data);
    this.viewPaginatedFilteredUnitKPIs(data);
  }

  onStrategySelected(data: any) {
    this.selectedStrategyId = parseInt(data.value);
    this.paginationItem.strategyId = parseInt(data.value);
    this.preSearch();
    this.getPaginatedValues();
  }

  onOrganizationSelect(data: any) {
    this.selectedUnit = data.value;
    this.preSearch();
    this.getPaginatedValues();
  }
  //#endregion

  //#region Data Initator
  public async viewUnitKPIsForOwner(data: {
    paignationRequest: PaginationItem;
    unitKPIStatus: number;
  }) {
    this.unitKPIRequestsService
      .viewUnitKPIsForOwner(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.unitKPIs = res.items as UnitKPI[];
      });
  }

  public async viewPaginatedFilteredUnitKPIs(data: {
    paignationRequest: PaginationItem;
    organizationUnitId: number;
    unitKPIStatus: number;
  }) {
    this.unitKPIRequestsService
      .viewPaginatedFilteredUnitKPIs(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        this.unitKPIs = res.items as UnitKPI[];
      });
  }

  /**
 * Determine CSS class for KPI type badge
 */
  getTypeClass(reportingCategory: number): string {
    return reportingCategory === 1 ? 'type-quarterly' : 'type-yearly';
  }

  /**
   * Determine CSS class for verification badge
   */
  getVerificationClass(isVerified: boolean): string {
    return isVerified ? 'verified' : 'unverified';
  }

  /**
   * Get verification icon class
   */
  getVerificationIcon(isVerified: boolean): string {
    return isVerified ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  }

  /**
   * Format number values for display
   */
  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  }

  /**
   * Get department badge class
   */
  getDepartmentClass(): string {
    return 'cell-badge cell-department';
  }
  //#endregion

  //#region Private Functions
  private initUnitKPIStatusEnum() {
    this.unitKPIStatuses = enumToObject(UnitKPIStatusEnum);
    this.unitKPIStatuses.forEach(
      (status) =>
      (status.value = status.name
        .split(/(?=[A-Z])/)
        .toString()
        .replaceAll(',', ' '))
    );
  }

  private getAllStrategies() {
    this.strategiesService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.strategies = res;
        let orderedStrategies = this.strategies.sort(
          (a, b) =>
            new Date(b.createdAt as Date).getTime() -
            new Date(a.createdAt as Date).getTime()
        );
        if (orderedStrategies[0] != null) {
          this.selectedStrategyId = orderedStrategies[0].id as number;
          this.paginationItem.strategyId = orderedStrategies[0].id as number;
          this.getPaginatedValues();
        }
      });
  }

  private async initUnits() {
    let result = this.unitKPIRequestsService
      .getUnits()
      .pipe(takeUntil(this.destroy$));
    this.allUnits = (await lastValueFrom(result)) as Unit[];
  }
  //#endregion
}

