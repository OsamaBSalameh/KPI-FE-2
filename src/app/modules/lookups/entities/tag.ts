import { BaseEntity } from "src/app/core/base-entity/base-entity";

export class Tag extends BaseEntity<Tag> {
  name: string | undefined

  constructor(model?: Partial<Tag>) {
    super(model);
  }
}
