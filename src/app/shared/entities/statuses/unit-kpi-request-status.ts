import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { UnitKPIRequestStatusEnum } from "../../enums/unit-kpi-request-status";

export class UnitKPIRequestStatus extends BaseEntity<UnitKPIRequestStatus> {

    value: string | undefined

    code: UnitKPIRequestStatusEnum | undefined

    constructor(model?: Partial<UnitKPIRequestStatus>) {
        super(model);
    }
}
