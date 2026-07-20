import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService implements OnInit, OnDestroy {
  httpOptions: any;
  protected apiUrl = environment.BASE_URL + 'Messages';

  //#region Constructor

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/octet-stream',
        // 'Authorization': "my-auth-token"
      }),
    };
  }

  ngOnInit(): void {}

  ngOnDestroy() {}

  //#endregion

  //#region Custom

  public getAll() {
    return this.http.get(`${this.apiUrl}`, {
      headers: this.httpOptions,
    });
  }

  public AddMessage(content: string, reciverId: number) {
    return this.http.post(`${this.apiUrl}`, {
      content: content,
      receiverId: reciverId,
    });
  }

  public getLastMessagesWithUnSeenCount() {
    return this.http.get(`${this.apiUrl}/GetLastMessagesWithUnSeenCount`, {
      headers: this.httpOptions,
    });
  }

  public getMessagesWithExactUser(userId: number) {
    return this.http.get(`${this.apiUrl}/GetMessagesWithExactUser/${userId}`, {
      headers: this.httpOptions,
    });
  }

  public getMyNewMessagesCount() {
    return this.http.get(`${this.apiUrl}/GetMyNewMessagesCount`, {
      headers: this.httpOptions,
    });
  }
  //#endregion

  //#region Shared
  public successToaster(data: string): void {
    this.toastrService.success(data);
  }

  public errorToaster(data: string): void {
    this.toastrService.error(data);
  }
  
  public warningToaster(data: string): void {
    this.toastrService.warning(data);
  }
  //#endregion
}
