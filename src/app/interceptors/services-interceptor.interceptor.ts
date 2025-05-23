import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, delay, finalize, map, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ServicesInterceptorInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService,
    private authService: AuthService,
    private msg: NzMessageService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler):
    Observable<HttpEvent<unknown>> {
      const token = localStorage.getItem('Authorization');
      const headers = {};

      if (token) {
        headers['Authorization'] = token;
      }

      //console.log(this.cookieService.get('Authorization'));
      localStorage.getItem('Authorization');
    const authRequest = request.clone({
      setHeaders: headers
    });

    return next.handle(authRequest).pipe(
      delay(0),
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: any) => {
        //console.log('error--->>>', error);
        var tipoError: number = error.status;
        var errorMsg: string = '';
        switch (tipoError) {
          case 401:
            errorMsg = 'Sesion terminada favor de iniciar sesion.';
            //this.authService.logout();
            break;
          case 400:
            errorMsg = error.error;
            //this.authService.logout();
            break;
          default:
            errorMsg = 'Ocurrio un error inesperado';
            break;
        }

        this.msg.error(errorMsg);
        return throwError(error);
      }),
      finalize(() => {
        //console.log('terminado');
      }));;
  }


}
