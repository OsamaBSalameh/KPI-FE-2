import { BaseEntity } from "src/app/core/base-entity/base-entity";

export class StrategyScorecard extends BaseEntity<StrategyScorecard> {
  strategyId: number | undefined
  // strategy: Strategy | undefined

  scorecardId: number | undefined
  // scorcard: Scorecard | undefined

  weight: number | undefined

  constructor(model?: Partial<StrategyScorecard>) {
    super(model);
  }
}
