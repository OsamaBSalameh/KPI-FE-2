import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "src/app/shared/entities/users/user";
import { UserPermissionGroup } from "./user-permission-group";

export class PermissionGroup extends BaseEntity<PermissionGroup> {

  name: string | undefined

  code: string | undefined

  isDCEOConected: boolean | undefined = false

  userPermissionGroups: UserPermissionGroup[] | undefined

  constructor(model?: Partial<PermissionGroup>) {
    super(model);
  }
}
