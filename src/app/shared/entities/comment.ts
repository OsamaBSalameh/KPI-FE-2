import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "./users/user";

export class Comment extends BaseEntity<Comment> {
  value: string | undefined

  autherId: number | undefined

  auther: User | undefined

  kpiCopyId: number | undefined
  UnitKPIRequestId: number | undefined

  constructor(model?: Partial<Comment>) {
    super(model);
    this.auther = new User(this.auther)
  }
}
