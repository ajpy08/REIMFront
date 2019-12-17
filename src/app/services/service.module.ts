import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule  } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { ModalDropzoneService } from '../components/modal-dropzone/modal-dropzone.service';

import {
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    ReparacionService,
    NavieraService,
    AgenciaService,
    TransportistaService,
    BuqueService,
    CamionService,
    OperadorService,
    ClienteService,
    ManiobraService,
    ViajeService,
    SolicitudService,
    SubirArchivoService,
    TiposContenedoresService,
    ExcelService,
    LoginGuard,
    AAGuard,
    AdminGuard,
    ClienteGuard,
    NavieraGuard,
    PatioAdminGuard,
    PatioGuard,
    TransportistaGuard,
    VerificaTokenGuard,
    RefreshTokenInterceptor
   } from './service.index';


   @NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
      SettingsService,
      SharedService,
      SidebarService,
      UsuarioService,
      ReparacionService,
      NavieraService,
      AgenciaService,
      TransportistaService,
      BuqueService,
      CamionService,
      OperadorService,
      ClienteService,
      ManiobraService,
      ViajeService,
      SolicitudService,
      SubirArchivoService,
      TiposContenedoresService,
      ExcelService,
      ModalUploadService,
      ModalDropzoneService,
      LoginGuard,
      AAGuard,
      AdminGuard,
      ClienteGuard,
      NavieraGuard,
      PatioAdminGuard,
      PatioGuard,
      TransportistaGuard,
      VerificaTokenGuard,
      RefreshTokenInterceptor,
    ],
    declarations: []
  })
  export class ServiceModule { }
