import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { UnitKPIStatusEnum } from "../../enums/unit-kpi-status";

export class UnitKPIStatus extends BaseEntity<UnitKPIStatus> {

    value: string | undefined

    code: UnitKPIStatusEnum | undefined

    constructor(model?: Partial<UnitKPIStatus>) {
        super(model);
    }
}
