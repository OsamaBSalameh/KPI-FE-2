import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth-service/auth-service';
import { User } from '../../entities/users/user';
import { NotificationService } from '../../services/notification.service';
import { Notification } from 'src/app/shared/entities/notification'
import { NotificationTypeEnum } from '../../enums/notification-type';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  //#region Variables

  currentUser: User = new User()
  notifications: Notification[] = []

  //#endregion


  //#region  Constructor

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initUser()
    this.initNotifications()
  }

  //#endregion


  //#region Actions

  view(notification: Notification) {
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

  async dismiss(notification: Notification) {
    await this.makeNotificationSeen(notification.id as number);
  }

  dismissAll() {
    this.notificationService.deleteByReceiver(this.currentUser.id as number).subscribe((res: any) => {
      this.initNotifications()
      this.sharedService.updateHeaderData("")
    })
  }

  getNotificationType(messageType: number): string {
    switch (messageType) {
      case 1:
        return 'reminder';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      default:
        return 'reminder';
    }
  }

  getNotificationIcon(messageType: number): string {
    switch (messageType) {
      case 1:
        return 'fas fa-info-circle';
      case 2:
        return 'fas fa-exclamation-triangle';
      case 3:
        return 'fas fa-exclamation-circle';
      default:
        return 'fas fa-bell';
    }
  }


  //#endregion


  //#region Private

  private initUser() { this.currentUser = this.authService.getUserInfo() }

  private initNotifications() {
    this.notificationService.getByReciverId(this.currentUser.id as number).subscribe((res: any) => {
      this.notifications = res

      this.notifications.forEach(notification => {
        let date1 = new Date(notification.createdAt as Date);
        let date2 = new Date();

        let minutes = (date2.getTime() - date1.getTime()) / (1000 * 60);
        let hours = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
        let days = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);

        notification.dateCalculation = minutes > 60 ? (hours > 24 ? `about ${Math.trunc(days)} days` : `about ${Math.trunc(hours)} hours`) : `${Math.trunc(minutes)} minutes`
      });
    })
  }

  private async makeNotificationSeen(notificationId: number) {
    this.notificationService.makeNotificationSeen(notificationId).subscribe((res: any) => {
      this.initNotifications()
      this.sharedService.updateHeaderData("")
    })
  }

  //#endregion

}
