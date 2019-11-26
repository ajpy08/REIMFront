import { NgModule } from '@angular/core';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


// MODULES
import { DashboardComponent } from './dashboard/dashboard.component';
// import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';

// Catalogos Generales
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuarios/usuario.component';
import { UsuarioResetPassComponent } from './usuarios/resetPass.component';

import { ReparacionesComponent } from './reparaciones/reparaciones.component';
import { ReparacionComponent } from './reparaciones/reparacion.component';

import { NavierasComponent } from './navieras/navieras.component';
import { NavieraComponent } from './navieras/naviera.component';

import { AgenciasComponent } from './agencias/agencias.component';
import { AgenciaComponent } from './agencias/agencia.component';

import { TransportistasComponent } from './transportistas/transportistas.component';
import { TransportistaComponent } from './transportistas/transportista.component';

import { BuquesComponent } from './buques/buques.component';
import { BuqueComponent } from './buques/buque.component';



import { OperadoresComponent } from './operadores/operadores.component';
import { OperadorComponent } from './operadores/operador.component';

import { CamionesComponent } from './camiones/camiones.component';
import { CamionComponent } from './camiones/camion.component';

////////////////////////////////////////


/////////////////////  M A N I O B R A S  ////////////////////////////////////
import { ManiobrasComponent } from './maniobras/maniobras.component';
import { LlegadaEntradaComponent } from './maniobras/1llegada_entrada/llegada_entrada.component';
import { RevisarComponent } from './maniobras/2revisar/revisar.component';
import { TerminaLavadoReparacionComponent } from './maniobras/3terminar_lavado_reparacion/termina_lavado_reparacion.component';
import { CargaContenedorComponent } from './maniobras/4x_cargar/carga_contenedor.component';
import { InventarioComponent } from './maniobras/5inventario/inventario.component';



import { VaciosComponent } from './maniobras/vacios.component';
import { ManiobraComponent } from './maniobras/maniobra.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './clientes/cliente.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ViajesComponent } from './viajes/viajes.component';
import { ViajeComponent } from './viajes/viaje.component';



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


import { ReporteContenedoresRLComponent } from './reporte-contenedores-rl/reporte-contenedores-rl.component';

import { PapeletaComponent } from './maniobras/papeleta/papeleta.component';

import { ContenedoresLRComponent } from './contenedores-lr/contenedores-lr.component';


import { RegisterComponent } from './register/register.component';
// Pipes Modulos
import { PipesModule } from '../pipes/pipes.module';
// import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
// PRUEBAS -------------------------------------------------------------------
import { HttpClientModule } from '@angular/common/http';
import { PaginatorEspañol } from './buques/paginator-español';
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
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatListModule,
    MatBadgeModule
} from '@angular/material';
import { DetalleManiobraComponent } from './detalle-maniobra/detalle-maniobra.component';
import { AsignarFacturaComponent } from './maniobras/asignar-factura/asignar-factura.component';
import { FacturacionManiobrasComponent } from './maniobras/facturacion-maniobras/facturacion-maniobras.component';
import { ManiobrasDiarioComponent } from './maniobras/maniobras-diario/maniobras-diario.component';
import { TiposContenedoresComponent } from './tipos-contenedores/TiposContenedoresComponent';
import { TipoContenedoresComponent } from './tipos-contenedores/tipo-contenedores.component';
@NgModule({
    declarations: [
        // PagesComponent,
        DashboardComponent,
        AccountSettingsComponent,
        ProfileComponent,
        UsuariosComponent,
        UsuarioComponent,
        UsuarioResetPassComponent,
        ReparacionesComponent,
        ReparacionComponent,
        NavierasComponent,
        NavieraComponent,
        AgenciasComponent,
        AgenciaComponent,
        TransportistasComponent,
        TransportistaComponent,
        BuquesComponent,
        BuqueComponent,
        OperadoresComponent,
        OperadorComponent,
        CamionesComponent,
        CamionComponent,
        ManiobrasComponent,
        LlegadaEntradaComponent,
        RevisarComponent,
        TerminaLavadoReparacionComponent,
        CargaContenedorComponent,
        InventarioComponent,        
        VaciosComponent,
        ManiobraComponent,
        ClientesComponent,
        ClienteComponent,
        ViajesComponent,
        ViajeComponent,
        BusquedaComponent,
        FotosComponent,
        NgDropFilesDirective,
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
        ReporteContenedoresRLComponent,
        RegisterComponent,
        PapeletaComponent,        
        ContenedoresLRComponent,        
        DetalleManiobraComponent, 
        AsignarFacturaComponent, 
        FacturacionManiobrasComponent,
        ManiobrasDiarioComponent,
        TiposContenedoresComponent,
        TipoContenedoresComponent
        
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
        MatExpansionModule,
        MatDialogModule,
        NgxPrintModule,
        NgxGalleryModule,
        MatListModule,
        MatBadgeModule
    ],
    providers: [{ provide: MatPaginatorIntl, useClass: PaginatorEspañol }],
    entryComponents: [AsignarFacturaComponent]
})

export class PagesModules { }
