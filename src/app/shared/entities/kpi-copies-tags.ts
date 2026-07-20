import { BaseEntity } from "src/app/core/base-entity/base-entity";

export class KPICopyTag extends BaseEntity<KPICopyTag> {
  kpiCopyId: number | undefined
  tagId: number | undefined

  constructor(model?: Partial<KPICopyTag>) {
    super(model);
  }
}
