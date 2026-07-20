import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { ObjectiveScorecard } from "./scorecards-objectives";

export class Scorecard extends BaseEntity<Scorecard> {
  name: string | undefined

  objectiveScorecards: ObjectiveScorecard[] | undefined

  constructor(model?: Partial<Scorecard>) {
    super(model);
  }
}
