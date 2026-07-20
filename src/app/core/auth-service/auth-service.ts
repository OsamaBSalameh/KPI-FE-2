import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/entities/users/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  userJson: string = '';
  userRole: string = '';
  user: User | undefined;

  currentUserImage: string = (this.getUserInfo() as User)
    ?.profilePicturePath as string; // Should be changed later to prevent the browser from going back to old picture path
  private userImageSubject = new BehaviorSubject<string>(this.currentUserImage);

  getAuthorizationToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh-token');
  }

  setAuthorizationToken(AuthorizationToken: string) {
    localStorage.setItem('token', AuthorizationToken);
  }

  setRefreshToken(AuthorizationToken: string) {
    localStorage.setItem('refresh-token', AuthorizationToken);
  }

  setUserRoles(Roles: string[]) {
    return localStorage.setItem('userRoles', Roles.toString());
  }

  setUserRole(Role: string) {
    return localStorage.setItem('userRole', Role);
  }

  // getUserRole() { return localStorage.getItem('userRole') }

  getUserRoles() {
    return localStorage.getItem('userRoles');
  }

  setUserId(id: string) {
    return localStorage.setItem('userId', id);
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  public isAuthenticated(): boolean {
    return this.getAuthorizationToken() ? true : false;
  }

  private getUserStorage(): string {
    return localStorage.getItem('userInfo') as string;
  }

  public setUserStorage(user: User): void {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public setThumbnailPhoto(img: string):void{
    localStorage.setItem('thumbnailPhoto', 'data:image/png;base64' + JSON.stringify(img));
  }

  public getThumbnailPhoto(): string{
    return localStorage.getItem('thumbnailPhoto') as string;
  }

  // In this way we make sure that the user information are up to date
  public setUserDataStorage(user: User): void {
    let userInfoStorage = JSON.parse(this.getUserStorage());
    userInfoStorage.user = user;
    this.setUserStorage(userInfoStorage);
  }

  public getUserInfo() {
    this.userJson = this.getUserStorage();
    let info = JSON.parse(this.userJson);
    if (this.userJson) return info.user;
    return null;
  }

  public resetCredentials(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('refresh-token');
  }

  getUserImage(): Observable<string> {
    return this.userImageSubject;
  }

  setUserImage(userImage: string) {
    return this.userImageSubject.next(userImage);
  }

  getTokenExpiry() {
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(this.getAuthorizationToken() as string);
    return !isExpired
      ? helper.getTokenExpirationDate(this.getAuthorizationToken() as string)
      : null;
  }
}
