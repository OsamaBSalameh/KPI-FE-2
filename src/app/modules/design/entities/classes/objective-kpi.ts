import { BaseEntity } from "src/app/core/base-entity/base-entity";

export class ObjectiveKPI extends BaseEntity<ObjectiveKPI> {
  objectiveId: number | undefined

  kpiId: number | undefined

  weight: number | undefined

  constructor(model?: Partial<ObjectiveKPI>) {
    super(model);
  }
}
