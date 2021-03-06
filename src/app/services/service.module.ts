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
    MermaService,
    DetalleMaterialService,
    ProveedorService,
    MantenimientoService,
    AlmacenService,
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
      DetalleMaterialService,
      ModalUploadService,
      ModalDropzoneService,
      LoginGuard,
      VerificaTokenGuard,
      RefreshTokenInterceptor,
      REIMGuard,
      ProveedorService,
      EntradaService,
      MermaService,
      MantenimientoService,
      AlmacenService
    ],
    declarations: []
  })
  export class ServiceModule { }
