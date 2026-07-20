import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "src/app/shared/entities/users/user";
import { PermissionGroup } from "./permissionGroup";

export class UserPermissionGroup extends BaseEntity<UserPermissionGroup> {

  permissionGroupId: number | undefined
  permissionGroup: PermissionGroup | undefined

  userId: number | undefined
  user: User | undefined

  constructor(model?: Partial<UserPermissionGroup>) {
    super(model);
  }
}
