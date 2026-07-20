import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base-service/base-service';
import { Notification } from 'src/app/shared/entities/notification'

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<Notification> implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    super(http, toastr);

    this.apiUrl = this.apiUrl + 'Notifications'
  }

  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion


  //#region Custom

  public getByReciverId(reciverId: number) {
    return this.http.get(`${this.apiUrl}/GetByReciverId/${reciverId}`, { headers: this.httpOptions })
  }

  public makeNotificationSeen(notificationId: number) {
    return this.http.put<any>(`${this.apiUrl}/MakeNotificationSeen`, notificationId);
  }

  public deleteByReceiver(receiverId: number) {
    return this.http.delete<void>(`${this.apiUrl}/DeleteByReceiver/${receiverId}`);
  }

  //#endregion

}
