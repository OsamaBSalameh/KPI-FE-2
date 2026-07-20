import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { User } from '../../entities/users/user';
import { isNullOrUndefinedOrWhiteSpace } from '../../tools/base-tools';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  currentUser: User = new User()
  subscription: Subscription;
  thumbnailPhoto: String = '';

  constructor(private authService: AuthService) {
    this.subscription = this.authService.getUserImage().subscribe(value => {
      if (!isNullOrUndefinedOrWhiteSpace(value)) this.changeUserImage(value)
    });
  }

  ngOnInit(): void { this.initUser() }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  private initUser() {
    this.currentUser = new User(this.authService.getUserInfo());
    this.thumbnailPhoto =
      this.authService.getThumbnailPhoto() != null
        ? this.authService.getThumbnailPhoto()
        : this.currentUser.profilePicturePath as string;
  }

  changeUserImage(value: string) { return this.currentUser.profilePicturePath = value }

}
