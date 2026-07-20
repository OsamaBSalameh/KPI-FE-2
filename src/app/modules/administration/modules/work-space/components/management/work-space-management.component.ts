import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalBaseComponent } from 'src/app/shared/baseComponents/modal-base.component';
import { WorkSpace } from '../../entities/work-space';
import { Unit } from 'src/app/modules/administration/components/entities/unit';
import { WorkSpaceService } from '../../services/work-space.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, takeUntil } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-work-space-management',
  templateUrl: './work-space-management.component.html',
  styleUrls: ['./work-space-management.component.css']
})
export class WorkSpaceManagementComponent extends ModalBaseComponent implements OnInit, OnDestroy {

  //#region Variable
  paginatedWorkSpaces: WorkSpace[] = [];
  searchValue: string = '';

  allUnits: Unit[] = [];
  selectedUnit: any = 0;
  //#endregion

  //#region Constructor
  constructor(private workSpaceService: WorkSpaceService, modalService: NgbModal, private sanitizer: DomSanitizer) {
    super(modalService);
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.getPaginatedValues();
    this.allUnits = await this.initUnits();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
  //#endregion

  //#region Events
  getPaginatedValues() {
    this.getWorkSpacePaginated()
  }

  add(content: any) {
    super.showAddModal(content);
  }

  update(data: any, content: any) {
    super.showUpdateModal(data, content);
  }

  view(data: any, content: any) {
    super.showViewModal(data, content);
  }

  delete(data: any, content: any) {
    super.showDeleteModal(data, content);
  }

  search() {
    this.paginationItem.searchValue = this.searchValue;
    this.preSearch();
    this.getPaginatedValues();
  }

  onOrganizationSelect(data: any) {
    this.selectedUnit = data.value;
    this.getPaginatedValues();
  }
  //#endregion

  //#region Handlers
  workSpaceAddedEventHandler(event: any) {
    // Here we should add the work-space, instead of letting the Add/Update do it
    this.addWorkSpace(event);
  }

  workSpaceUpdatedEventHandler(event: any) {
    this.updateWorkSpace(event);
  }

  workSpaceDeletedEventHandler(event: number) {
    this.deleteWorkSpace(event);
  }
  //#endregion

  //#region Private
  private async initUnits() {
    let result = this.workSpaceService.getUnits().pipe(takeUntil(this.destroy$));
    return (await lastValueFrom(result)) as Unit[];
  }

  private getWorkSpacePaginated() {
    this.workSpaceService
      .getValuesPaginated(this.paginationItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.fillPaginationData(res);
        res.items.forEach((item: { logo_SVG_VIEW: SafeResourceUrl, logo_SVG: string; }) => {
          if (typeof item.logo_SVG === 'string' && !item.logo_SVG.startsWith('data:')) {
            let dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(item.logo_SVG)));
            // 2. Sanitize AND ASSIGN the result back to the property
            item.logo_SVG_VIEW  = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
          }
        });

        this.paginatedWorkSpaces = res.items as WorkSpace[];
      });
  }

  private addWorkSpace(workSpace: WorkSpace) {
    this.workSpaceService.add(workSpace).subscribe({
      error: () => {
        this.workSpaceService.errorToaster('Failed to save');
      },
      next: () => {
        this.workSpaceService.successToaster('Saved successfully');
        this.getPaginatedValues();
      },
    });
  }

  private updateWorkSpace(workSpace: WorkSpace) {
    this.workSpaceService.update(workSpace).subscribe({
      error: () => {
        this.workSpaceService.errorToaster('Failed to update');
      },
      next: () => {
        this.workSpaceService.successToaster('Updated successfully');
        this.getPaginatedValues();
      },
    });
  }

  private deleteWorkSpace(id: number) {
    this.workSpaceService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.workSpaceService.errorToaster('Failed to delete');
        },
        next: () => {
          this.getPaginatedValues();
          this.workSpaceService.successToaster('Deleted successfully');
        },
      });
  }
  //#endregion

}
