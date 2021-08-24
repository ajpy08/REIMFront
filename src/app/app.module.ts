import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';

// RUTAS
import { APP_ROUTES } from './app.routes';

// Servicios
import { ServiceModule } from './services/service.module';

// Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { PagesModules } from './pages/pages.module';

// temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportAsModule } from 'ngx-export-as';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from './shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {
  RefreshTokenInterceptor,
  UsuarioService
} from './services/service.index';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { RegistroComponent } from './registro/registro.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatSnackBarModule,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material';




import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { Id_sentry } from '../app/config/config';
import { Usuario } from './pages/usuarios/usuario.model';
import { ValidationService } from './pages/facturacion/validation.service';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    Sentry.init({
      dsn: Id_sentry
    });

    const user = JSON.parse(localStorage.getItem('usuario')) || '';
    // console.log(user);
    if (user !== '') {
      Sentry.configureScope(function (scope) {
        scope.setUser({
          nombre: user.nombre,
          email: user.email,
          roles: user.role,
          empresas: user.empresas
        });
      });
    }
  }

  handleError(error) {
    /* #region  Borrar esto si falla probando para revisar error de chuck */
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (error.message && chunkFailedMessage.test(error.message)) {
      window.location.reload();
    } else {
      const credenciales = 'Credenciales incorrectas';
      if (error.error.mensaje && !error.error.mensaje.includes(credenciales)) {
        Sentry.captureException(error.originalError || error);
      }
    }
    /* #endregion */

    // Sentry.captureException(error.originalError || error);
  }
}


export function getErrorHandler(): ErrorHandler {

  if (environment.production) {
    // Entra Sentry en acción
    // return new ErrorHandler();
    return new SentryErrorHandler();
  }
  // Excepciones locales
  return new ErrorHandler();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PagesComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    APP_ROUTES,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule,
    MatFormFieldModule,
    Ng2ImgMaxModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatStepperModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    ExportAsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useFactory: getErrorHandler },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    ValidationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

