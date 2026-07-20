// import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './core/auth-service/auth-service';
import { SharedService } from './shared/services/shared.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SIMAH.KPI.UI';
  private tokenExpireInterval: any;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.prepareRefreshTokenTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.tokenExpireInterval);
  }

  private prepareRefreshTokenTimer() {
    if (this.authService.getTokenExpiry() != null && this.authService.getTokenExpiry() as Date > new Date())
      this.tokenExpireInterval = setInterval(() => {
        let refreshToken = this.authService.getRefreshToken() as string;
        let authToken = this.authService.getAuthorizationToken() as string;

        let now = new Date();
        let tokenExpiry = this.authService.getTokenExpiry() as Date;

        if (tokenExpiry) {
          // Refresh Token if expiry time remain 1 minute
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
}
