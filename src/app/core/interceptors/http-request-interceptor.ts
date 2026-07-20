import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable } from 'rxjs';
import { isNullOrUndefined } from 'src/app/shared/tools/base-tools';
import { HttpErrorTypes } from '../base-entity/base-enums';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth-service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private permissionsService: NgxPermissionsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.includes('Notifications/GetByReciverId') && !request.url.includes('Account/Refresh') && !this.spinnerService.spinnerObservable?.value?.show) {
      this.spinnerService.show(); // Osama B. Salameh: start spinner
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) this.spinnerService.hide(); // Osama B. Salameh: stop spinner

        return event;
      }),
      catchError((err) => {
        this.spinnerService.hide(); // Osama B. Salameh: reset spinner
        this.handleError(err);
        throw err;
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorTitle = 'UnkownError';

    switch (error.status) {
      case HttpErrorTypes.Status424FailedDependency:
        this.showWarning(error.error.detail, error.error.title);
        return error;

      case HttpErrorTypes.Status400_BadRequest:
        errorTitle = 'BadRequest';
        break;

      case HttpErrorTypes.Status401_Unauthorized:
        errorTitle = 'Unauthorized';
        if (error.error) this.permissionsService.flushPermissions();
        this.authService.resetCredentials();
        this.router.navigate(['login'], {});
        break;

      case HttpErrorTypes.Status403_Forbidden:
        errorTitle = 'Forbidden';
        break;

      case HttpErrorTypes.Status404NotFound:
        this.showWarning(error.error.detail, 'NotFound');
        return error;

      case HttpErrorTypes.Status405_MethodNotAllowed:
        errorTitle = 'MethodNotAllowed';
        break;

      case HttpErrorTypes.Status406_NotAcceptable:
        errorTitle = 'NotAcceptable';
        break;

      case HttpErrorTypes.Status500_InternalServerError:
        errorTitle = 'InternalServerError';
        break;

      case HttpErrorTypes.Status412PreconditionFailed:
        errorTitle = 'PreconditionFailed';
        break;

      case HttpErrorTypes.Status409Conflict:
        errorTitle = 'Identity Conflict';
        break;

      default:
        break;
    }

    if (error.status == HttpErrorTypes.Status409Conflict) {
      let errors = error.error?.detail.split(',');
      let message: string = '';

      errors.forEach((element: string) => {
        if (!isNullOrUndefined(element)) message += `, ${element}`;
      });

      message.substring(0, 1);
      this.toastr.error(message, errorTitle, { timeOut: 5000 });
    } else if (error.status == HttpErrorTypes.Status401_Unauthorized) {
      this.showError('Wrong credentials', error.error.title);
    } else if (!isNullOrUndefined(error.error?.detail)) {
      this.showError(error.error.detail, error.error.title);
    } else if (error.error?.errors != null) {
      for (let key in error.error.errors) {
        this.showError(error.error.errors[key], error.error.title);
      }
    } else if (!isNullOrUndefined(error.error)) {
      this.showError(error.error, errorTitle);
    } else this.showError('!!!', errorTitle);

    return error;
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title, { timeOut: 5000 });
  }

  showWarning(message: string, title: string) {
    this.toastr.warning(message, title, { timeOut: 5000 });
  }
}
