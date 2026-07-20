import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css'],
})
export class ForgotPasswordModalComponent implements OnInit, OnDestroy {
  //#region Variables

  submitted: boolean = false;

  forgotPasswordForm = this.formBuilder.group({
    email: [null, [Validators.required]],
  });
  get formFileds() {
    return this.forgotPasswordForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {}

  //#endregion

  //#region Events

  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) return;

    let email = this.forgotPasswordForm.value.email;
    // let returnUrl = window.location.origin + '/resetPasswordByToken';

    this.sharedService.forgotPassword(email).subscribe({
      error: () => {
        //this.sharedService.errorToaster('Faild to reset your password');
      },
      next: (res: any) => {
        this.sharedService.infoToaster('Please check out your mail');
      },
    });
  }

  //#endregion
}
