import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { PermissionGroup } from 'src/app/modules/administration/components/entities/permissionGroup';
import { CONSTANTS } from 'src/app/shared/entities/constants';
import { SharedService } from 'src/app/shared/services/shared.service';
import { encryptAES, encryptUsingAES256 } from 'src/app/shared/tools/encryption-helper';
import * as uuid from 'uuid';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent implements OnInit {
  //#region Variables

  submitted: boolean = false;

  // secObj = {
  //   key: 's-captcha',
  //   // width: 200,
  //   // height: 75,
  //   requestKey: '',
  //   imageUrl: '',
  // };

  loginForm = this.formBuilder.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required]],
    // captcha: [null, Validators.compose([Validators.required])],
  });

  tokenExpireInterval: any;
  get formFileds() {
    return this.loginForm.controls;
  }

  //#endregion

  //#region Constructor

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private permissionsService: NgxPermissionsService,
    // private rolesService: NgxRolesService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.checkUserLoggedIn();
    // this.prepareResolverData();
  }

  //#endregion

  //#region Events

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    // this.loginRequest();
    this.activeDirectoryLoginRequest();
  }

  private getPermissionGroup(userId: number) {
    this.sharedService.getPermissionGroupByUser(userId).subscribe(result => {
      let groups = result as PermissionGroup[]
      let roleCodes = groups.map(group => group.code) as string[];
      this.permissionsService.loadPermissions(roleCodes)
      this.authService.setUserRoles(roleCodes)
      // this.authService.setUserRole("SPMO")
      this.router.navigate(['homeNavbar'], {});
    });
  }

  //#endregion

  //#region Private

  private loginRequest(){
    let loginReq = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password,
      // captcha: this.loginForm.value.captcha,
      // captchaKey: this.sharedService.captchaRequestKey,
    };

    this.sharedService.login(loginReq).subscribe({
      error: () => {
        // this.sharedService.errorToaster('Faild to login');
      },
      next: (res: any) => {
        this.authService.resetCredentials();
        this.authService.setAuthorizationToken(res.token);
        this.authService.setRefreshToken(res.refreshToken);
        this.authService.setUserStorage(res);
        this.authService.setUserId(res.user.id);
        this.getPermissionGroup(res.user.id);

        this.prepareRefreshTokenTimer();
      },
    });
  }

  private activeDirectoryLoginRequest(){
    let encryptedPassword = encryptUsingAES256(this.loginForm.value.password, CONSTANTS.Encryption_Key, CONSTANTS.INIT_VECTOR)
    let loginReq = {
      userName: this.loginForm.value.userName,
      password: encryptedPassword,
      // captcha: this.loginForm.value.captcha,
      // captchaKey: this.sharedService.captchaRequestKey
    };

    this.sharedService.activeDirectoryLogin(loginReq).subscribe({
      error: () => {
        // this.sharedService.errorToaster('Faild to login');
      },
      next: (res: any) => {
        this.authService.resetCredentials();
        this.authService.setAuthorizationToken(res.token);
        this.authService.setRefreshToken(res.refreshToken);
        this.authService.setUserStorage(res);
        if (res.user.thumbnailPhoto != null)
          this.authService.setThumbnailPhoto(res.thumbnailPhoto);
        this.authService.setUserId(res.user.id);
        this.getPermissionGroup(res.user.id);

        this.prepareRefreshTokenTimer();
      },
    });
  }

  private checkUserLoggedIn() {
    if (this.authService.isAuthenticated()) {
      let roles = this.authService.getUserRoles()?.split(',');
      this.permissionsService.loadPermissions(roles as string[]);
      this.router.navigate(['homeNavbar'], {});
    }
  }

  // private prepareResolverData() {
  //   let requestGuid = uuid.v4();
  //   this.sharedService.captchaRequestKey = requestGuid;
  //   this.secObj.requestKey = this.sharedService.captchaRequestKey;

  //   this.sharedService.getCaptcha(requestGuid).subscribe((data: any) => {
  //     if (data) {
  //       this.secObj.imageUrl = 'data:image/png;base64,' + (data.img || data);
  //     }
  //   });
  // }

  private prepareRefreshTokenTimer() {
    this.tokenExpireInterval = setInterval(() => {
      let refreshToken = this.authService.getRefreshToken() as string;
      let authToken = this.authService.getAuthorizationToken() as string;

      let tokenExpiry = this.authService.getTokenExpiry();
      if (tokenExpiry) {
        // Refresh Token if expiry time remain 3 minute
        let now = new Date();
        var diffMs = tokenExpiry.getTime() - now.getTime();
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        if (diffMins <= 3) {
          // Refresh token
          this.sharedService.refresh(authToken, refreshToken).subscribe(
            (res: any) => {
              if (res) {
                this.authService.setAuthorizationToken(res.token);
                this.authService.setRefreshToken(res.refreshToken);
              }
            },
            (error) => {
              this.permissionsService.flushPermissions();
              this.authService.resetCredentials();
              this.router.navigate(['login'], {});
              this.modalService.dismissAll();
            }
          );
        }
      } else {
        // Token expired. Session Timeout.
        clearInterval(this.tokenExpireInterval);
        this.permissionsService.flushPermissions();
        this.authService.resetCredentials();
        this.router.navigate(['login'], {});
        this.modalService.dismissAll();
      }
    }, 1000 * 90); // 1.5 minute
  }

  //#endregion
}
