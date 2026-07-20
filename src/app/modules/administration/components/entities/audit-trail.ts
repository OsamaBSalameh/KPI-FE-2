import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { User } from "src/app/shared/entities/users/user";

export class AuditTrail extends BaseEntity<AuditTrail> {
  actionName: string | undefined
  type: AuditType | undefined
  typeString: string | undefined

  tableName: string | undefined
  oldValues: string | undefined
  newValues: string | undefined
  affectedColumns: string | undefined
  rowId: string | undefined

  actionById: number | undefined
  actionBy: User | undefined

  constructor(model?: Partial<AuditTrail>) {
    super(model);
  }
}


export enum AuditType {
  None = 1,
  Add = 2,
  Update = 3,
  Delete = 4
}