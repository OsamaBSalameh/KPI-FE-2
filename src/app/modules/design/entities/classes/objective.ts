import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { MeasurmentUnit } from "src/app/shared/entities/MeasurmentUnit";
import { ObjectiveKPI } from "./objective-kpi";

export class Objective extends BaseEntity<Objective> {
  name: string | undefined

  code: string | undefined

  target: number | undefined
  
  measurmentUnitId: number | undefined

  measurmentUnit: MeasurmentUnit | undefined

  objectiveKPIs: ObjectiveKPI[] | undefined

  constructor(model?: Partial<Objective>) {
    super(model);
  }
}
