import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNullOrUndefined } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  //#region Variables

  @Input() modal: any;
  @Output() confirmedEvent = new EventEmitter<any>();

  modalData: any
  message: string = ''

  //#endregion


  //#region Constructor

  constructor() { }

  ngOnInit(): void { 
    this.modalData = this.modal?.modalData
    this.message = this.modal?.message
   }

  //#endregion


  //#region Events

  cancel() { this.modal?.modalReference.close() }

  confirm() {
     this.confirmedEvent.emit(this.modalData);
     this.modal?.modalReference.close();
  }

  //#endregion

}
