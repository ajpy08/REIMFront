import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService, UsuarioService, ExcelService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/render3/util';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
declare var swal: any;
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  cargando = true;
  totalRegistros = 0;
  desde = 0;
  activo = false;
  tablaCargar = false;
  acttrue = false;
  usuarioLogueado = new Usuario;
  clientesExcel = [];
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  displayedColumns = ['actions',  'activo', 'razonSocial', 'nombreComercial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
    'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'empresas'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _clienteService: ClienteService, private usuarioService: UsuarioService, private excelService: ExcelService) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.usuarioLogueado = this.usuarioService.usuario;
    this.filtrado(this.activo);

    this.socket.on('new-cliente', function (data: any) {
      if ( (data.data.empresas[0]=== this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
      (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.filtrado(this.activo);
      }
    }.bind(this));
    this.socket.on('update-cliente', function (data: any) {
      if ( (data.data.empresas[0] === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
      (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.filtrado(this.activo);
      }
    }.bind(this));
    this.socket.on('delete-cliente', function (data: any) {
      if ( (data.data.empresas[0] === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
      (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.filtrado(this.activo);
      }
    }.bind(this));
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
        this.cargarClientes(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarClientes(bool);
    }

  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('delete-cliente');
    this.socket.removeListener('update-cliente');
    this.socket.removeListener('new-cliente');
  }

  cambioa(mensaje) {
    if (mensaje === true) {
      this.filtrado(false);
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
      if (this.dataSource.filteredData.length === 0 ) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
    } else {
      console.error('Error al filtrar el dataSource de Clientes');
    }
  }

  cargarClientes(bool) {
    this.cargando = true;

    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this._clienteService.getClientes(this.desde, bool)
        .subscribe(clientes => {
          this.dataSource = new MatTableDataSource(clientes.clientes);
          if (clientes.clientes.length === 0) {
            this.tablaCargar = true;
          } else {
            this.tablaCargar = false;
          }
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = clientes.clientes.length;
          // console.log(clientes.clientes)
          // console.log(this.dataSource)
        });
    } else {
      let idsEmpresa = '';
      if (this.usuarioLogueado.empresas.length > 0) {
        this.usuarioLogueado.empresas.forEach(empresa => {
          idsEmpresa += empresa._id + ',';
        });

        idsEmpresa = idsEmpresa.substring(0, idsEmpresa.length - 1);
        this._clienteService.getClientesEmpresas(idsEmpresa).subscribe((clientes) => {
          this.dataSource = new MatTableDataSource(clientes.clientes);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = clientes.clientes.length;
          // console.log(clientes.clientes)
          // console.log(this.dataSource)
        });
      }
    }
    this.cargando = false;
  }

  // cambiarDesde(valor: number) {
  //   let desde = this.desde + valor;
  //   //console.log(desde);
  //   if (desde >= this.totalRegistros) {
  //     return;
  //   }
  //   if (desde < 0) {
  //     return;
  //   }
  //   this.desde += valor;
  //   this.cargarClientes();
  // }

  // buscarCliente(termino: string) {
  //   if (termino.length <= 0) {
  //     this.cargarClientes();
  //     return;
  //   }
  //   this.cargando = true;
  //   this._clienteService.buscarCliente(termino)
  //     .subscribe((clientes: Cliente[]) => {
  //       this.clientes = clientes;
  //       this.cargando = false;
  //     });
  // }

  borrarCliente(cliente: Cliente) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + cliente.nombreComercial,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._clienteService.borrarCliente(cliente)
            .subscribe(borrado => {
              this.socket.emit('deletecliente', cliente);
              this.acttrue = false;
              this.filtrado(this.acttrue);
            }, (error) => {
              swal({
                title: 'No se permite eliminar el Cliente',
                text: 'El Cliente ' + cliente.nombreComercial + ' cuenta con historial de registro en el sistema. ' +
                  ' La accion permitida es DESACTIVAR, ¿ DESEA CONTINUAR ?',
                icon: 'warning',
                buttons: true,
                dangerMode: true
              }).then(borrado => {
                if (borrado) {
                  this._clienteService.habilitaDeshabilitaCliente(cliente, false).subscribe(() => {
                    swal('Correcto', 'Cambio de estado del Cliente ' + cliente.nombreComercial + ' realizado correctamente', 'success');
                    this.filtrado(this.acttrue);

                  });
                }
              });
            });
        }
      });
  }

  crearDatosExcel(datos) {
    datos.forEach(d => {
      const clientes = {
        RazonSocial: d.razonSocial,
        NombreComercial: d.nombreComercial,
        Rfc: d.rfc,
        Calle: d.calle,
        No_Exterior: d.noExterior,
        No_Interior: d.noInterior,
        Colonia: d.colonia,
        Municipio: d.municipio,
        Ciudad: d.ciudad,
        Estado: d.estado,
        Cp: d.cp,
        Correo: d.Correo,
        Correo_Facturación: d.correoFac,
        Credito: d.credito,
        Empresas: d.empresas
      };
      this.clientesExcel.push(clientes);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.clientesExcel) {
      this.excelService.exportAsExcelFile(this.clientesExcel, 'Clientes');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }


  habilitarDesabilitarCliente(cliente, event) {
    if (event.checked === false) {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de deshabilitar al cliente  ' + cliente.nombreComercial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._clienteService.habilitaDeshabilitaCliente(cliente, event.checked).subscribe(borado => {
            this.acttrue = true;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    } else {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de habilitar al cliente ' + cliente.nombreComercial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._clienteService.habilitaDeshabilitaCliente(cliente, event.checked).subscribe(borado => {
            this.acttrue = false;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    }

  }
}
