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
    VigenciaService,
    CamionService,
    OperadorService,
    ClienteService,
    ManiobraService,
    ViajeService,
    SolicitudService,
    SubirArchivoService,
    TiposContenedoresService,
    ExcelService,
    MaterialService,
    UnidadService,
    EntradaService,
    ProveedorService,
    LoginGuard,     
    VerificaTokenGuard,
    REIMGuard,
    RefreshTokenInterceptor,
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
      VigenciaService,
      CamionService,
      OperadorService,
      ClienteService,
      ManiobraService,
      ViajeService,
      SolicitudService,
      SubirArchivoService,
      TiposContenedoresService,
      ExcelService,
      MaterialService,
      UnidadService,
      ProveedorService,
      EntradaService,
      ModalUploadService,
      ModalDropzoneService,
      LoginGuard,
      VerificaTokenGuard,
      RefreshTokenInterceptor,
      REIMGuard,
      ProveedorService
    ],
    declarations: []
  })
  export class ServiceModule { }
