import { UsuarioService } from '../usuario/usuario.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

import swal from 'sweetalert';

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

//      return next.handle(request)
//      .pipe(
//       catchError(err => {
//         if (err instanceof HttpErrorResponse && err.status === 0) {
//           console.log('Cheque su conexion a Internet e intente de nuevo');
//           swal('err11', 'Cheque su conexion a Internet e intente de nuevo', 'error');
//         } else if (err instanceof HttpErrorResponse && err.status === 404) {
//           // auth.setToken(null);
//           // this.router.navigate(['/login']);
//           this._usuarioService.logout();
//                 location.reload(true);
//         }
//         return throwError(err);
//       })
//     );
        return next.handle(request).pipe(
          // map((event: HttpEvent<any>) => {
          //     if (event instanceof HttpResponse) {
          //         console.log('event--->>>', event);
          //         // this.errorDialogService.openDialog(event);
          //     }
          //     return event;
          // }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            switch (error.status) {
              case 0:
                swal('', 'Cheque su conexion a Internet e intente de nuevo', 'error');
                // this._usuarioService.logout();
                 location.reload(true);
                break;
              case 404:
                swal(error.statusText, 'Pagina no encontrada', 'error');
                break;
              case 400:
                if(error.error.errors.message) {
                  swal('Error del servicio.', error.error.errors.message, 'error');
                } 
                if (error.error.errors.errmsg) {
                  swal('Error del servicio.', error.error.errors.errmsg, 'error');
                }
                break;
              case 500:
                swal(error.statusText, error.message, 'error');
                break;
              default:
                break;
            }
              //const er = error && error.error && error.error.reason;

              return throwError(error);
          }));
   }


}

