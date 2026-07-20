import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { User } from 'src/app/shared/entities/users/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.css']
})
export class ProfileManagerComponent implements OnInit, OnDestroy {


  //#region Variables

  currentUser: User = new User()
  currentUserId: number = 0;

  //#endregion


  //#region Constructor 

  constructor(
    private usersService: UserService,
    private authService: AuthService
  ) {
  }

  ngOnDestroy(): void {
  }

  async ngOnInit(): Promise<void> {
    await this.initCurrentUser()
    this.getUserInformation()
  }

  //#endregion


  //#region Events

  getPaginatedValues() { }

  //#endregion


  //#region Private

  private async initCurrentUser() { this.currentUserId = Number.parseInt(this.authService.getUserId() as string) }

  private getUserInformation() {
    this.usersService.getCurrentUserInfo().subscribe((res: any) => {
      this.currentUser = new User(res);
    })
  }

  //#endregion
}
