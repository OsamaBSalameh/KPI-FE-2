import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-request-return-reason',
  templateUrl: './request-return-reason.component.html',
  styleUrls: ['./request-return-reason.component.css'],
})
export class RequestReturnReasonComponent implements OnInit, OnDestroy {
  @Input() modal: any;
  @Output() returnReasonAddedEvent = new EventEmitter<any>();
  returnReason: string = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  done() {
    this.returnReasonAddedEvent.emit(this.returnReason);
    this.modal.modalReference.close();
  }

  close() {
    this.modal.modalReference.close();
  }
}
