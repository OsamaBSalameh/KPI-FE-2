import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseService } from '../baseComponents/service-base.service';
import { Comment } from '../entities/comment';
import { AttachmentType } from '../enums/attachment-type';

@Injectable({
  providedIn: 'root'
})
export class SharedService extends BaseService implements OnInit, OnDestroy {

  //#region Variables

  private headerNotificationUpdateSource: BehaviorSubject<any> = new BehaviorSubject<any>("");
  onHeaderNotificationUpdate = this.headerNotificationUpdateSource.asObservable();

  captchaRequestKey: string = ''
  //#endregion

  //#region Constructor

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {
    super()
  }

  override ngOnInit(): void { super.ngOnInit() }

  override ngOnDestroy() { super.ngOnDestroy() }

  //#endregion


  //#region Toaster

  public successToaster(data: string): void { this.toastr.success(data) }

  public errorToaster(data: string): void { this.toastr.error(data) }

  public infoToaster(data: string): void { this.toastr.info(data) }


  //#endregion


  //#region Groups

  public getPermissionGroupByUser(userId: number) {
    return this.httpClient.get(`${this.baseUrl}PermissionGroups/GetByUserId/${userId}`, { headers: this.httpOptions })
  }

  public getPermissionGroups() {
    return this.httpClient.get(`${this.baseUrl}PermissionGroups`, { headers: this.httpOptions })
  }

  public getAllowedPermissionsForDelegation(userId: number){
    return this.httpClient.get(`${this.baseUrl}PermissionGroups/GetAllowedPermissionsForDelegation/${userId}`, { headers: this.httpOptions })
  }

  //#endregion


  //#region Account

  public login(loginReq: any) {
    return this.httpClient.post<any>(`${this.baseUrl}Account/Login`, loginReq);
  }

  public activeDirectoryLogin(loginRequest: any) {
    return this.httpClient.post<any>(`${this.baseUrl}Account/ADLogin`, loginRequest);
  }

  public getCaptcha(guid: string) {
    return this.httpClient.get<any>(`${this.baseUrl}Captcha/GetCaptcha/${guid}`);
  }

  public refresh(token: string, refreshToken: string) {
    let refreshData = {
      token: token,
      refreshToken: refreshToken
    }

    return this.httpClient.post<any>(`${this.baseUrl}Account/Refresh`, refreshData);
  }

  public logout() {
    return this.httpClient.post<any>(`${this.baseUrl}Account/Logout`, null);
  }

  public forgotPassword(email: string) {
    let forgotPassword = {
      email: email,
      // clientURI: returnUrsl
    }

    return this.httpClient.post<any>(`${this.baseUrl}Account/ForgotPassword`, forgotPassword);
  }

  public resetPasswordByToken(email: string, token: string, password: string) {
    let data = {
      email: email,
      token: token,
      password: password
    }

    return this.httpClient.post<any>(`${this.baseUrl}Account/ResetPasswordByToken`, data);
  }

  public changeUserPassword(value: { currentPassword: string, newPassword: string, userName: string }) {
    let data = {
      currentPassword: value.currentPassword,
      newPassword: value.newPassword,
      userName: value.userName
    }

    return this.httpClient.post<any>(`${this.baseUrl}Account/ChangeUserPassword`, data);
  }

  public updatePersonalInfo(value: { id: number, firstName: string, lastName: string, phoneNumber: string, userName: string }) {
    let data = {
      id: value.id,
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
      userName: value.userName
    }

    return this.httpClient.post<any>(`${this.baseUrl}Account/UpdatePersonalInfo`, data);
  }

  //#endregion


  //#region Lookups

  public getStrategyStatuses() {
    return this.httpClient
      .get(`${this.baseUrl}Lookups/GetStrategyStatuses`, { headers: this.httpOptions })
  }

  public getMeasurmentUnits() {
    return this.httpClient
      .get(`${this.baseUrl}Lookups/GetMeasurmentUnits`, { headers: this.httpOptions })
  }

  public getKPIData() {
    return this.httpClient
      .get(`${this.baseUrl}Lookups/GetKPIData`, { headers: this.httpOptions })
  }

  //#endregion


  //#region Shared

  public getTags() {
    return this.httpClient.get(`${this.baseUrl}Tags`, { headers: this.httpOptions })
  }

  public getAllStrategies() {
    return this.httpClient.get(`${this.baseUrl}Strategies`, { headers: this.httpOptions })
  }

  public getAllByWorkSpace() {
    return this.httpClient.get(`${this.baseUrl}Strategies/GetAllByWorkSpace`, { headers: this.httpOptions })
  }

  public getUnits() {
    return this.httpClient.get(`${this.baseUrl}Units`, { headers: this.httpOptions })
  }

  public updateHeaderData(message: any) {
    this.headerNotificationUpdateSource.next(message);
  }

  //#endregion


  //#region Comments

  public getUnitKPIComments(kpiCopyId: number,unitKpiId: number) {
    return this.httpClient
      .get(`${this.baseUrl}Comments/ByKPICopy/${kpiCopyId}/${unitKpiId}`, { headers: this.httpOptions })
  }

  public addComment(comment: Comment) {
    return this.httpClient.post<Comment>(`${this.baseUrl}Comments`, comment);
  }

  //#endregion


  //#region Attachments

  public getAttachments() {
    return this.httpClient
      .get(`${this.baseUrl}Attachments`, { headers: this.httpOptions })
  }

  public getByAttachedIdAsync(unitKpiId: number) {
    return this.httpClient
      .get(`${this.baseUrl}Attachments/GetByAttachedId/${unitKpiId}`, { headers: this.httpOptions })
  }

  public getByTypeAndAttachedIdAsync(type: AttachmentType, unitKpiId: number) {
    return this.httpClient
      .get(`${this.baseUrl}Attachments/ByTypeAndAttachedId/${type}/${unitKpiId}`, { headers: this.httpOptions })
  }

  public getByTypeAndAttachedAndRequestAsync(type: AttachmentType, unitKpiId: number, unitKPIRequestId: number) {
    return this.httpClient
      .get(`${this.baseUrl}Attachments/ByTypeAndAttachedAndRequestAsync/${type}/${unitKpiId}/${unitKPIRequestId}`, { headers: this.httpOptions })
  }

  public uploadAttachments(files: File[], type: AttachmentType, attachedToId: number, unitKPIRequestId: number | undefined) {
    let formData = this.appendFiles(files, type, attachedToId, unitKPIRequestId);

    return this.httpClient.post(`${this.baseUrl}Attachments`, formData)
  }

  public deleteAttachment(id: number) {
    return this.httpClient
      .delete(`${this.baseUrl}Attachments/${id}`, { headers: this.httpOptions })
  }

  public getBlob(url: string) {
    return this.httpClient.get(url, { responseType: "blob" })
  }

  private appendFiles(files: File[], type: AttachmentType, attachedToId: number, unitKPIRequestId: number | undefined) {
    let formData: FormData = new FormData()
    formData.append('type', type.toString());
    formData.append('attachedToId', attachedToId.toString());
    if(unitKPIRequestId != undefined) formData.append('unitKPIRequestId', unitKPIRequestId.toString());

    files.forEach(file => {
      formData.append(`files`, file, file.name);
    });
    return formData;
  }

  //#endregion

}
