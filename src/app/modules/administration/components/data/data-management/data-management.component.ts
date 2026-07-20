import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { DataService } from '../../../services/data.service';
import { Data } from '../../entities/data';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css']
})
export class DataManagementComponent extends ModalBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  paginatedData: Data[] = [];
  searchValue: string = ""

  //#endregion


  //#region Constructor

  constructor(private _dataService: DataService, modalService: NgbModal) {
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

  delete(data: any, content: any) { super.showDeleteModal(data, content) }

  add(content: any) { super.showAddModal(content) }

  update(data: any, content: any) { super.showUpdateModal(data, content) }

  copy(data: any, content: any) { super.showCopyModal(data, content) }

  view(data: any, content: any) { super.showViewModal(data, content) }

  search() {
    this.paginationItem.searchValue = this.searchValue;
    this.preSearch();
    this.getPaginatedValues();
  }

  //#endregion


  //#region Handlers

  dataAddedEventHandler(event: any) { this.getPaginatedValues() }

  dataUpdatedEventHandler(event: any) { this.getPaginatedValues() }

  dataDeletedEventHandler(event: number) {
    this._dataService.delete(event).pipe(takeUntil(this.destroy$)).subscribe(
      {
        error: () => { this._dataService.errorToaster("Faild to delete") },
        next: () => {
          this.getPaginatedValues()
          this._dataService.successToaster("Deleted successfully")
        }
      })
  }

  //#endregion


  //#region Private Functions

  private getFormTypesPaginated() {
    this._dataService.getValuesPaginated(this.paginationItem).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.fillPaginationData(res)
      this.paginatedData = res.items as Data[];
    })
  }

  //#endregion

}