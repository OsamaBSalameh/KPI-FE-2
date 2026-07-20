import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { Unit } from "src/app/modules/administration/components/entities/unit";
import { Objective } from "src/app/modules/design/entities/classes/objective";
import { KPICopyTag } from "src/app/shared/entities/kpi-copies-tags";
import { MeasurmentUnit } from "src/app/shared/entities/MeasurmentUnit";
import { DataCustodianUser } from "src/app/shared/entities/users/data-custadion-user";
import { DataSponserUser } from "src/app/shared/entities/users/data-sponser-user";
import { KPI } from "./kpi";

export class KPICopy extends BaseEntity<KPICopy> {
  name: string | undefined

  code: number | undefined

  description: string | undefined

  valueSense: boolean | undefined

  valueLowerLimit: number | undefined

  valueHigherLimit: number | undefined

  dataCustodianId: number | undefined
  dataCustodian: DataCustodianUser | undefined

  dataSponsorId: number | undefined
  dataSponsor: DataSponserUser | undefined

  objectiveId: number | undefined
  objective: Objective | undefined

  kpiCopyTags: KPICopyTag[] | undefined

  kpiTemplateId: number | undefined
  kpiTemplate: KPI | undefined

  measurmentUnitId: number | undefined
  measurmentUnit: MeasurmentUnit | undefined

  departmentId: number | undefined
  department: Unit | undefined
  
  constructor(model?: Partial<KPICopy>) {
    super(model);
  }
}
