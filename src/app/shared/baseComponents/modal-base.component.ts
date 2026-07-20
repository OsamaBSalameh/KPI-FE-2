import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseCustomModal, BaseModal } from 'src/app/shared/entities/base-modal';
import { ActionType } from 'src/app/shared/enums/action-type';
import { PaginationBaseComponent } from './pagination-base.component';
// import { BaseService } from './service-base.service';

@Component({
  selector: 'app-modal-base',
  template: ''
})
export abstract class ModalBaseComponent extends PaginationBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  public closeResult: string = '';
  public deleteModalReference: any;
  public notesModalReference: any;
  public assignModalReference: any;
  public deleteWithReasonModalReference: any;
  public treatmentLogsModalReference: any;
  public pdfGeneratorModalReference: any;
  public addUpdateModal: any;
  public returnTreatmentModal: any;

  //#endregion


  //#region Constructor

  constructor(
    private modalService: NgbModal,
    // private service: BaseService<T>
    ) { super() }

  override ngOnInit(): void { }

  override ngOnDestroy(): void { }

  //#endregion


  //#region Events

  showDeleteModal(data: any, content: any) {
    let modalReference = this.openModal(content, false, true);
    this.deleteModalReference = {
      modalReference: modalReference,
      modalData: data
    }
  }

  showCommentModal(data: any, referenceId: number, content: any) {
    let modalReference = this.openModal(content, true);
    this.notesModalReference = {
      modalReference: modalReference,
      modalData: data,
      referenceId: referenceId
    }
  }

  showAddModal(content: any) { this.addUpdateModal = this.prepareModals(null, content, ActionType.Add) }

  showCopyModal(data: any, content: any) { this.addUpdateModal = this.prepareModals(data, content, ActionType.Copy) }

  showUpdateModal(data: any, content: any) { this.addUpdateModal = this.prepareModals(data, content, ActionType.Update) }

  showCustomModal(data: any = null, content: any, actionType: ActionType, additionalInfo: any) { this.addUpdateModal = this.prepareCustomModals(data, content, actionType, additionalInfo) }

  showViewModal(data: any, content: any) { this.addUpdateModal = this.prepareModals(data, content, ActionType.View) }

  openConfirmationModal(content: any, isSmall: boolean = false) {
    let modalWindowClass = "";
    if (isSmall) modalWindowClass = "modalSmallDialog";

    let modalReference = this.modalService.open(content, { windowClass: modalWindowClass, ariaLabelledBy: 'modal-basic-title' });
    modalReference.result.then((result: any): void => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    return modalReference
  }

  //#endregion


  //#region Abstracrt 

  abstract override getPaginatedValues(): any

  //#endregion


  //#region Privates

  private prepareModals(data: any = null, content: any, actionType: ActionType) {
    let modalReference = this.openModal(content);
    let baseModal: BaseModal = {
      modalReference: modalReference,
      data: data,
      actionType: actionType
    }
    return baseModal
  }

  private prepareCustomModals(data: any = null, content: any, actionType: ActionType, customInfo: any) {
    let modalReference = this.openModal(content);
    let baseModal: BaseCustomModal = {
      modalReference: modalReference,
      data: data,
      actionType: actionType,
      customInfo: customInfo
    }
    return baseModal
  }

  //#endregion


  //#region Modal

  private openModal(content: any, isSmall: boolean = false, isDeleteSmall: boolean = false) {
    let modalWindowClass = "";
    if (isSmall) modalWindowClass = "modalSmallDialog";
    else if (isDeleteSmall) modalWindowClass = "modalDeleteDialog";

    let modalReference = this.modalService.open(content, { windowClass: modalWindowClass, ariaLabelledBy: 'modal-basic-title' });
    modalReference.result.then((result: any): void => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    return modalReference
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
    else return `with: ${reason}`;
  }

  //#endregion

}
