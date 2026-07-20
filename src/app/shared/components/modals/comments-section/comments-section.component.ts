import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KPICopy } from 'src/app/modules/kpi/entities/classes/kpi-copy';
import { UnitKPI } from 'src/app/modules/kpi/entities/classes/unit-kpi';
import { Comment } from 'src/app/shared/entities/comment';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.css'],
})
export class CommentsSectionComponent implements OnInit, OnDestroy {
  //#region Variables

  @Input() modal: any;

  paginatedComments: Comment[] = [];
  kpiCopy: KPICopy = new KPICopy();
  unitKPI: UnitKPI = new UnitKPI();

  commentValue: string | undefined;

  //#endregion

  //#region Constructor

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.initModal();
    this.getComments();
  }

  ngOnDestroy(): void {}

  //#endregion

  //#region Events

  addComment() {
    let comment: Comment = new Comment({
      autherId: 1, // should be the currentUser
      isEnabled: true,
      value: this.commentValue,
      kpiCopyId: this.kpiCopy.id,
      UnitKPIRequestId: this.unitKPI.unitKPIRequestId,
    });

    if (comment.auther?.thumbnailPhoto != null) {
      comment.auther.thumbnailPhoto = undefined;
    }

    this.sharedService.addComment(comment).subscribe({
      error: () => {
        this.sharedService.errorToaster('Failed to comment');
      },
      next: (res) => {
        this.sharedService.successToaster('commented successfully');
        this.commentValue = '';
        // this.paginatedComments.push(res);
        this.getComments();
      },
    });
  }

  close() {
    this.modal.modalReference.close();
  }

  //#endregion

  //#region Private

  private initModal() {
    this.unitKPI = this.modal.data;
    this.kpiCopy = this.modal.data.kpiCopy;
  }

  private getComments() {
    this.sharedService
      .getUnitKPIComments(
        this.kpiCopy.id as number,
        this.unitKPI.unitKPIRequestId as number
      )
      .subscribe((res: any) => {
        let values = res as Comment[];
        this.paginatedComments = values.map(
          (value) => (value = new Comment(value))
        );
      });
  }

  //#endregion
}
