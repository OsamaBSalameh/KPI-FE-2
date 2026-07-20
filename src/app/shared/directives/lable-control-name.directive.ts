import { Directive, HostBinding, Optional, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: 'label[controlName]',
})
export class LabelControlDirective {
  @Input() controlName: string | undefined;

  constructor(@Optional() private parent: ControlContainer) {}

  @HostBinding('textContent')
  get controlValue() {
    return this.parent
      ? this.parent?.control?.get(this.controlName as string)?.value
      : '';
  }
}
