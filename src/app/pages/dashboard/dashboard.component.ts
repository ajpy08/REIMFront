import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { CamionService } from '../camiones/camion.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario.model';
import { Camion } from '../camiones/camion.models';
import { ROLES, ETAPAS_MANIOBRA } from 'src/app/config/config';
import { OperadorService } from '../operadores/operador.service';
import { Operador } from '../operadores/operador.models';
import { ClienteService, SolicitudService, ManiobraService, FacturacionService } from 'src/app/services/service.index';
import { Cliente } from 'src/app/models/cliente.models';
import { ThrowStmt } from '@angular/compiler';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  camiones: Camion[] = [];
  usuarioLogueado: Usuario;
  totalCamiones = 0;

  operadores: Operador[] = [];
  totalOperadores = 0;

  clientes: Cliente[] = [];
  totalClientes = 0;

  totalRegistrosDescargas = 0;
  totalRegistrosCargas = 0;
  totalSolicitudTransportistaD = 0;
  totalSolicitudTransportistaC = 0;

  totalRegistrosInventario = 0;
  c40: any;
  c20: any;
  groupedDisponibles20: any;
  groupedDisponibles40: any;
  dataSource: any;
  dataSourceLR: any;
  totalRegistrosLR = 0;

  totalLavado = 0;
  totalReparacion = 0;

  cfdiTimbrados = 0;
  cfdiSinTimbrar = 0;
  cfdiTotal = 0;

  totalTransito = 0;
  totalEspera = 0;
  totalRevision = 0;
  totalLavadoReparacion = 0;
  totalXCargar = 0;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(private camionService: CamionService, private usuarioService: UsuarioService,
    private operadoresServices: OperadorService, private clientesServices: ClienteService
    , private solicitudService: SolicitudService,
    private maniobraService: ManiobraService, private facturacionService: FacturacionService,
  ) { }


  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.cargarCamiones();
      this.cargarOperadores();
      this.socket.on('new-camion', function (data: any) {
        this.cargarCamiones();
      }.bind(this));
      this.socket.on('delete-camion', function (data: any) {
        this.cargarCamiones();
      }.bind(this));

      this.socket.on('new-operador', function (data: any) {
        this.cargarOperadores();
      }.bind(this));
      this.socket.on('delete-operador', function (data: any) {
        this.cargarOperadores();
      }.bind(this));
    }
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.AA_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.socket.on('new-cliente', function (data: any) {
        this.cargarClientes();
      }.bind(this));
      this.socket.on('delete-cliente', function (data: any) {
        this.cargarClientes();
      }.bind(this));

      this.cargarClientes();
      this.socket.on('new-solicitud', function (data: any) {
        this.cargarSolicitudes(data.data.tipo);
      }.bind(this));

      this.socket.on('delete-solicitud', function (data: any) {
        this.cargarSolicitudes(data.data.tipo);
      }.bind(this));

      this.cargarSolicitudes('D');
      this.cargarSolicitudes('C');
    }
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.NAVIERA_ROLE || this.usuarioLogueado.role === ROLES.PATIO_ROLE) {
      this.cargarInventario();
      this.cargarLR();
      this.cargarLavadoOReparacion('L');
      this.cargarLavadoOReparacion('R');

      this.cargarManiobras();
    }

    this.socket.on('cambio-maniobra', function (data: any) {
      this.cargarInventario(data.data.estatus);
    }.bind(this));

    this.socket.on('cambio-maniobra', function (data: any) {
      this.cargarManiobras(data.data.estatus);
    }.bind(this));

    this.socket.on('aprobar-solicitud', function (data: any) {
      this.cargarSolicitudesTransportista(data.data.tipo);
    }.bind(this));

    this.socket.on('delete-solicitud', function (data: any) {
      this.cargarSolicitudesTransportista(data.data.tipo);
    }.bind(this));

    this.socket.on('new-cfdi', function (data: any) {
      this.cargarCFDI();
    }.bind(this));

    this.socket.on('delete-cfdi', function (data: any) {
      this.cargarCFDI();
    }.bind(this));


    this.cargarSolicitudesTransportista();
    this.cargarCFDI();

  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('new-camion');
    this.socket.removeListener('delete-camion');
    this.socket.removeListener('new-operador');
    this.socket.removeListener('delete-operador');
    this.socket.removeListener('new-cliente');
    this.socket.removeListener('delete-cliente');
    this.socket.removeListener('new-solicitud');
    this.socket.removeListener('delete-solicitud');
    this.socket.removeListener('cambio-maniobra');
    this.socket.removeListener('aprobar-solicitud');
    this.socket.removeListener('new-cfdi');
    this.socket.removeListener('delete-cfdi');
  }


  cargarCamiones() {

    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.camionService.getCamiones().subscribe(camiones => {
        this.totalCamiones = camiones.camiones.length;
      });
    } else if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
      this.camionService.getCamiones(true, this.usuarioLogueado.empresas[0]._id).subscribe(camiones => {
        this.totalCamiones = camiones.camiones.length;
      });
    }

  }
  cargarCFDI() {
    this.facturacionService.getCFDIS('A').subscribe(cfdis => {
      this.cfdiTotal = cfdis.total;
    });

    const T = async () => {
      await this.facturacionService.getCFDIS_T_sT(true).subscribe(cfdisT => {
        this.cfdiTimbrados = cfdisT.total;
      });
    };
    T();

    const ST = async () => {
      await this.facturacionService.getCFDIS_T_sT(false).subscribe(cfdissT => {
          this.cfdiSinTimbrar = cfdissT.total;
        });
    };
    ST();
  }

  cargarOperadores() {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.operadoresServices.getOperadores().subscribe(operadores => {
        this.totalOperadores = operadores.operadores.length;
      });
    } else if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
      this.operadoresServices.getOperadores(this.usuarioLogueado.empresas[0]._id).subscribe(operadores => {
        this.totalOperadores = operadores.operadores.length;
      });
    }
  }

  cargarClientes() {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.clientesServices.getClientes(null, true).subscribe(clientes => {
        this.totalClientes = clientes.clientes.length;
      });
    } else if (this.usuarioLogueado.role === ROLES.AA_ROLE) {
      let idsEmpresa = '';
      if (this.usuarioLogueado.empresas.length > 0) {
        this.usuarioLogueado.empresas.forEach(empresa => {
          idsEmpresa += empresa._id + ',';
        });
        idsEmpresa = idsEmpresa.substring(0, idsEmpresa.length - 1);
        this.clientesServices.getClientesEmpresas(idsEmpresa).subscribe((clientes) => {
          this.totalClientes = clientes.clientes.length;
        });
      }
    }
  }


  cargarSolicitudes(CD: string) {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      if (CD === 'D') {
        this.solicitudService.getSolicitudes('D')
          .subscribe(res => {
            this.totalRegistrosDescargas = res.total;
          });

      } else if (CD === 'C') {
        this.solicitudService.getSolicitudes('C')
          .subscribe(res => {
            this.totalRegistrosCargas = res.total;
          });
      }
    } else {
      let agencias = '';
      this.usuarioLogueado.empresas.forEach(emp => {
        agencias = agencias + emp._id + ',';
      });
      agencias = agencias.slice(0, -1);
      if (CD === 'D') {
        this.solicitudService.getSolicitudes('D', null, null, null, agencias)
          .subscribe(res => {
            this.totalRegistrosDescargas = res.total;
          });
      } else if (CD === 'C') {
        this.solicitudService.getSolicitudes('C', null, null, null, agencias)
          .subscribe(res => {
            this.totalRegistrosCargas = res.total;
          });
      }
    }

  }

  cargarInventario() {
    if (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE && this.usuarioLogueado.empresas.length > 0) {
      this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE, null, null, null, null, null, null, this.usuarioLogueado.empresas[0]._id)
        .subscribe(maniobras => {

          this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));

          const grouped20 = this.c20.reduce((curr, m) => {
            if (!curr[m.tipo]) {
              // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
              curr[m.tipo] = [m];
            } else {
              // Si ya tienes ese tipo lo agregas al final del arreglo
              curr[m.tipo].push(m);
            }
            return curr;
          }, {});

          // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
          this.groupedDisponibles20 = Object.keys(grouped20).map(tipo => {
            return {
              tipo: tipo,
              maniobras: grouped20[tipo]
            };
          });

          this.c40 = maniobras.maniobras.filter(m => m.tipo.includes('40'));

          const grouped40 = this.c40.reduce((curr, m) => {
            if (!curr[m.tipo]) {
              // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
              curr[m.tipo] = [m];
            } else {
              // Si ya tienes ese tipo lo agregas al final del arreglo
              curr[m.tipo].push(m);
            }
            return curr;
          }, {});

          // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
          this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
            return {
              tipo: tipo,
              maniobras: grouped40[tipo]
            };
          });

          this.totalRegistrosInventario = maniobras.maniobras.length;
        });
    } else {

      this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE, null, null, null, null, null, null, null, null, null)
        .subscribe(maniobras => {
          this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));

          const grouped20 = this.c20.reduce((curr, m) => {
            if (!curr[m.tipo]) {
              // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
              curr[m.tipo] = [m];
            } else {
              // Si ya tienes ese tipo lo agregas al final del arreglo
              curr[m.tipo].push(m);
            }
            return curr;
          }, {});

          // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
          this.groupedDisponibles20 = Object.keys(grouped20).map(tipo => {
            return {
              tipo: tipo,
              maniobras: grouped20[tipo]
            };
          });

          this.c40 = maniobras.maniobras.filter(m => m.tipo.includes('40'));

          const grouped40 = this.c40.reduce((curr, m) => {
            if (!curr[m.tipo]) {
              // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
              curr[m.tipo] = [m];
            } else {
              // Si ya tienes ese tipo lo agregas al final del arreglo
              curr[m.tipo].push(m);
            }
            return curr;
          }, {});

          // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
          this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
            return {
              tipo: tipo,
              maniobras: grouped40[tipo]
            };
          });

          this.totalRegistrosInventario = maniobras.maniobras.length;
        });

    }
    this.cargarLR();
  }


  cargarLR() {
    if (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE && this.usuarioLogueado.empresas.length > 0) {
      this.maniobraService.getManiobrasNaviera(ETAPAS_MANIOBRA.LAVADO_REPARACION, this.usuarioLogueado.empresas[0]._id)
        .subscribe(maniobras => {

          this.totalRegistrosLR = maniobras.total;
        });

    } else {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
        this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIO_ROLE) {

        this.maniobraService.getManiobrasNaviera(ETAPAS_MANIOBRA.LAVADO_REPARACION)
          .subscribe(maniobras => {

            this.totalRegistrosLR = maniobras.total;
          });
      }
    }
  }
  cuentaReparaciones(grado: string, tipo: string, source: any): number {
    let count = 0;
    source.forEach(d => {
      if (d.grado === grado && d.tipo === tipo && d.reparaciones.length > 0) {
        count++;
      }
      // } else if (grado == '' && d.tipo == tipo && d.reparaciones.length > 0) {
      //   count++;
      // }
    });
    return count;
  }
  cuentaInventario(grado: string, estatus: string, source: any): number {
    let count = 0;
    source.forEach(d => {
      if (d.grado === grado && d.estatus === estatus) {
        count++;
      }
    });
    return count;
  }

  obtenTotales(tipo: string): number {
    let total = 0;
    if (tipo.includes('20')) {
      if (this.groupedDisponibles20 !== undefined) {
        this.groupedDisponibles20.forEach(g20 => {
          total += this.cuentaInventario('A', 'DISPONIBLE', g20.maniobras);
          total += this.cuentaInventario('B', 'DISPONIBLE', g20.maniobras);
          total += this.cuentaInventario('C', 'DISPONIBLE', g20.maniobras);
          total += this.cuentaReparaciones('A', g20.tipo, this.dataSourceLR.data);
          total += this.cuentaReparaciones('B', g20.tipo, this.dataSourceLR.data);
          total += this.cuentaReparaciones('C', g20.tipo, this.dataSourceLR.data);
          total += this.cuentaReparaciones('PT', g20.tipo, this.dataSourceLR.data);
        });
      }
    } else if (tipo.includes('40')) {
      if (this.groupedDisponibles40 !== undefined) {
        this.groupedDisponibles40.forEach(g40 => {
          total += this.cuentaInventario('A', 'DISPONIBLE', g40.maniobras);
          total += this.cuentaInventario('B', 'DISPONIBLE', g40.maniobras);
          total += this.cuentaInventario('C', 'DISPONIBLE', g40.maniobras);
          total += this.cuentaReparaciones('A', g40.tipo, this.dataSourceLR.data);
          total += this.cuentaReparaciones('B', g40.tipo, this.dataSourceLR.data);
          total += this.cuentaReparaciones('C', g40.tipo, this.dataSourceLR.data);
          total += this.cuentaReparaciones('PT', g40.tipo, this.dataSourceLR.data);
        });
      }
    }

    return total;
  }

  obtenSubTotales(tipo: string, dataSource, dataSourceLR): number {
    let subTotal = 0;
    if (tipo.includes('20')) {
      if (dataSource !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (dataSourceLR !== undefined) {
          subTotal += this.cuentaReparaciones('A', tipo, this.dataSourceLR.data);
          subTotal += this.cuentaReparaciones('B', tipo, this.dataSourceLR.data);
          subTotal += this.cuentaReparaciones('C', tipo, this.dataSourceLR.data);
          subTotal += this.cuentaReparaciones('PT', tipo, this.dataSourceLR.data);
        }
      } else if (dataSourceLR !== undefined) {
        subTotal += this.cuentaReparaciones('A', tipo, dataSourceLR.data);
        subTotal += this.cuentaReparaciones('B', tipo, dataSourceLR.data);
        subTotal += this.cuentaReparaciones('C', tipo, dataSourceLR.data);
        subTotal += this.cuentaReparaciones('PT', tipo, dataSourceLR.data);
      }
    } else if (tipo.includes('40')) {
      if (this.groupedDisponibles40 !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (dataSourceLR !== undefined) {
          subTotal += this.cuentaReparaciones('A', tipo, this.dataSourceLR.data);
          subTotal += this.cuentaReparaciones('B', tipo, this.dataSourceLR.data);
          subTotal += this.cuentaReparaciones('C', tipo, this.dataSourceLR.data);
          subTotal += this.cuentaReparaciones('PT', tipo, this.dataSourceLR.data);
        }
      } else if (dataSourceLR !== undefined) {
        subTotal += this.cuentaReparaciones('A', tipo, this.dataSourceLR.data);
        subTotal += this.cuentaReparaciones('B', tipo, this.dataSourceLR.data);
        subTotal += this.cuentaReparaciones('C', tipo, this.dataSourceLR.data);
        subTotal += this.cuentaReparaciones('PT', tipo, this.dataSourceLR.data);
      }
    }
    return subTotal;
  }


  cargarLavadoOReparacion(LR: string) {
    if (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE && this.usuarioLogueado.empresas.length > 0) {
      this.maniobraService.getManiobrasLavadoOReparacion(this.usuarioLogueado.empresas[0]._id, null, null, null, null, LR).subscribe(maniobras => {
        if (LR === 'L') {
          this.totalLavado = maniobras.maniobras.length;
        } else if (LR === 'R') {
          this.totalReparacion = maniobras.maniobras.length;
        }
      });
    } else {
      this.maniobraService.getManiobrasLavadoOReparacion(null, null, null, null, null, LR).subscribe(maniobras => {
        if (LR === 'L') {
          this.totalLavado = maniobras.maniobras.length;
        } else if (LR === 'R') {
          this.totalReparacion = maniobras.maniobras.length;
        }
      });

    }
  }

  cargarManiobras() {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIO_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.maniobraService.getManiobras(null, ETAPAS_MANIOBRA.TRANSITO).subscribe(maniobras => {
        this.totalTransito = maniobras.total;
      });

      this.maniobraService.getManiobras(null, ETAPAS_MANIOBRA.ESPERA).subscribe(maniobras => {
        this.totalEspera = maniobras.total;
      });
      this.maniobraService.getManiobras(null, ETAPAS_MANIOBRA.REVISION).subscribe(maniobras => {
        this.totalRevision = maniobras.total;
      });

      this.maniobraService.getManiobras(null, ETAPAS_MANIOBRA.LAVADO_REPARACION).subscribe(maniobras => {
        this.totalLavadoReparacion = maniobras.total;
      });

      this.maniobraService.getManiobras(null, ETAPAS_MANIOBRA.XCARGAR).subscribe(maniobras => {
        this.totalXCargar = maniobras.total;
      });
    }

  }


  cargarSolicitudesTransportista() {
    if (this.usuarioLogueado.role === 'TRANSPORTISTA_ROLE') {
      this.maniobraService
        .getManiobras(
          'D',
          'TRANSITO',
          this.usuarioLogueado.empresas[0]._id,
          null,
          null,
          'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT'
        )
        .subscribe(maniobras => {
          this.totalSolicitudTransportistaD = maniobras.total;
        });
      this.maniobraService
        .getManiobras(
          'C',
          'TRANSITO',
          this.usuarioLogueado.empresas[0]._id,
          null,
          null,
          'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT'
        )
        .subscribe(maniobras => {
          this.totalSolicitudTransportistaC = maniobras.total;
        });
    } else
      if (this.usuarioLogueado.role === 'PATIOADMIN_ROLE' || 'ADMIN_ROLE') {
        this.maniobraService
          .getManiobras(
            'D',
            'TRANSITO',
            null,
            null,
            null,
            'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT'
          )
          .subscribe(maniobras => {
            this.totalSolicitudTransportistaD = maniobras.total;
          });
        this.maniobraService
          .getManiobras(
            'C',
            'TRANSITO',
            null,
            null,
            null,
            'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT'
          )
          .subscribe(maniobras => {
            this.totalSolicitudTransportistaC = maniobras.total;
          });
      }
  }


}






