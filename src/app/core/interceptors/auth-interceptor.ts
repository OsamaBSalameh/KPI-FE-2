import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, of, throwError } from "rxjs";
import { AuthService } from "../auth-service/auth-service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private auth: AuthService,
        private router: Router) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401 || err.status === 403) {
            this.router.navigateByUrl(`/homeNavbar`);
            return of(err.message);
        }
        return throwError(() => err);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.auth.getAuthorizationToken();
        // const userRole = this.auth.getUserRole()
        // const userId = this.auth.getUserId()

        // const authReq = req.clone({ setHeaders: { Role: `${userRole}`, UserId: `${userId}`, Authorization: "Bearer " + authToken } });
        const authReq = req.clone({ setHeaders: { Authorization: "Bearer " + authToken } });
        return next.handle(authReq).pipe(catchError(err => this.handleAuthError(err)));
    }
} 