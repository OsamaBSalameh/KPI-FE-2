import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CustomValidator } from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-password-management',
  templateUrl: './password-management.component.html',
  styleUrls: ['./password-management.component.css'],
})
export class PasswordManagementComponent implements OnInit, OnDestroy {
  //#region Variables

  @Input() public modal: any;
  @Output() userPasswordUpdatedEvent = new EventEmitter<any>();

  // At least one upper case, one lower case, one digit, one special character, minimum length (6)
  passwordPattern =
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$';

  userInfo: any;
  userChangePasswordModel: {
    currentPassword: string;
    newPassword: string;
    userName: string;
  } = {
    currentPassword: '',
    newPassword: '',
    userName: '',
  };

  submitted: boolean = false;

  changePasswordForm = this.formBuilder.group(
    {
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      passwordConfirm: [
        null,
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    },
    { validators: [CustomValidator.match('newPassword', 'passwordConfirm')] }
  );
  get formFileds() {
    return this.changePasswordForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private _authService: AuthService,
    private _sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.userInfo = this._authService.isAuthenticated()
      ? this._authService.getUserInfo()
      : null;
  }

  //#endregion

  //#region Events

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) return;

    this.userChangePasswordModel = {
      userName: this.userInfo.userName,
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };

    this.updatePassword();
  }

  //#endregion

  //#region Private Functions

  private updatePassword() {
    this._sharedService
      .changeUserPassword(this.userChangePasswordModel)
      .subscribe({
        error: () => {
          this._sharedService.errorToaster('Faild to change password');
        },
        next: () => {
          this._sharedService.successToaster('Password updated successfully');
          this.userPasswordUpdatedEvent.emit();
        },
      });
  }

  //#endregion
}
