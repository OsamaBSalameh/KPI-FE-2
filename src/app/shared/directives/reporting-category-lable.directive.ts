import { Directive, HostBinding, Optional, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { UnitKPIValue } from 'src/app/modules/kpi/entities/classes/unit-kpi-value';
import { ReportingCategory } from 'src/app/modules/kpi/entities/enums/value-sense-enum';

@Directive({
  selector: 'label[reportingControlName]',
})
export class ReportingCategoryLabelDirective {
  @Input() reportingControlName: string | undefined;

  constructor(@Optional() private parent: ControlContainer) {}

  @HostBinding('textContent')
  get controlValue() {
    let returnedText = '';
    let values = this.parent
      ? (this.parent?.control?.get(this.reportingControlName as string)
          ?.value as UnitKPIValue[])
      : undefined;

    if (values != undefined && values?.length > 0) {
      if (values[0].type == ReportingCategory.Yearly)
        returnedText = `Y: ${values[0].value}`;
      else
        values?.forEach(
          (value) => (returnedText += `Q${value.order}: ${value.value}, `)
        );
    }

    return returnedText;
  }
}
