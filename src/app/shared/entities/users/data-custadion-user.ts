import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "./user";

export class DataCustodianUser extends BaseEntity<DataCustodianUser> {

  userId: number | undefined
  user: User | undefined
  fullName: string | undefined

  constructor(model?: Partial<DataCustodianUser>) {
    super(model);

    this.fullName = `${this.user?.firstName} ${this.user?.lastName}`
  }
}
