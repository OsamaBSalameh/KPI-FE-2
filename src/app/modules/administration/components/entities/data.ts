import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { MeasurmentUnit } from "src/app/shared/entities/MeasurmentUnit";

export class                                                                                                                                            Data extends BaseEntity<Data> {
  name: string | undefined

  calculationGuide: string | undefined

  measurmentUnitId: number | undefined

  measurmentUnit: MeasurmentUnit | undefined

  constructor(model?: Partial<Data>) {
    super(model);
  }
}
