import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNullOrUndefined } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  //#region Variables

  @Input() modal: any;
  @Output() deletedEvent = new EventEmitter<any>();

  modalData: any

  //#endregion


  //#region Constructor

  constructor() { }

  ngOnInit(): void { this.modalData = this.modal?.modalData }

  //#endregion


  //#region Events

  cancel() { this.modal?.modalReference.close() }

  delete() {
    if (isNullOrUndefined(this.modalData.id)) this.deletedEvent.emit(this.modalData)
    else this.deletedEvent.emit(this.modalData.id)

    this.modal?.modalReference.close()
  }

  //#endregion

}
