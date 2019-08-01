import {RouterModule, Routes} from '@angular/router';
// import { PagesComponent } from './pages.component';
import { ManiobrasComponent } from './maniobras/maniobras.component';

import { TransitoComponent } from './maniobras/transito.component';
import { LlegadaComponent } from './maniobras/llegada.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { ProfileComponent } from './profile/profile.component';
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
import { AgenciasComponent } from './agencias/agencias.component';
import { AgenciaComponent } from './agencias/agencia.component';
import { TransportistasComponent } from './transportistas/transportistas.component';
import { TransportistaComponent } from './transportistas/transportista.component';
import { ViajesComponent } from './viajes/viajes.component';
import { ViajeComponent } from './viajes/viaje.component';
import { FotosComponent } from './fotos/fotos.component';
import { NavierasComponent } from './navieras/navieras.component';
import { NavieraComponent } from './navieras/naviera.component';

import { SolicitudesDescargasComponent } from './solicitudDescarga/solicitudes-descargas.component';
import { SolicitudDescargaComponent } from './solicitudDescarga/solicitudDescarga.component';

import { SolicitudesAprobacionesComponent } from './solicitudDescarga/solicitudesAprobaciones.component';
import { SolicitudAprobacionComponent } from './solicitudDescarga/solicitudAprobacion.component';

import { EmpresaComponent } from './empresa/empresa.component';
import { MisclientesComponent } from './misclientes/misclientes.component';
import { MiclienteComponent } from './misclientes/micliente.component';

import { ContenedoresDisponiblesComponent } from './contenedores-disponibles/contenedores-disponibles.component';
import { ContenedoresRLComponent } from './contenedores-rl/contenedores-rl.component';
import { ReporteContenedoresRLComponent } from './reporte-contenedores-rl/reporte-contenedores-rl.component';
import { BuquesComponent } from './buques/buques.component';
import { BuqueComponent } from './buques/buque.component';
import { ReparacionesComponent } from './reparaciones/reparaciones.component';
import { ReparacionComponent } from './reparaciones/reparacion.component';


// Guards
// import { LoginGuardGuard } from '../services/service.index';
import { AdminGuard } from '../services/service.index';
// import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';
import { ManiobraComponent } from './maniobras/maniobra.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AddcontainersComponent } from './addcontainers/addcontainers.component';




const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { titulo: 'Dashboard' }
    },
    {path: 'usuarios/:id', component: UsuarioComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de Usuarios.'}},

    {path: 'usuarios/resetPass/:id', component: UsuarioResetPassComponent,
    canActivate: [ AdminGuard ], data: {titulo: 'Reseto de contraseña.'}},

    {path: 'usuarios', component: UsuariosComponent, canActivate: [ AdminGuard ], data: { titulo: 'Mantenimiento de Usuarios' }},

    {path: 'maniobras', component: ManiobrasComponent, data: {titulo: 'Maniobras'}},
    {path: 'transito', component: TransitoComponent, data: {titulo: 'Transito'}},
    {path: 'llegada/:id', component: LlegadaComponent, data: {titulo: 'Llegada'}},
    {path: 'maniobra/:id', component: ManiobraComponent, data: {titulo: 'Maniobra'}},
    {path: 'fotos/:id', component: FotosComponent, data: {titulo: 'Fotos'}},
    {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Configuración de la cuenta'}},
    {path: 'profile', component: ProfileComponent, data: {titulo: 'Mi perfil'}},
    {path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador' } },

    // Solicitud Descarga
    {path: 'solicitudes_descargas', component: SolicitudesDescargasComponent,
    canActivate: [ AdminGuard ], data: { titulo: 'Solicitud de descargas' }},

    {path: 'solicitud_descarga/:id', component: SolicitudDescargaComponent,
    canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},

    {path: 'solicitudes_aprobaciones', component: SolicitudesAprobacionesComponent,
    canActivate: [AdminGuard], data: { titulo: 'Aprobaciones de Solicitudes de Carga / Descargas'}},

    {path: 'solicitud_aprobacion/:id', component: SolicitudAprobacionComponent,
    canActivate: [ AdminGuard ], data: {titulo: 'Aprobar descarga'}},
    // Mantenimientos ADMIN ROLE
    {
        path: 'operadores',
        component: OperadoresComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Operadores' }
    },
    {path: 'operador/:id', component: OperadorComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},
    {
        path: 'camiones',
        component: CamionesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de camiones' }
    },
    {path: 'camion/:id', component: CamionComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de camiones'}},
    {
        path: 'contenedores',
        component: ContenedoresComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Contenedores' }
    },
    {path: 'agencia/:id', component: AgenciaComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de agencia'}},
    {
        path: 'agencias',
        component: AgenciasComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Agencias' }
    },
    {path: 'transportista/:id', component: TransportistaComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de transportista'}},
    {
        path: 'transportistas',
        component: TransportistasComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de transportistas' }
    },
    {path: 'viaje/:id', component: ViajeComponent, data: {titulo: 'Actualizacion de viajes'}},
    {path: 'addcontainers/:id', component: AddcontainersComponent, data: {titulo: 'Actualizacion de contenedores del viaje'}},
    {
        path: 'viajes',
        component: ViajesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de viajes' }
    },
    {path: 'contenedor/:id', component: ContenedorComponent, canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de contenedores'}},
    {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Clientes' }
    },
    {path: 'cliente/:id', component: ClienteComponent, canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de clientes'}},
    {
        path: 'navieras',
        component: NavierasComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Navieras' }
    },
    {path: 'naviera/:id', component: NavieraComponent, canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},
    {
        path: 'contenedoresDisponibles',
        component: ContenedoresDisponiblesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Contenedores disponibles' }
    },
    {
        path: 'contenedoresRL',
        component: ContenedoresRLComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Contenedores en reparación / lavado' }
    },
    {
        path: 'reportesRL',
        component: ReporteContenedoresRLComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Reporte contenedores reparación / lavado' }
    },
    {path: 'misempresas', component: EmpresaComponent, canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},
    {
        path: 'micliente/:id',
        component: MiclienteComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Mis Clientes' }
    },
    {path: 'misclientes/:id', component: MisclientesComponent, canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},
    {
        path: 'buques',
        component: BuquesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Buques' }
    },
    {path: 'buque/:id', component: BuqueComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},
    {
        path: 'reparaciones',
        component: ReparacionesComponent,
        canActivate: [ AdminGuard ],
        data: { titulo: 'Mantenimiento de Reparaciones' }
    },
    {path: 'reparacion/:id', component: ReparacionComponent,  canActivate: [ AdminGuard ], data: {titulo: 'Actualizacion de datos'}},
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    ];
    export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
