import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { User } from 'src/app/shared/entities/users/user';
import { PermissionGroup } from '../../../components/entities/permissionGroup';
import { DelegationStatus } from './delegation-status';

export class Delegation extends BaseEntity<Delegation> {

  startDate: Date | undefined;
  endDate: Date | undefined;
  isProcessed: boolean | undefined;

  permissionGroupId: number | undefined
  permissionGroup: PermissionGroup | undefined

  delegatedFromId: number | undefined;
  delegatedFrom: User | undefined;


  delegatedToId: number | undefined;
  delegatedTo: User | undefined;

  statusId: number | undefined;
  status: DelegationStatus | undefined;


  constructor(model?: Partial<Delegation>) {
    super(model);
  }
}
