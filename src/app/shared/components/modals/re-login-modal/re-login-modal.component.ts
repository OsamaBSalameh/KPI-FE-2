import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from 'src/app/core/auth-service/auth-service';

@Component({
  selector: 'app-re-login-modal',
  templateUrl: './re-login-modal.component.html',
  styleUrls: ['./re-login-modal.component.css']
})
export class ReLoginModalComponent implements OnInit {

  @Input() modal: any;

  myInterval: any
  myTime = 6
  myTimeOriginalValue = 6

  constructor(
    private authService: AuthService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.myInterval = setInterval(() => {
      if (this.myTime > 0) this.myTime = this.myTime - 1
      else {
        clearInterval(this.myInterval)
        this.close()
        this.logout()
      }
    }, 1000);
  }

  logout() {
    this.permissionsService.flushPermissions()
    this.authService.resetCredentials()
    this.router.navigate(['login'], {})
  }

  private close() { this.modal?.modalReference.close() }

}
