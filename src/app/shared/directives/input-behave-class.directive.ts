import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appInputBehaveClass]',
})
export class InputBehaveClassDirective implements OnInit, OnDestroy {
  @Input('appInputBehaveClass') formControl!: AbstractControl | null;
  @Input() isSubmitted: boolean = false;

  public destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private renderer: Renderer2, private hostElement: ElementRef) {}

  ngOnInit() {
    this.formControl?.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(this.addClass());
    // this.checkValue();
  }

  // checkValue() {
  //   this.addClass();
  // }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
  addClass() {
    return (status: any) => {
      if (this.isSubmitted) {
        // this.renderer.removeClass(this.hostElement.nativeElement, 'success');
        this.renderer.removeClass(this.hostElement.nativeElement, 'error');
        // this.renderer.removeClass(this.hostElement.nativeElement, 'incorrect');

        // if (this.formControl?.valid) {
        //   this.renderer.addClass(this.hostElement.nativeElement, 'success');
        // } else
        if (this.formControl?.invalid) {
          this.renderer.addClass(this.hostElement.nativeElement, 'error');
        }
      } else {
        this.renderer.removeClass(this.hostElement.nativeElement, 'error');
      }
    };
  }
}
