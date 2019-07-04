import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


// MODULES
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManiobrasComponent } from './maniobras/maniobras.component';
import { TransitoComponent } from './transito/transito.component';
import { IngresoCamionComponent } from './transito/ingreso_camion.component';
import { ManiobraComponent } from './maniobras/maniobra.component';
// import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario.component';
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
import { SolicitudesDescargasComponent } from './solicitudDescarga/solicitudes-descargas.component';
import { SolicitudDescargaComponent } from './solicitudDescarga/solicitudDescarga.component';
import { FotosComponent } from './fotos/fotos.component';
import { NgDropFilesDirective } from '.././directives/ng-drop-files.directive';
import { EmpresaComponent } from './empresa/empresa.component';
import { MisclientesComponent } from './misclientes/misclientes.component';
import { MiclienteComponent } from './misclientes/micliente.component';
import { ApprovalPageComponent } from './approval-page/approval-page.component';
import { ContenedoresDisponiblesComponent } from './contenedores-disponibles/contenedores-disponibles.component';
import { ContenedoresRLComponent } from './contenedores-rl/contenedores-rl.component';
import { ReporteContenedoresRLComponent } from './reporte-contenedores-rl/reporte-contenedores-rl.component';
import { BuquesComponent } from './buques/buques.component';
import { BuqueComponent } from './buques/buque.component';
import { SolicitudesDComponent } from './approval-page/solicitudes-d.component';
// Pipes Modulos
import { PipesModule } from '../pipes/pipes.module';
// import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';


import {
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule
  } from '@angular/material';


@NgModule({
    declarations: [
        // PagesComponent,
        DashboardComponent,
        UsuariosComponent,
        UsuarioComponent,
        ManiobrasComponent,
        TransitoComponent,
        IngresoCamionComponent,
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
        SolicitudesDescargasComponent,
        SolicitudDescargaComponent,
        EmpresaComponent,
        MisclientesComponent,
        MiclienteComponent,
        ApprovalPageComponent,
        ContenedoresDisponiblesComponent,
        ContenedoresRLComponent,
        ReporteContenedoresRLComponent,
        BuquesComponent,
        BuqueComponent,
        SolicitudesDComponent
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
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatRadioModule,
        MatStepperModule
    ]
    })

export class PagesModules {}
