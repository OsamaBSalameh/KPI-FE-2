import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { ActionType } from 'src/app/shared/enums/action-type';
import { AttachmentType } from 'src/app/shared/enums/attachment-type';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-picture-management',
  templateUrl: './profile-picture-management.component.html',
  styleUrls: ['./profile-picture-management.component.css']
})
export class ProfilePictureManagementComponent implements OnInit, OnDestroy {

  //#region Variables

  @Input() modal: any
  @Output() userProfilePictureUpdatedEvent = new EventEmitter<any>();

  rootUrl: string
  viewOnly: boolean = false;

  attachmentType: AttachmentType = AttachmentType.ProfilePicture
  downloadedFiles: any
  userId: number = 0

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject('');
  private subscription: Subscription = new Subscription();

  public readonly control = new FileUploadControl(
    { listVisible: true, accept: ['image/*'], discardInvalid: true, multiple: false },
    [FileUploadValidators.accept(['image/*']), FileUploadValidators.filesLimit(1)]
  );

  isCurentUser: boolean = true

  //#endregion


  //#region Constructor

  constructor(private sharedService: SharedService, private _authService: AuthService) { this.rootUrl = environment.currentRoot_URL }


  public ngOnInit(): void {
    // Subscribe to the file upload control changes, and get it's values and pass them to your reader function
    this.subscription = this.control.valueChanges.subscribe((values: Array<File>) => this.getImage(values[0]));

    // this.userId = Number.parseInt(this._authService.getUserId() as string)
    this.userId = Number.parseInt(this.modal?.data?.id || this._authService.getUserId() as string)

    this.determineActionType()
    this.getByTypeAndAttachedIdAsync()
  }

  public ngOnDestroy(): void { this.subscription.unsubscribe() }

  //#endregion


  //#region Events

  download() {
    let files = this.control.value as File[];

    files.forEach((file: any) => {
      let anchor = document.createElement("a");
      anchor.href = `${this.rootUrl}${this.downloadedFiles.find((fi: { name: any; type: any; }) => fi.name == file.name).path}`;
      anchor.download = file.name
      anchor.click();
      file.file = anchor
    });
  }

  upload() {
    let files = this.control.value
    this.sharedService.uploadAttachments(files, this.attachmentType, this.userId, undefined).subscribe(res => {
      this.sharedService.successToaster("Uploaded successfully")
      this.userProfilePictureUpdatedEvent.emit(files)
    })
  }

  //#endregion


  //#region Private functions

  private async getByTypeAndAttachedIdAsync() {
    let fileResult = this.sharedService.getByTypeAndAttachedIdAsync(this.attachmentType, this.userId).pipe()
    let result = await lastValueFrom(fileResult) as unknown as any[];

    this.downloadedFiles = result;
    result.forEach(async file => {
      let blob = this.sharedService.getBlob(file.path).pipe()
      let bolbResult = await lastValueFrom(blob) as Blob;
      let bolbFile = new File([bolbResult], file.name)
      this.control.addFile(bolbFile)
    })
  }

  // The reader function now should start reading the file, by getting the src path of the file
  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e) => this.uploadedFile.next(e.target?.result?.toString().replace('application/octet-stream', `image/${file.name.split('.')[1]}`) as string);
      fr.readAsDataURL(file);
    } else this.uploadedFile.next('');
  }

  private determineActionType() {
    if (this.modal.actionType == ActionType.Review || this.modal.actionType == ActionType.View) {
      this.viewOnly = true;
      this.control.disable()
    }
    if (this.modal.data != null) this.isCurentUser = false
    else this.isCurentUser = true
  }

  //#endregion

}