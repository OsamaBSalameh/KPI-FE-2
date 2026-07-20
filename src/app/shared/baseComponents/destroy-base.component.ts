import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-destroy-base',
  template:''
})
export abstract class DestroyBaseComponent implements OnInit, OnDestroy {

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
