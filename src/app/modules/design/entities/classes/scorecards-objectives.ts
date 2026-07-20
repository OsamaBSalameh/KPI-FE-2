import { BaseEntity } from "src/app/core/base-entity/base-entity";
import { ObjectiveProspectiveEnum } from "../enums/objective-prospective-enum";

export class ObjectiveScorecard extends BaseEntity<ObjectiveScorecard> {
  objectiveId: number | undefined
  // strategy: Strategy | undefined

  scorecardId: number | undefined
  // scorcard: Scorecard | undefined

  objectiveProspective: ObjectiveProspectiveEnum | undefined

  weight: number | undefined

  constructor(model?: Partial<ObjectiveScorecard>) {
    super(model);
  }
}
