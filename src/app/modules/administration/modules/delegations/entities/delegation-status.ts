import { BaseEntity } from 'src/app/core/base-entity/base-entity';

export class DelegationStatus extends BaseEntity<DelegationStatus> {
  value: string | undefined;

  code: DelegationStatusEnum | undefined;

  constructor(model?: Partial<DelegationStatus>) {
    super(model);
  }
}

export enum DelegationStatusEnum {
  Pending = 1,
  Active = 2,
  Completed = 3,
  Stopped = 4
}
