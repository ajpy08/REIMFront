import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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

  displayedColumns = ['actions', 'razonSocial', 'nombreComercial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio', 
  'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'empresas'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _clienteService: ClienteService) { }

  ngOnInit() {
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
    this._clienteService.getClientes(this.desde)
      .subscribe(clientes => {
        this.dataSource = new MatTableDataSource(clientes.clientes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = clientes.clientes.length;
      });
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

  buscarCliente(termino: string) {
    if (termino.length <= 0) {
      this.cargarClientes();
      return;
    }
    this.cargando = true;
    this._clienteService.buscarCliente(termino)
      .subscribe((clientes: Cliente[]) => {
        this.clientes = clientes;
        this.cargando = false;
      });
  }

  borrarCliente(cliente: Cliente) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + cliente.razonSocial,
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
}
