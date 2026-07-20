import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { StrategyStatusEnum } from "../enums/strategy-status-enum";

export class StrategyStatus extends BaseEntity<StrategyStatus> {
  value: string | undefined

  code: StrategyStatusEnum | undefined

  constructor(model?: Partial<StrategyStatus>) {
    super(model);
  }
}
