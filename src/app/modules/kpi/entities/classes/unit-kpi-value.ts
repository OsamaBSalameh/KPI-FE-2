import { BaseEntity } from 'src/app/core/base-entity/base-entity';
import { ReportingCategory } from '../enums/value-sense-enum';

export class UnitKPIValue extends BaseEntity<UnitKPIValue> {
  value: number | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  order: number | undefined;
  type: ReportingCategory | undefined;
  isVerified: boolean | undefined

  constructor(model?: Partial<UnitKPIValue>) {
    super(model);
  }
}
