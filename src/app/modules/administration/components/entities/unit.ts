import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "src/app/shared/entities/users/user";

export class Unit extends BaseEntity<Unit> {

  name: string | undefined

  code: string | undefined

  isDCEOConected: boolean | undefined = false

  dceoId: number | undefined

  ownerId: number | undefined

  owner: User | undefined

  ownerName: string | undefined

  users: User[] | undefined

  workSpaceId: number | undefined

  constructor(model?: Partial<Unit>) {
    super(model);
  }
}
