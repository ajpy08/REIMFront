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


// Guards
import { AdminGuard, REIMGuard } from '../services/service.index';
import { ManiobraComponent } from './maniobras/maniobra.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { PapeletaComponent } from './maniobras/papeleta/papeleta.component';

import { ContenedoresLRComponent } from './contenedores-lr/contenedores-lr.component';
import { DetalleManiobraComponent } from './detalle-maniobra/detalle-maniobra.component';
import { FacturacionManiobrasComponent } from './maniobras/facturacion-maniobras/facturacion-maniobras.component';
import { ManiobrasDiarioComponent } from './maniobras/maniobras-diario/maniobras-diario.component';
import { TiposContenedoresComponent } from "./tipos-contenedores/TiposContenedoresComponent";
import { TipoContenedoresComponent } from './tipos-contenedores/tipo-contenedores.component';
import { ROLES } from '../config/config';
import { NotfoundComponent } from '../shared/notfound/notfound.component';


const pagesRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
    { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Configuración de la cuenta' } },
    { path: 'profile', component: ProfileComponent, data: { titulo: 'Mi perfil' } },

    // CATALOGOS GENERALES
    {
        path: 'usuarios', component: UsuariosComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Mantenimiento de Usuarios', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'usuarios/usuario/:id',
        component: UsuarioComponent,
        canActivate: [REIMGuard],
        data: { titulo: 'Actualizacion de Usuarios.', roles: [ROLES.ADMIN_ROLE] }
    },
    {
        path: 'usuarios/usuario/:id/resetPass', component: UsuarioResetPassComponent,
        canActivate: [REIMGuard], data: { titulo: 'Reseteo de contraseña.', roles: [ROLES.ADMIN_ROLE] }
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
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'navieras',
        component: NavierasComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Navieras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'navieras/naviera/:id',
        component: NavieraComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'agencias',
        component: AgenciasComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Agencias', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'agencias/agencia/:id',
        component: AgenciaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de agencia', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'transportistas',
        component: TransportistasComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de transportistas', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'transportistas/transportista/:id',
        component: TransportistaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de transportista', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'buques',
        component: BuquesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Buques', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'buques/buque/:id',
        component: BuqueComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'operadores',
        component: OperadoresComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Operadores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'operadores/operador/:id',
        component: OperadorComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'camiones',
        component: CamionesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de camiones', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'camiones/camion/:id',
        component: CamionComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de camiones' }
    },
    {
        path: 'tipos_contenedores',
        component: TiposContenedoresComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Tipos Contenedores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'tipos_contenedores/tipoContenedor/:id',
        component: TipoContenedoresComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de Tipos Contenedores', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    //////////////////////////////////////////////

    {
        path: 'maniobras',
        component: ManiobrasComponent,
        data: { titulo: 'Maniobras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/llegada_entrada',
        component: LlegadaEntradaComponent,
        data: { titulo: 'Llegada', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/revisar',
        component: RevisarComponent,
        data: { titulo: 'Revisa', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/termina_lavado_reparacion',
        component: TerminaLavadoReparacionComponent,
        data: { titulo: 'Lavado / Revision', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/carga_contenedor',
        component: CargaContenedorComponent,
        data: { titulo: 'Cargar Maniobra', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobras/maniobra/:id/detalle',
        component: DetalleManiobraComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Detalle Maniobra', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Inventario de Contenedores Disponibles', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitudes/papeleta/:id',
        component: PapeletaComponent,
        data: { titulo: 'Papeleta', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'vacios',
        component: VaciosComponent,
        data: { titulo: 'Maniobras de Vacios', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'facturacion-maniobras',
        component: FacturacionManiobrasComponent,
        data: { titulo: 'Facturación de Maniobras', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobras_diario',
        component: ManiobrasDiarioComponent,
        data: { titulo: 'Maniobras Diario', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'maniobra/:id',
        component: ManiobraComponent,
        data: { titulo: 'Maniobra', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'fotos/:id',
        component: FotosComponent,
        data: { titulo: 'Fotos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'busqueda/:termino',
        component: BusquedaComponent,
        data: { titulo: 'Buscador', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    // Solicitudes
    {
        path: 'solicitudes', component: SolicitudesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Solicitudes de carga/descarga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    // // Solicitud Descarga
    {
        path: 'solicitudes/solicitud_descarga/:id', component: SolicitudDescargaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    // // Solicitud Carga
    {
        path: 'solicitudes/solicitud_carga/:id', component: SolicitudCargaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos carga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    // Aprobaciones
    {
        path: 'solicitudes/aprobaciones', component: AprobacionesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Aprobaciones de Solicitudes de Carga / Descargas', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitudes/aprobaciones/aprobar_descarga/:id', component: AprobarDescargaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Aprobar Descarga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitudes/aprobaciones/aprobar_carga/:id',
        component: AprobarCargaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Aprobar Carga', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    // SOLICITUDES TRANSPORTISTA
    {
        path: 'solicitudes_transportista',
        component: SolicitudesTransportistaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Solicitudes Transportista', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitud_transportista/:id',
        component: SolicitudTransportistaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Asignar Camion / Chofer', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'solicitud_reasigna_transportista/:id',
        component: SolicitudReasignaTransportistaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Reasigna Transportista', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },

    // Mantenimientos ADMIN ROLE

    {
        path: 'viaje/:id',
        component: ViajeComponent,
        data: { titulo: 'Actualizacion de viajes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'viajes',
        component: ViajesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de viajes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Clientes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE] }
    },
    {
        path: 'cliente/:id', component: ClienteComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de clientes', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE, ROLES.AA_ROLE] }
    },

    {
        path: 'contenedoresLR',
        component: ContenedoresLRComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Contenedores con Lavado / Reparacion (Naviera)', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'reportesRL',
        component: ReporteContenedoresRLComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Reporte contenedores reparación / lavado', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'misempresas',
        component: EmpresaComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: 'micliente/:id',
        component: MiclienteComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Mantenimiento de Mis Clientes' }
    },
    {
        path: 'misclientes/:id',
        component: MisclientesComponent,
        canActivate: [AdminGuard],
        data: { titulo: 'Actualizacion de datos', roles: [ROLES.ADMIN_ROLE, ROLES.PATIOADMIN_ROLE] }
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },

    // otherwise redirect to home
    { path: '**', component: NotfoundComponent }
];




export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
