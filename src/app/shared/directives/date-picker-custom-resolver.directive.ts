import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDatePickerResolver]'
})
export class DatePickerResolverDirective {

  numberAndDashPattern = /[0-9]|-/;
  monthsPattern = /[2-9]/;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef
  ) { }

  @HostListener('keypress', ['$event'])
  dateValueChanged(event: any): void {
    // Osama B. Salameh: prevent any input that is not a number or greater than 9
    let currentValue = event.target.value;
    if (!this.numberAndDashPattern.test(event.key) || (currentValue.length > 9)) {
      event.preventDefault(); return
    }

    // Osama B. Salameh: If the user try to insert "-" we need to make sure it's only within the track
    if (event.key === '-' && !(currentValue.length === 2 || currentValue.length === 5) && event.key !== 'Backspace') { event.preventDefault(); return }
    else if (event.key != '-') {
      if (currentValue.length == 2) currentValue += this.monthsPattern.test(event.key) ? '-0' : '-'
      if (currentValue.length == 3 && currentValue.includes('-')) currentValue += this.monthsPattern.test(event.key) ? '0' : ''
      if (currentValue.length == 5) currentValue += '-'
    }

    // Osama B. Salameh: Set the new value of the date
    this.renderer.setProperty(this.elRef.nativeElement, 'value', currentValue);
  }

}
