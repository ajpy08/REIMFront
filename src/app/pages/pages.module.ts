import { InventarioMaterialComponent } from './almacen/inventarioMaterial/inventarioMaterial.component';
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
import { AprobarCargaComponent, BLBookingDialog } from './solicitudes/aprobar_carga.component';
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
import { LiberacionBLComponent } from './liberacion-bl/liberacion-bl.component';
import { LiberacionesBLComponent } from './liberacion-bl/liberaciones-bl.component';


import { RegisterComponent } from './register/register.component';
// Pipes Modulos
import { PipesModule } from '../pipes/pipes.module';
// import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
// PRUEBAS -------------------------------------------------------------------
import { HttpClientModule } from '@angular/common/http';
import { PaginatorEspañol } from './buques/paginator-español';
import { NgxPrintModule } from 'ngx-print';
import { NgxGalleryModule } from 'ngx-gallery';
import { QRCodeModule } from 'angularx-qrcode';
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
    MatBadgeModule,
    MatTooltipModule
} from '@angular/material';
import { DetalleManiobraComponent } from './detalle-maniobra/detalle-maniobra.component';
import { AsignarFacturaComponent } from '../dialogs/asignar-factura/asignar-factura.component';
import { ImpuestosCFDIComponent } from './../dialogs/impuestos-cfdi/impuestos-cfdi.component';
import { ManiobrasCFDIComponent } from './../dialogs/maniobras-cfdi/maniobras-cfdi.component';
import { FacturacionManiobrasComponent } from './maniobras/facturacion-maniobras/facturacion-maniobras.component';
import { ManiobrasDiarioComponent } from './maniobras/maniobras-diario/maniobras-diario.component';
import { TiposContenedoresComponent } from './tipos-contenedores/TiposContenedoresComponent';
import { TipoContenedoresComponent } from './tipos-contenedores/tipo-contenedores.component';
import { MapaComponent } from './mapa/mapa.component';
import { AprobacionesBkComponent } from './liberacion-bl/aprobaciones-bk/aprobaciones-bk.component';
import { AprobacionTBKComponent } from './liberacion-bl/aprobaciones-bk/aprobacion-tbk/aprobacion-tbk.component';
import { AsignacionTransportistaComponent } from './liberacion-bl/aprobaciones-bk/asignacion-transportista/asignacion-transportista.component';
import { InfoDialogComponent } from '../dialogs/info-dialog/info-dialog.component';
import { StatusComponent } from './usuarios/status/status.component';
import { ProductosServiciosComponent } from './facturacion/productos-servicios/productos-servicios.component';
import { ProductoServicioComponent } from './facturacion/productos-servicios/producto-servicio.component';
import { CFDISComponent } from './facturacion/cfdis/cfdis.component';
import { CFDIComponent } from './facturacion/cfdis/cfdi.component';
import { ClaveProductosServiciosComponent } from './facturacion/clave-productos-servicios/clave-productos-servicios.component';
import { ClaveProductosServicioComponent } from './facturacion/clave-productos-servicios/clave-productos-servicio.component';
import { ClaveUnidadComponent } from './facturacion/clave-unidades/clave-unidad.component';
import { ClaveUnidadesComponent } from './facturacion/clave-unidades/clave-unidades.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ManiobrasTrasportistaComponent } from './maniobras-Reporte/maniobras-reporte.component';
import { PdfFacturacionComponent } from './facturacion/pdf-facturacion/pdf-facturacion.component';
import { NotasDeCreditoComponent } from './facturacion/notas-de-credito/notas-de-credito.component';
import { NotaDeCreditoComponent } from './facturacion/notas-de-credito/nota-de-credito.component';
import { PdfNotasDeCreditoComponent } from './facturacion/pdf-notas-de-credito/pdf-notas-de-credito.component';
import {ImageCropperComponent} from 'ng2-img-cropper';
import { FacturasPpdComponent } from './facturacion/complemento-pago/facturas-ppd/facturas-ppd.component';
import { ComplementosPagoComponent } from './facturacion/complemento-pago/complementos-pago.component';
import { DocumentoRelacionadoComponent } from './facturacion/dialogs/documento-relacionado/documento-relacionado.component';
import { DetallePagoComponent } from '../dialogs/detalle-pago/detalle-pago.component';
import { ComplementoPagoComponent } from './facturacion/complemento-pago/complemento-pago.component';
import { VigenciasComponent } from './vigencias/vigencias.component';
import { VigenciaComponent } from './vigencias/vigencia.component';
import { PagoComponent } from './facturacion/complemento-pago/pago/pago.component';
import { MaterialesComponent } from './almacen/materiales/materiales.component';
import { MaterialComponent } from './almacen/materiales/material.component';
import { EntradasComponent } from './almacen/entradas/entradas.component';
import { EntradaComponent } from './almacen/entradas/entrada.component';
import { DetalleComponent } from './almacen/entradas/detalle.component';
import { DetalleMermaComponent } from './almacen/mermas/detalleMerma.component';

import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedorComponent } from './proveedores/proveedor.component';

import { MantenimientosComponent } from './maniobras/mantenimientos/mantenimientos.component';
import { MantenimientoComponent } from './maniobras/mantenimientos/mantenimiento.component';
import { Fotos2Component } from './maniobras/mantenimientos/fotos2.component';


import { FaltantesMaterialComponent } from './almacen/faltantes-material/faltantes-material.component';
import { ReporteMovimientosComponent } from './almacen/reporte-movimientos/reporte-movimientos.component';
import { MermasComponent } from './almacen/mermas/mermas.component';
import { MermaComponent } from './almacen/mermas/merma.component';
import { GradoComponent } from './maniobras/grado.component';


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
        BLBookingDialog,
        InfoDialogComponent,
        ImpuestosCFDIComponent,
        ManiobrasCFDIComponent,
        FacturacionManiobrasComponent,
        ManiobrasDiarioComponent,
        TiposContenedoresComponent,
        TipoContenedoresComponent,
        MapaComponent,
        LiberacionBLComponent,
        LiberacionesBLComponent,
        AprobacionesBkComponent,
        AprobacionTBKComponent,
        AsignacionTransportistaComponent,
        StatusComponent,
        ProductosServiciosComponent,
        ProductoServicioComponent,
        CFDIComponent,
        CFDISComponent,
        ClaveProductosServiciosComponent,
        ClaveProductosServicioComponent,
        ClaveUnidadComponent,
        ClaveUnidadesComponent,
        ReportesComponent,
        ManiobrasTrasportistaComponent,
        PdfFacturacionComponent,
        FacturasPpdComponent,
        ComplementosPagoComponent,
        NotasDeCreditoComponent,
        NotaDeCreditoComponent,
        PdfNotasDeCreditoComponent,
        ImageCropperComponent,
        DetallePagoComponent,
        DocumentoRelacionadoComponent,
        ComplementoPagoComponent,
        VigenciasComponent,
        VigenciaComponent,
        PagoComponent,
        FacturasPpdComponent,
        MaterialesComponent,
        MaterialComponent,
        InventarioMaterialComponent,
        FaltantesMaterialComponent,
        EntradasComponent,
        EntradaComponent,
        DetalleComponent,
        DetalleMermaComponent,
        ProveedorComponent,
        ProveedoresComponent,
        MantenimientosComponent,
        MantenimientoComponent,
        Fotos2Component,
        FaltantesMaterialComponent,
        ReporteMovimientosComponent,
        MermasComponent,
        MermaComponent,
        GradoComponent
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
        MatBadgeModule,
        MatTooltipModule,
        QRCodeModule
    ],
    providers: [{ provide: MatPaginatorIntl, useClass: PaginatorEspañol }],
    entryComponents: [AsignarFacturaComponent, BLBookingDialog, InfoDialogComponent, ImpuestosCFDIComponent, ManiobrasCFDIComponent, PdfFacturacionComponent,
        PdfNotasDeCreditoComponent, NotasDeCreditoComponent, DetallePagoComponent, DocumentoRelacionadoComponent, PagoComponent, FacturasPpdComponent,
        DetalleComponent, DetalleMermaComponent, GradoComponent, MantenimientoComponent ]
})

export class PagesModules { }
