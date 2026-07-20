import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { Data } from "src/app/modules/administration/components/entities/data";
import { Objective } from "src/app/modules/design/entities/classes/objective";
import { KPITag } from "src/app/shared/entities/kpis-tags";
import { MeasurmentUnit } from "src/app/shared/entities/MeasurmentUnit";
import { DataCustodianUser } from "src/app/shared/entities/users/data-custadion-user";
import { DataSponserUser } from "src/app/shared/entities/users/data-sponser-user";

export class KPI extends BaseEntity<KPI> {
  name: string | undefined

  // code: number | undefined

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


  kpiTags: KPITag[] | undefined

  // kpiDataId: number | undefined
  // kpiData: Data | undefined

  measurmentUnitId: number | undefined
  measurmentUnit: MeasurmentUnit | undefined
  
  constructor(model?: Partial<KPI>) {
    super(model);
  }
}
