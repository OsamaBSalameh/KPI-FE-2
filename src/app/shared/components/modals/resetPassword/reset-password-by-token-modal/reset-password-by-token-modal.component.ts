import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import {
  CustomValidator,
  isNullOrUndefined,
} from 'src/app/shared/tools/base-tools';

@Component({
  selector: 'app-reset-password-by-token-modal',
  templateUrl: './reset-password-by-token-modal.component.html',
  styleUrls: ['./reset-password-by-token-modal.component.css'],
})
export class ResetPasswordByTokenModalComponent implements OnInit {
  //#region Variables

  submitted: boolean = false;

  // resetPasswordForm = this.formBuilder.group({
  //   password: [null, [Validators.required]],
  //   confirmPassword: [null, [Validators.required]],
  // });


  // At least one upper case, one lower case, one digit, one special character, minimum length (6)
  passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"

  resetPasswordForm = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.passwordPattern)]],
    },
    { validators: CustomValidator.checkPasswords }
  );

  get formFileds() { return this.resetPasswordForm.controls }

  //#endregion

  //#region Constructor

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private activeRout: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkIfAllowed();
  }

  //#endregion

  //#region Events

  onSubmit() {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) return;

    let email = this.activeRout.snapshot.queryParamMap.get('email') as string;
    let token = this.activeRout.snapshot.queryParamMap.get('token') as string;
    let password = this.resetPasswordForm.value.password;

    this.sharedService.resetPasswordByToken(email, token, password).subscribe({
      error: () => {
        this.sharedService.errorToaster('Faild to reset password');
      },
      next: (res: any) => {
        this.sharedService.infoToaster('Your action is under processing');
        this.router.navigate(['login'], {});
      },
    });
  }

  //#endregion

  //#region Private

  private checkIfAllowed() {
    let email = this.activeRout.snapshot.queryParamMap.get('email') as string;
    let token = this.activeRout.snapshot.queryParamMap.get('token') as string;
    if (isNullOrUndefined(email) || isNullOrUndefined(token)) {
      this.sharedService.infoToaster('you are not allowed to be here');
      this.router.navigate(['login'], {});
    }
  }

  //#endregion
}
