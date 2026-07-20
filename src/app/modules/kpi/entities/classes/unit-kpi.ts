import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { UnitKPIStatus } from 'src/app/shared/entities/statuses/unit-kpi-status';
import { KPICopy } from './kpi-copy';
import { UnitKPIRequest } from './unit-kpi-request';
import { ReportingCategory } from '../enums/value-sense-enum';
import { UnitKPIValue } from './unit-kpi-value';

export class UnitKPI extends BaseEntity<UnitKPI> {
  // KPI Owner Part
  target: number | undefined;
  achievementDate: Date | undefined;
  attachment_KPIOwner: any | undefined;
  weight: number | undefined;
  isAchieved: boolean | undefined;

  // Data Custadion Part
  reportingCategory: ReportingCategory | undefined;
  values: UnitKPIValue[] | undefined;
  attachment_DataCustadion: any | undefined;

  // Shared Part
  comments: Comment[] | undefined;
  status: UnitKPIStatus | undefined;
  currentRound: number | undefined;

  unitKPIRequestId: number | undefined;

  kpiCopyId: number | undefined;
  kpiCopy: KPICopy | undefined;

  unitKPIRequest: UnitKPIRequest | undefined;
  ownerName: string | undefined;

  constructor(model?: Partial<UnitKPI>) {
    super(model);
  }
}
