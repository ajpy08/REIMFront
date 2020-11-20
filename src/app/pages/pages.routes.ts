import { ProveedorComponent } from './proveedores/proveedor.component';
import { VigenciaComponent } from './vigencias/vigencia.component';
import { VigenciasComponent } from './vigencias/vigencias.component';
import { ComplementoPagoComponent } from './facturacion/complemento-pago/complemento-pago.component';
import { ComplementosPagoComponent } from './facturacion/complemento-pago/complementos-pago.component';
import { CFDIComponent } from './facturacion/cfdis/cfdi.component';
import { CFDISComponent } from './facturacion/cfdis/cfdis.component';
import { ProductoServicioComponent } from './facturacion/productos-servicios/producto-servicio.component';
import { ProductosServiciosComponent } from './facturacion/productos-servicios/productos-servicios.component';
import { StatusComponent } from './usuarios/status/status.component';
/* #region  IMPORTS */
import { RouterModule, Routes } from '@angular/router';
// import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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

//////////////////////////// LIBERACIONES BLBOOKING /////////////////////////

////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
import { ManiobrasComponent } from './maniobras/maniobras.component';
import { LlegadaEntradaComponent } from './maniobras/1llegada_entrada/llegada_entrada.component';
import { RevisarComponent } from './maniobras/2revisar/revisar.component';
import { TerminaLavadoReparacionComponent } from './maniobras/3terminar_lavado_reparacion/termina_lavado_reparacion.component';
import { CargaContenedorComponent } from './maniobras/4x_cargar/carga_contenedor.component';
import { InventarioComponent } from './maniobras/5inventario/inventario.component';
import { VaciosComponent } from './maniobras/vacios.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './clientes/cliente.component';
import { ViajesComponent } from './viajes/viajes.component';
import { ViajeComponent } from './viajes/viaje.component';
import { FotosComponent } from './fotos/fotos.component';
// Solicitudes / Aprobaciones
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
// import { SolicitudesDescargaComponent } from './solicitudes/descarga/solicitudes_descarga.component';
import { SolicitudDescargaComponent } from './solicitudes/descarga/solicitud_descarga.component';
// import { SolicitudesCargaComponent } from './solicitudes/carga/solicitudes_carga.component';
import { SolicitudCargaComponent } from './solicitudes/carga/solicitud_carga.component';
import { AprobacionesComponent } from './solicitudes/aprobaciones.component';
import { AprobarDescargaComponent } from './solicitudes/aprobar_descarga.component';
import { AprobarCargaComponent } from './solicitudes/aprobar_carga.component';
import { SolicitudesTransportistaComponent } from './solicitudes/transportista/solicitudes_transportista.component';
import { SolicitudTransportistaComponent } from './solicitudes/transportista/solicitud_transportista.component';
import { SolicitudReasignaTransportistaComponent } from './solicitudes/transportista/solicitud_reasigna_transportista.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { MisclientesComponent } from './misclientes/misclientes.component';
import { MiclienteComponent } from './misclientes/micliente.component';
import { ReporteContenedoresRLComponent } from './reporte-contenedores-rl/reporte-contenedores-rl.component';

// MAPEO DE PATIO REIM
import { MapaComponent } from './mapa/mapa.component';


// Guards
import { REIMGuard } from '../services/service.index';
import { ManiobraComponent } from './maniobras/maniobra.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { PapeletaComponent } from './maniobras/papeleta/papeleta.component';
import { ContenedoresLRComponent } from './contenedores-lr/contenedores-lr.component';
import { DetalleManiobraComponent } from './detalle-maniobra/detalle-maniobra.component';
import { FacturacionManiobrasComponent } from './maniobras/facturacion-maniobras/facturacion-maniobras.component';
import { ManiobrasDiarioComponent } from './maniobras/maniobras-diario/maniobras-diario.component';
import { TiposContenedoresComponent } from './tipos-contenedores/TiposContenedoresComponent';
import { TipoContenedoresComponent } from './tipos-contenedores/tipo-contenedores.component';
import { ROLES } from '../config/config';
import { LiberacionesBLComponent } from './liberacion-bl/liberaciones-bl.component';
import { LiberacionBLComponent } from './liberacion-bl/liberacion-bl.component';
import { AprobacionesBkComponent } from './liberacion-bl/aprobaciones-bk/aprobaciones-bk.component';
import { AprobacionTBKComponent } from './liberacion-bl/aprobaciones-bk/aprobacion-tbk/aprobacion-tbk.component';
import { AsignacionTransportistaComponent } from './liberacion-bl/aprobaciones-bk/asignacion-transportista/asignacion-transportista.component';
import { ClaveProductosServiciosComponent } from './facturacion/clave-productos-servicios/clave-productos-servicios.component';
import { ClaveProductosServicioComponent } from './facturacion/clave-productos-servicios/clave-productos-servicio.component';
import { ClaveUnidadesComponent } from './facturacion/clave-unidades/clave-unidades.component';
import { ClaveUnidadComponent } from './facturacion/clave-unidades/clave-unidad.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ManiobrasTrasportistaComponent } from './maniobras-Reporte/maniobras-reporte.component';
import { NotaDeCreditoComponent } from './facturacion/notas-de-credito/nota-de-credito.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { MaterialComponent } from './materiales/material.component';
import { EntradasComponent } from './entradas/entradas.component';
import { EntradaComponent } from './entradas/entrada.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
/* #endregion */

const pagesRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
    { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Configuración de la cuenta' } },
    { path: 'profile', component: ProfileComponent, data: { titulo: 'Mi perfil' } },
    { path: 'mapa', component: MapaComponent, data: { titulo: 'Mapa' } },


    // CATALOGOS GENERALES
    {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Usuarios', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'status',
        component: StatusComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Status de Usuarios', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'usuarios/usuario/:id',
        component: UsuarioComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Usuarios.', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'usuarios/usuario/:id/resetPass',
        component: UsuarioResetPassComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Reseteo de contraseña.', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'reparaciones',
        component: ReparacionesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Reparaciones', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'reparaciones/reparacion/:id',
        component: ReparacionComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'navieras',
        component: NavierasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Navieras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'navieras/naviera/:id',
        component: NavieraComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'agencias',
        component: AgenciasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Agencias', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'agencias/agencia/:id',
        component: AgenciaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de agencia', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'transportistas',
        component: TransportistasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de transportistas', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {

        path: 'maniobras_reporte',
        component: ManiobrasTrasportistaComponent,
        canActivate: [REIMGuard],
        data: {titulo: 'Maniobras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE, ROLES.CLIENT_ROLE, ROLES.NAVIERA_ROLE]}
    },
    {
        path: 'transportistas/transportista/:id',
        component: TransportistaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de transportista', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'buques',
        component: BuquesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Buques', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'buques/buque/:id',
        component: BuqueComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'operadores',
        component: OperadoresComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Operadores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'operadores/operador/:id',
        component: OperadorComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'camiones',
        component: CamionesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de camiones', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'camiones/camion/:id',
        component: CamionComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de camiones', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'tipos_contenedores',
        component: TiposContenedoresComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Tipos Contenedores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'tipos_contenedores/tipoContenedor/:id',
        component: TipoContenedoresComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Tipos Contenedores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    ///////// LIBERACION-BLBOOKING/////////////////////////////////////
    {
        path: 'liberaciones_bk', // tabala donde el (USUARIO) vera sus solicitudes liberacion BK
        component: LiberacionesBLComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'liberaciones Booking', role: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.NAVIERA_ROLE] }
    },

    {
        path: 'liberacion_bk/:id', // ED de solicitudes de liberacion BK  de (USUARIO)
        component: LiberacionBLComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Solicitud de Liberación Booking', role: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.NAVIERA_ROLE] }
    },

    {
        path: 'aprobaciones_bk/:id', // el (ADMIN) aprobara la solicitud de liberacion BK
        component: AprobacionesBkComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Aprobaciones Booking', role: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    {
        path: 'aprobacion_tbk', // tabla donde se mostraran las solicitudes de liberacion BK para aprobar Y ELIMINAR (ADMIN)
        component: AprobacionTBKComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Aprobaciones de Solicitud Booking', role: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE ] }
    },

    {
        // ED donde el usuario podra asignar el transportista para la solicitud de liberacion_bk y asi se pase a estatus NA
        path: 'asignacion_transportista_bk/:id',
        component: AsignacionTransportistaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Asignacion de Transportista Booking', role: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.NAVIERA_ROLE] }
    },

    //////////////////////////////////////////////

    {
        path: 'vigencias',
        component: VigenciasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Vigencias', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'vigencias/vigencia/:id',
        component: VigenciaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },

    {
        path: 'maniobras',
        component: ManiobrasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Maniobras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/llegada_entrada',
        component: LlegadaEntradaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Llegada', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/revisar',
        component: RevisarComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Revisa', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/termina_lavado_reparacion',
        component: TerminaLavadoReparacionComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Lavado / Revision', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/carga_contenedor',
        component: CargaContenedorComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Cargar Maniobra', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/detalle',
        component: DetalleManiobraComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Detalle Maniobra', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Inventario de Contenedores Disponibles', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.NAVIERA_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'solicitudes/papeleta/:id',
        component: PapeletaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Papeleta', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'vacios',
        component: VaciosComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Maniobras de Vacios', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'facturacion-maniobras',
        component: FacturacionManiobrasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Facturación de Maniobras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'productos-servicios',
        component: ProductosServiciosComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catalogo de Productos o Servicios', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'producto-servicio/:id',
        component: ProductoServicioComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'clave-productos-servicios',
        component: ClaveProductosServiciosComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catalogo de Clave Productos Servicios', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'clave-producto-servicio/:id',
        component: ClaveProductosServicioComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'clave-unidades',
        component: ClaveUnidadesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catalogo de Clave Unidades', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'clave-unidad/:id',
        component: ClaveUnidadComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'maniobras_diario',
        component: ManiobrasDiarioComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Maniobras Diario', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'maniobra/:id',
        component: ManiobraComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Maniobra', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'fotos/:id',
        component: FotosComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Fotos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.NAVIERA_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'busqueda/:termino',
        component: BusquedaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Buscador', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    // Solicitudes
    {
        path: 'solicitudes',
        component: SolicitudesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Solicitudes de carga/descarga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    // // Solicitud Descarga
    {
        path: 'solicitudes/solicitud_descarga/:id',
        component: SolicitudDescargaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    // // Solicitud Carga
    {
        path: 'solicitudes/solicitud_carga/:id',
        component: SolicitudCargaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos carga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },

    // Aprobaciones
    {
        path: 'solicitudes/aprobaciones',
        component: AprobacionesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Aprobaciones de Solicitudes de Carga / Descargas', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitudes/aprobaciones/aprobar_descarga/:id',
        component: AprobarDescargaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Aprobar Descarga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitudes/aprobaciones/aprobar_carga/:id',
        component: AprobarCargaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Aprobar Carga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },


    // REPORTES
    {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Reportes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.PATIO_ROLE]}
    },

    // SOLICITUDES TRANSPORTISTA
    {
        path: 'solicitudes_transportista',
        component: SolicitudesTransportistaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Solicitudes Transportista', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'solicitud_transportista/:id',
        component: SolicitudTransportistaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Asignar Camion / Chofer', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },
    {
        path: 'solicitud_reasigna_transportista/:id',
        component: SolicitudReasignaTransportistaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Reasigna Transportista', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.TRANSPORTISTA_ROLE] }
    },

    // Mantenimientos ADMIN ROLE

    {
        path: 'viaje/:id',
        component: ViajeComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de viajes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'viajes',
        component: ViajesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de viajes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Clientes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE] }
    },
    {
        path: 'cliente/:id', component: ClienteComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de clientes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE] }
    },
    {
        path: 'contenedoresLR',
        component: ContenedoresLRComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Contenedores con Lavado / Reparacion (Naviera)', roles: [ROLES.ADMIN_ROLE,
            ROLES.PATIOADMIN_ROLE, ROLES.NAVIERA_ROLE, ROLES.PATIO_ROLE] }
    },
    {
        path: 'reportesRL',
        component: ReporteContenedoresRLComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Reporte contenedores reparación / lavado', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'misempresas',
        component: EmpresaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'micliente/:id',
        component: MiclienteComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Mis Clientes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'misclientes/:id',
        component: MisclientesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    // FACTURACION
    {
        path: 'cfdis',
        component: CFDISComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catalogo de CFDIS', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'cfdi/:id',
        component: CFDIComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de CFDI', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'complementos',
        component: ComplementosPagoComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catalogo de Complementos de Pago', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'complemento/:id',
        component: ComplementoPagoComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Complemento de Pago', roles: [ROLES.ADMIN_ROLE] }
    },   
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'nota_de_credito/:id',
        component: NotaDeCreditoComponent,
        canActivate: [REIMGuard],
        data: {titulo: 'Nota de Credito', roles: [ ROLES.ADMIN_ROLE]}
    },
    {
        path: 'materiales',
        component: MaterialesComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catálogo de Materiales', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'materiales/material/:id',
        component: MaterialComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Material', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'entradas',
        component: EntradasComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catálogo de Entradas', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'entradas/entrada/:id',
        component: EntradaComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Entrada', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'proveedores',
        component: ProveedoresComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Catálogo de Proveedores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'proveedores/proveedor/:id',
        component: ProveedorComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Proveedor', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    // otherwise redirect to home
    // { path: '**', component: NotfoundComponent }
];




export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
