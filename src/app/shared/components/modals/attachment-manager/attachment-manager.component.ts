import { Component, Input, OnInit } from '@angular/core';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { lastValueFrom } from 'rxjs';
import { ActionType } from 'src/app/shared/enums/action-type';
import { AttachmentType } from 'src/app/shared/enums/attachment-type';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-attachment-manager',
  templateUrl: './attachment-manager.component.html',
  styleUrls: ['./attachment-manager.component.css'],
})
export class AttachmentManagerComponent implements OnInit {
  //#region Variables

  @Input() modal: any;
  downloadedFiles: any;

  public animation: boolean = true;
  public multiple: boolean = true;

  attachmentType: AttachmentType = AttachmentType.KPICopy;

  public fileUploadControl = new FileUploadControl(
    { listVisible: true, discardInvalid: true }, //, accept: ['image/*|application/pdf|application/vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.oasis.opendocument.text|text/plain'], },
    [FileUploadValidators.fileSize(5000000)]
    // [FileUploadValidators.accept(['image/*|application/pdf|application/vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.oasis.opendocument.text|text/plain']), FileUploadValidators.fileSize(5000000)]
  );

  rootUrl: string;
  viewOnly: boolean = false;

  //#endregion

  //#region Constructor

  constructor(private sharedService: SharedService) {
    this.rootUrl = environment.currentRoot_URL;
  }

  async ngOnInit(): Promise<void> {
    this.determineAttachmentType();
    this.determineActionType();

    await this.getByTypeAndAttachedAndRequestAsync();
  }

  //#endregion

  //#region Events

  close() {
    this.modal.modalReference.close();
  }

  download() {
    let files = this.fileUploadControl.value as File[];

    files.forEach((file: any) => {
      let anchor = document.createElement('a');
      anchor.href = `${this.rootUrl}${
        this.downloadedFiles.find((fi: { name: any }) => fi.name == file.name)
          .path
      }`;
      anchor.download = file.name;
      anchor.click();
      file.file = anchor;
    });
  }

  upload() {
    let files = this.fileUploadControl.value;
    this.sharedService
      .uploadAttachments(
        files,
        this.attachmentType,
        this.modal?.data?.kpiCopyId,
        this.modal?.data?.unitKPIRequestId
      )
      .subscribe((res) => {
        this.sharedService.successToaster('Uploaded successfully');
      });
  }

  //#endregion

  //#region Private

  private async getByTypeAndAttachedAndRequestAsync() {
    let fileResult = this.sharedService
      .getByTypeAndAttachedAndRequestAsync(
        this.attachmentType,
        this.modal?.data?.kpiCopyId,
        this.modal?.data?.unitKPIRequestId
      )
      .pipe();
    let result = (await lastValueFrom(fileResult)) as unknown as any[];

    this.downloadedFiles = result;
    result.forEach(async (file) => {
      let blob = this.sharedService.getBlob(file.path).pipe();
      let bolbResult = (await lastValueFrom(blob)) as Blob;
      let bolbFile = new File([bolbResult], file.name, {
        type: bolbResult.type,
      } as FilePropertyBag);

      this.fileUploadControl.addFile(bolbFile);
    });
  }

  private determineActionType() {
    if (
      this.modal.actionType == ActionType.Review ||
      this.modal.actionType == ActionType.View
    ) {
      this.viewOnly = true;
      this.fileUploadControl.disable();
    }
  }

  private determineAttachmentType() {
    this.attachmentType = this.modal.attachmentType;
  }

  //#endregion
}
