import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


// MODULES
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManiobrasComponent } from './maniobras/maniobras.component';

import { TransitoComponent } from './maniobras/transito_entrada/transito.component';
import { LlegadaEntradaComponent } from './maniobras/transito_entrada/llegada_entrada.component';
import { EnEsperaComponent } from './maniobras/transito_entrada/espera.component';
import { RevisionComponent } from './maniobras/revision_revisa/revision.component';
import { RevisaComponent } from './maniobras/revision_revisa/revisa.component';
import { LavadoReparacionComponent } from './maniobras/lavadoreparacion_terminar/lavado_reparacion.component';
import { TerminaLavadoReparacionComponent } from './maniobras/lavadoreparacion_terminar/termina_lavado_reparacion.component';
import { DisponiblesComponent } from './maniobras/disponibles.component';
import { XCargarComponent } from './maniobras/xcargar_cargar/xcargar.component';
import { CargaContenedorComponent } from './maniobras/xcargar_cargar/carga_contenedor.component';
import { VaciosComponent } from './maniobras/vacios.component';

import { ManiobraComponent } from './maniobras/maniobra.component';
// import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';

// Catalogos Generales
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario.component';
import { UsuarioResetPassComponent } from './usuarios/resetPass.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { OperadorComponent } from './operadores/operador.component';
import { CamionesComponent } from './camiones/camiones.component';
import { CamionComponent } from './camiones/camion.component';
import { ContenedoresComponent } from './contenedores/contenedores.component';
import { ContenedorComponent } from './contenedores/contenedor.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './clientes/cliente.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AgenciasComponent } from './agencias/agencias.component';
import { AgenciaComponent } from './agencias/agencia.component';
import { TransportistasComponent } from './transportistas/transportistas.component';
import { TransportistaComponent } from './transportistas/transportista.component';
import { ViajesComponent } from './viajes/viajes.component';
import { ViajeComponent } from './viajes/viaje.component';
import { AddcontainersComponent } from './addcontainers/addcontainers.component';
import { NavierasComponent } from './navieras/navieras.component';
import { NavieraComponent } from './navieras/naviera.component';


// solicitudes y aprobaciones
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudDescargaComponent } from './solicitudes/descarga/solicitud_descarga.component';
import { SolicitudCargaComponent } from './solicitudes/carga/solicitud_carga.component';
import { AprobarDescargaComponent } from './solicitudes/aprobar_descarga.component';
import { AprobarCargaComponent } from './solicitudes/aprobar_carga.component';
import { SolicitudesTransportistaComponent } from './solicitudes/transportista/solicitudes_transportista.component';
import { SolicitudTransportistaComponent } from './solicitudes/transportista/solicitud_transportista.component';
import { SolicitudReasignaTransportistaComponent } from './solicitudes/transportista/solicitud_reasigna_transportista.component';

import { AprobacionesComponent } from './solicitudes/aprobaciones.component';

import { FotosComponent } from './fotos/fotos.component';
import { NgDropFilesDirective } from '.././directives/ng-drop-files.directive';
import { EmpresaComponent } from './empresa/empresa.component';
import { MisclientesComponent } from './misclientes/misclientes.component';
import { MiclienteComponent } from './misclientes/micliente.component';

import { ContenedoresDisponiblesComponent } from './contenedores-disponibles/contenedores-disponibles.component';
import { ContenedoresRLComponent } from './contenedores-rl/contenedores-rl.component';
import { ReporteContenedoresRLComponent } from './reporte-contenedores-rl/reporte-contenedores-rl.component';
import { BuquesComponent } from './buques/buques.component';
import { BuqueComponent } from './buques/buque.component';
import { Buques2Component } from './buques2/buques2.component';
import { Buque2Component } from './buques2/buque2.component';
import { ReparacionesComponent } from './reparaciones/reparaciones.component';
import { ReparacionComponent } from './reparaciones/reparacion.component';

import { RegisterComponent } from './register/register.component';
// Pipes Modulos
import { PipesModule } from '../pipes/pipes.module';
// import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
// PRUEBAS -------------------------------------------------------------------
import { HttpClientModule } from '@angular/common/http';
import { PaginatorEspañol } from './buques2/paginator-español';
import { NgxPrintModule } from 'ngx-print';
import { NgxGalleryModule } from 'ngx-gallery';

import {
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorIntl,
    MatIconModule
} from '@angular/material';
import { PapeletaComponent } from './maniobras/papeleta/papeleta.component';

@NgModule({
    declarations: [
        // PagesComponent,
        DashboardComponent,
        UsuariosComponent,
        UsuarioComponent,
        UsuarioResetPassComponent,
        ManiobrasComponent,
        TransitoComponent,
        LlegadaEntradaComponent,
        EnEsperaComponent,
        RevisionComponent,
        RevisaComponent,
        LavadoReparacionComponent,
        TerminaLavadoReparacionComponent,
        DisponiblesComponent,
        XCargarComponent,
        CargaContenedorComponent,
        VaciosComponent,
        ManiobraComponent,
        AccountSettingsComponent,
        ProfileComponent,
        OperadoresComponent,
        OperadorComponent,
        CamionesComponent,
        CamionComponent,
        ContenedoresComponent,
        ContenedorComponent,
        ClientesComponent,
        ClienteComponent,
        AgenciasComponent,
        AgenciaComponent,
        TransportistasComponent,
        TransportistaComponent,
        ViajesComponent,
        ViajeComponent,
        BusquedaComponent,
        FotosComponent,
        NgDropFilesDirective,
        AddcontainersComponent,
        NavierasComponent,
        NavieraComponent,
        SolicitudesComponent,
        SolicitudDescargaComponent,
        SolicitudCargaComponent,
        AprobacionesComponent,
        AprobarDescargaComponent,
        AprobarCargaComponent,
        SolicitudesTransportistaComponent,
        SolicitudTransportistaComponent,
        SolicitudReasignaTransportistaComponent,
        EmpresaComponent,
        MisclientesComponent,
        MiclienteComponent,
        ContenedoresDisponiblesComponent,
        ContenedoresRLComponent,
        ReporteContenedoresRLComponent,
        BuquesComponent,
        BuqueComponent,
        Buques2Component,
        Buque2Component,
        RegisterComponent,
        ReparacionesComponent,
        ReparacionComponent,
        PapeletaComponent
    ],
    exports: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatRadioModule,
        MatStepperModule,
        HttpClientModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatIconModule,
        NgxPrintModule,
        NgxGalleryModule
    ],
    providers: [{ provide: MatPaginatorIntl, useClass: PaginatorEspañol }],
})

export class PagesModules { }
