import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { AuditTrailService } from '../../../services/audit-trail.service';
import { AuditTrail, AuditType } from '../../entities/audit-trail';

@Component({
  selector: 'app-audit-trail-management',
  templateUrl: './audit-trail-management.component.html',
  styleUrls: ['./audit-trail-management.component.css']
})
export class AuditTrailManagementComponent extends ModalBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  paginatedAuditTrail: AuditTrail[] = [];
  searchValue: string = ""

  //#endregion


  //#region Constructor

  constructor(private _auditTrailService: AuditTrailService, modalService: NgbModal) {
    super(modalService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getPaginatedValues();
  }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion


  //#region Events

  getPaginatedValues() { this.getFormTypesPaginated() }

  delete(auditTrail: any, content: any) { super.showDeleteModal(auditTrail, content) }

  add(content: any) { super.showAddModal(content) }

  update(formType: any, content: any) { super.showUpdateModal(formType, content) }

  view(formType: any, content: any) { super.showViewModal(formType, content) }

  search() {
    this.paginationItem.searchValue = this.searchValue;
    this.preSearch();
    this.getPaginatedValues();
  }

  //#endregion


  //#region Handlers

  auditTrailAddedEventHandler(event: any) { this.getPaginatedValues() }

  auditTrailUpdatedEventHandler(event: any) { this.getPaginatedValues() }

  auditTrailDeletedEventHandler(event: number) {
    this._auditTrailService.delete(event).pipe(takeUntil(this.destroy$)).subscribe(
      {
        error: () => { this._auditTrailService.errorToaster("Faild to delete") },
        next: () => {
          this.getPaginatedValues()
          this._auditTrailService.successToaster("Deleted successfully")
        }
      })
  }

  //#endregion


  //#region Private Functions

  private getFormTypesPaginated() {
    this._auditTrailService.getValuesPaginated(this.paginationItem).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.fillPaginationData(res)
      res.items.forEach((audit: { typeString: string; type: AuditType; }) => {
        audit.typeString = AuditType[audit.type as AuditType]
      });
      this.paginatedAuditTrail = (res.items as AuditTrail[]);
    })
  }

  //#endregion

}