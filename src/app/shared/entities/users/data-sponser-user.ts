import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "./user";

export class DataSponserUser extends BaseEntity<DataSponserUser> {

  userId: number | undefined
  user: User | undefined
  fullName: string | undefined

  constructor(model?: Partial<DataSponserUser>) {
    super(model);

    this.fullName = `${this.user?.firstName} ${this.user?.lastName}`
  }
}
