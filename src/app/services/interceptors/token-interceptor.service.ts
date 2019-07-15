import { UsuarioService } from '../usuario/usuario.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(public _usuarioService: UsuarioService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this._usuarioService.getToken();
    // modify request
    if (token) {
      request = request.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });
  }

    //console.log(request);

     return next.handle(request)
     .pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          console.log('Check Your Internet Connection And Try again Later');
        } else if (err instanceof HttpErrorResponse && err.status === 404) {
          // auth.setToken(null);
          // this.router.navigate(['/login']);
          this._usuarioService.logout();
                location.reload(true);
        }
        return throwError(err);
      })
    );

   }


}

