import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService, UsuarioService, ExcelService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/render3/util';
declare var swal: any;
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;
  usuarioLogueado = new Usuario;
  clientesExcel = [];

  displayedColumns = ['actions', 'razonSocial', 'nombreComercial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
    'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'empresas'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _clienteService: ClienteService, private usuarioService: UsuarioService, private excelService: ExcelService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarClientes();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarClientes() {
    this.cargando = true;

    if (this.usuarioLogueado.role == 'ADMIN_ROLE') {
      this._clienteService.getClientes(this.desde)
        .subscribe(clientes => {
          this.dataSource = new MatTableDataSource(clientes.clientes);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = clientes.clientes.length;
          // console.log(clientes.clientes)
          // console.log(this.dataSource)
        });
    } else {
      var idsEmpresa = "";
      if (this.usuarioLogueado.empresas.length > 0) {
        this.usuarioLogueado.empresas.forEach(empresa => {
          idsEmpresa += empresa._id + ',';
        })

        idsEmpresa = idsEmpresa.substring(0, idsEmpresa.length - 1);;
        //console.log(idsEmpresa)
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
          this._clienteService.borrarCliente(cliente._id)
            .subscribe(borrado => {
              this.cargarClientes();
            });
        }
      });
  }

  crearDatosExcel(datos) {
    datos.forEach(d => {
      var clientes = {
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
      }
      this.clientesExcel.push(clientes);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if(this.clientesExcel){
      this.excelService.exportAsExcelFile(this.clientesExcel, 'Clientes');
    }else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
