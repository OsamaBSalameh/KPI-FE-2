import { BaseEntity } from "src/app/core/base-entity/base-entity";

export class KPITag extends BaseEntity<KPITag> {
  kpiId: number | undefined
  tagId: number | undefined

  constructor(model?: Partial<KPITag>) {
    super(model);
  }
}
