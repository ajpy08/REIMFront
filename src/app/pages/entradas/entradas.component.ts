import { Component, OnInit, ViewChild } from '@angular/core';
import { Entrada } from './entrada.models';
import {
  EntradaService,
  UsuarioService,
  ExcelService
} from '../../services/service.index';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
declare var swal: any;

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {
  entradas: Entrada[] = [];
  cargando = true;
  tablaCargar = false;
  totalRegistros = 0;
  usuarioLogueado: Usuario;
  entradasExcel = [];

  displayedColumns = [
    'actions',
    'noFactura',
    'proveedor',
    'fFactura'
  ];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public entradaService: EntradaService,
    private usuarioService: UsuarioService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarEntradas();
    this.socket.on('new-entrada', function () {
      this.cargarEntradas();
    }.bind(this));

    this.socket.on('update-entrada', function (data: any) {
      if (data.data._id) {
        this.cargarEntradas();
      }
    }.bind(this));

    this.socket.on('delete-entrada', function () {
      this.cargarEntradas();
    }.bind(this));
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
      console.error('No se puede filtrar en un datasource vacío');
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('delete-entrada');
    this.socket.removeListener('update-entrada');
    this.socket.removeListener('new-entrada');
  }

  cargarEntradas() {
    this.cargando = true;

    this.entradaService.getEntradas().subscribe(entradas => {
        this.dataSource = new MatTableDataSource(entradas.entradas);
        if (entradas.entradas.length === 0 || entradas.entradas === undefined) {
          this.tablaCargar = true;
        } else {
          this.tablaCargar = false;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = entradas.entradas.length;
      });
    this.cargando = false;
  }

  borrarEntrada(entrada: Entrada) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + entrada.noFactura,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.entradaService
          .borrarEntrada(entrada)
          .subscribe(() => {
            this.socket.emit('deleteentrada', entrada);
          });
      }
    });
  }

  crearDatosExcel(datos) {
    datos.forEach(d => {
      const entradas = {
        noFactura: d.noFactura,
        proveedor: d.proveedor.razonSocial,
        fFactura: d.fFactura,
        // detalles: d.detalles
      };
      this.entradasExcel.push(entradas);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.entradasExcel != undefined && this.entradasExcel != null && this.entradasExcel.length > 0) {
      this.excelService.exportAsExcelFile(this.entradasExcel, 'Entradas');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

}
