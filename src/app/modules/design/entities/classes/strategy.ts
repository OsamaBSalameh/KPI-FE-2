import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { StrategyScorecard } from './strategies-scorecards';
import { StrategyStatus } from './strategy-status';

export class Strategy extends BaseEntity<Strategy> {
  name: string | undefined;

  startDate: Date | undefined;

  endDate: Date | undefined;

  //#region  Quarters Settings

  firstQuarterSettingsId: number | undefined;
  firstQuarterSettings: StrategyQuartersSettings | undefined;

  secondQuarterSettingsId: number | undefined;
  secondQuarterSettings: StrategyQuartersSettings | undefined;

  thirdQuarterSettingsId: number | undefined;
  thirdQuarterSettings: StrategyQuartersSettings | undefined;

  forthQuarterSettingsId: number | undefined;
  forthQuarterSettings: StrategyQuartersSettings | undefined;

  yearlySettingsId: number | undefined;
  yearlySettings: StrategyQuartersSettings | undefined;

  //#endregion

  statusId: string | undefined;

  status: StrategyStatus | undefined;

  strategyScorecards: StrategyScorecard[] | undefined;

  constructor(model?: Partial<Strategy>) {
    super(model);
  }
}

export class StrategyQuartersSettings extends BaseEntity<StrategyQuartersSettings> {
  name: string | undefined;

  startDate: Date | undefined;

  endDate: Date | undefined;

  reminderLifespan: number | undefined;

  public resetId() {
    this.id = undefined;
  }
}
