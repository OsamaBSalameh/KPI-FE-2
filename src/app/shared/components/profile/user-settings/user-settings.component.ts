import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { AddUpdateBaseComponent } from 'src/app/shared/baseComponents/add-update-base.component';
import { User } from 'src/app/shared/entities/users/user';
import { isNullOrUndefinedOrWhiteSpace } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent extends AddUpdateBaseComponent implements OnInit, OnDestroy {

  //#region Variables

  reLoginModalReference: any
  closeResult: any

  //#endregion


  //#region Constructor

  constructor(private _authService: AuthService, private modalService: NgbModal) { super() }

  override ngOnInit(): void { }

  //#endregion


  //#region Events

  add() { }

  update() { }

  copy() { }

  userProfilePictureEventHandler(files: any) {
    
    let user = this._authService.getUserInfo() as User
    let paths = user.profilePicturePath?.split('\\') as string[];
    // paths.map((path, index) => {
    //   if (isNullOrUndefinedOrWhiteSpace(path)) {
    //     paths.slice(index, index + 1)
    //   }
    // })
    let p = paths.filter(p => !isNullOrUndefinedOrWhiteSpace(p))

    this.modal.profilePicturePath = `${p[0]}\\\\${p[1]}\\\\${p[2]}\\\\${p[3]}\\\\${files[0].name}`
    // this._authService.userImageSubject.next(this.modal.profilePicturePath)
    this._authService.setUserImage(this.modal.profilePicturePath)

    user.profilePicturePath = this.modal.profilePicturePath
    this._authService.setUserDataStorage(user)
  }

  userUpdatedEventHandler(content: any) { this.showReLoginModal(content) }

  showReLoginModal(content: any) {
    let modalReference = this.openModal(content, true);
    this.reLoginModalReference = {
      modalReference: modalReference
    }
  }

  //#endregion


  //#region Private

  private openModal(content: any, isSmall: boolean = false) {
    let modalWindowClass = "";
    if (isSmall) modalWindowClass = "modalSmallDialog";

    let modalReference = this.modalService.open(content, { windowClass: modalWindowClass, ariaLabelledBy: 'modal-basic-title', backdrop: false, keyboard: false });
    modalReference.result.then((result: any): void => { }, (reason: any) => { });

    return modalReference
  }

  //#endregion

}
