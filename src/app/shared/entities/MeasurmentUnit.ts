import { BaseEntity } from "src/app/core/base-entity/base-entity";

export class MeasurmentUnit extends BaseEntity<MeasurmentUnit> {
  name: string | undefined
  value: string | undefined

  constructor(model?: Partial<MeasurmentUnit>) {
    super(model);
  }
}
