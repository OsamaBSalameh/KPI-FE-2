import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { User } from '../../entities/users/user';
import { NotificationService } from '../../services/notification.service';
import { Notification } from 'src/app/shared/entities/notification';
import { NotificationTypeEnum } from '../../enums/notification-type';
import { SharedService } from '../../services/shared.service';
import { MessageService } from '../../services/messages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  //#region Variables

  currentUser: User = new User();

  notifications: Notification[] = [];

  messagesCount: number = 0;
  isDarkMode = false;

  //#endregion

  //#region Constructor

  constructor(
    private authService: AuthService,
    private permissionsService: NgxPermissionsService,
    private notificationService: NotificationService,
    private router: Router,
    private sharedService: SharedService,
    private messageService: MessageService
  ) {
    this.sharedService.onHeaderNotificationUpdate.subscribe((data: any) => {
      if ((this.currentUser.id as number) != null) this.initNotifications();
    });
  }

  ngOnInit(): void {
    this.initUser();
    this.initNotifications();
    this.getMyNewMessages();
    this.initTheme();
  }

  ngOnDestroy(): void {}

  //#endregion

  //#region Events

  logout() {
    this.sharedService.logout().subscribe({
      error: () => {
        this.sharedService.errorToaster('Faild to logout');
      },
      next: (res: any) => {
        this.permissionsService.flushPermissions();
        this.authService.resetCredentials();
        this.router.navigate(['login'], {});
      },
    });
  }

  seeNotification(notification: Notification) {
    this.makeNotificationSeen(notification.id as number);
    switch (notification.type) {
      case NotificationTypeEnum.UnitKPIRequest:
        this.router.navigate(['kpi/request-list'], {});
        break;

      case NotificationTypeEnum.UnitKPI:
        this.router.navigate(['kpi/value-reports'], {});
        break;

      case NotificationTypeEnum.AchievedUnitKPI:
        this.router.navigate(['kpi/achieved-kpis'], {});
        break;

      default:
        break;
    }
  }

  getMyNewMessages() {
    this.messageService.getMyNewMessagesCount().subscribe((res: any) => {
      this.messagesCount = res;
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
  }

  //#endregion

  //#region Private

  private initUser() {
    this.currentUser = this.authService.getUserInfo();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('kpi-theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem('kpi-theme', isDark ? 'dark' : 'light');
  }

  private initNotifications() {
    this.notificationService
      .getByReciverId(this.currentUser.id as number)
      .subscribe((res: any) => {
        this.notifications = res;

        this.notifications.forEach((notification) => {
          let date1 = new Date(notification.createdAt as Date);
          let date2 = new Date();

          let minutes = (date2.getTime() - date1.getTime()) / (1000 * 60);
          let hours = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
          let days =
            (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);

          notification.dateCalculation =
            minutes > 60
              ? hours > 24
                ? `about ${Math.trunc(days)} days`
                : `about ${Math.trunc(hours)} hours`
              : `${Math.trunc(minutes)} minutes`;
        });
      });
  }

  private makeNotificationSeen(notificationId: number) {
    this.notificationService
      .makeNotificationSeen(notificationId)
      .subscribe((res: any) => {
        this.initNotifications();
      });
  }

  //#endregion
}
