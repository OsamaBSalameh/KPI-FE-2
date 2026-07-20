import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { Unit } from "src/app/modules/administration/components/entities/unit";
import { Strategy } from "src/app/modules/design/entities/classes/strategy";
import { UnitKPIRequestStatus } from "src/app/shared/entities/statuses/unit-kpi-request-status";
import { UnitKPI } from "./unit-kpi";

export class UnitKPIRequest extends BaseEntity<UnitKPIRequest> {

  responseDueDate: Date | undefined

  escalationDate: Date | undefined

  unitKPIs: UnitKPI[] | undefined

  unitKPIRequestStatusId: number | undefined
  status: UnitKPIRequestStatus | undefined

  strategyId: number | undefined
  strategy: Strategy | undefined

  organizationUnitId: number | undefined
  organizationUnit: Unit | undefined

  isDraft: boolean | undefined

  constructor(model?: Partial<UnitKPIRequest>) {
    super(model);
  }

}
