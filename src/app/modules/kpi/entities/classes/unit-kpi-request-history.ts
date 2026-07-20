import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { UnitKPIRequestStatus } from "src/app/shared/entities/statuses/unit-kpi-request-status";
import { User } from "src/app/shared/entities/users/user";
import { UnitKPIRequest } from "./unit-kpi-request";

export class UnitKPIRequestHistory extends BaseEntity<UnitKPIRequestHistory> {

  message : string | undefined

  unitKPIRequestId: number | undefined
  unitKPIRequest: UnitKPIRequest | undefined

  unitKPIRequestStatusId: number | undefined
  status: UnitKPIRequestStatus | undefined

  actionBy: string |undefined

  constructor(model?: Partial<UnitKPIRequestHistory>) {
    super(model);
  }

}
