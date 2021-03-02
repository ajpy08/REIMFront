import { MantenimientoService } from './../../maniobras/mantenimientos/mantenimiento.service';
import { MaterialService } from './../materiales/material.service';
import { AlmacenService } from './../almacen.service';
import { Movimiento } from './movimiento.models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Entrada } from '../entradas/entrada.models';
import {
  EntradaService,
  UsuarioService,
  ExcelService,
  MermaService
} from '../../../services/service.index';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { Material } from '../materiales/material.models';
declare var swal: any;

@Component({
  selector: 'app-reporte-movimientos',
  templateUrl: './reporte-movimientos.component.html',
  styleUrls: ['./reporte-movimientos.component.css']
})
export class ReporteMovimientosComponent implements OnInit {
  entradas: Entrada[] = [];
  cargando = true;
  tablaCargar = false;
  totalRegistros = 0;
  usuarioLogueado: Usuario;
  movimiento: Movimiento;
  entradasExcel = [];
  materiales = [];
  material;
  movimientos = [];

  displayedColumns = [
    'IO',
    'fEntrada',
    'noFactura',
    'fFactura',
    'cantidad',
    'material',
    // 'proveedor',
    // 'costo'
  ];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public entradaService: EntradaService,
    private usuarioService: UsuarioService,
    private excelService: ExcelService,
    public activatedRoute: ActivatedRoute,
    private almacenService: AlmacenService,
    private materialService: MaterialService,
    private mantenimientoService: MantenimientoService,
    private mermaService: MermaService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;

    this.materialService.getMateriales().subscribe(materiales => {
      this.materiales = materiales.materiales;
    });

    if (this.almacenService.material) {
      this.material = this.almacenService.material._id;
      this.cargarEntradas(this.almacenService.material._id);
      this.cargarMantenimientos(this.almacenService.material._id);
      this.cargarMermas(this.almacenService.material._id);
    } else {
      this.cargarEntradas(undefined);
      this.cargarMantenimientos(undefined);
      this.cargarMermas(undefined);
    }

    /* #region  Socket.IO */
    this.socket.on('new-entrada', function () {
      this.cargarEntradas();
      this.cargarMantenimientos();
    }.bind(this));

    this.socket.on('update-entrada', function (data: any) {
      if (data.data._id) {
        this.cargarEntradas();
        this.cargarMantenimientos();
      }
    }.bind(this));

    this.socket.on('delete-entrada', function () {
      this.cargarEntradas();
      this.cargarMantenimientos();
    }.bind(this));
    /* #endregion */
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
      if (this.dataSource.filteredData.length === 0) {
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

    this.almacenService.material = new Material();
  }

  cargarEntradas(material) {
    this.cargando = true;

    this.entradaService.getEntradas('', '', material, 'I').subscribe(entradas => {
      entradas.entradas.forEach(e => {
        e.detalles.forEach(d => {
          if (d.material.tipo === 'I') {
            this.movimiento = new Movimiento();
            this.movimiento.tipo = 'Entrada';
            this.movimiento.IO = 'I';
            this.movimiento.fEntrada = e.fEntrada;
            this.movimiento.noFactura = e.noFactura;
            this.movimiento.fFactura = e.fFactura;
            this.movimiento.cantidad = d.cantidad;

            this.movimiento.idMaterial = d.material._id;
            this.movimiento.material = d.material.descripcion;
            // this.movimiento.costo = d.costo.$numberDecimal;
            // this.movimiento.proveedor = e.proveedor;
            this.movimientos.push(this.movimiento);
          }
        });

      });

      if (material != undefined && material !== '') {
        this.movimientos = this.movimientos.filter(m => { return m.idMaterial == material });
      } else {
      }

      this.dataSource = new MatTableDataSource(this.movimientos);
      if (entradas.entradas.length === 0 || entradas.entradas === undefined) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = this.movimientos.length;
    });
    this.cargando = false;
  }

  cargarMantenimientos(material) {
    this.cargando = true;

    this.mantenimientoService.getMantenimientos('', '', '', '', '', material).subscribe(mantenimientos => {


      mantenimientos.mantenimientos.forEach(mant => {
        mant.materiales.forEach(material => {
          if (material.material.tipo === 'I') {
            this.movimiento = new Movimiento();
            this.movimiento.tipo = 'Mantenimiento';
            this.movimiento.IO = 'O';
            this.movimiento.fEntrada = material.fAlta;
            this.movimiento.noFactura = mant.maniobra.contenedor;
            this.movimiento.fFactura = mant.fAlta;
            this.movimiento.cantidad = material.cantidad;
            this.movimiento.idMaterial = material._id;
            this.movimiento.material = material.descripcion;
            // this.movimiento.costo = material.costo.$numberDecimal;
            // this.movimiento.proveedor = mant.proveedor;
            this.movimientos.push(this.movimiento);
          }
        });

      });

      if (material != undefined && material !== '') {
        this.movimientos = this.movimientos.filter(m => { return m.idMaterial == material });
      } else {
      }

      this.dataSource = new MatTableDataSource(this.movimientos);
      if (mantenimientos.mantenimientos.length === 0 || mantenimientos.mantenimientos === undefined) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = this.movimientos.length;
    });
    this.cargando = false;
  }

  cargarMermas(material) {
    this.cargando = true;

    this.mermaService.getMermas('', '', material).subscribe(mermas => {


      mermas.mermas.forEach(merma => {
        merma.materiales.forEach(material => {
          if (material.material.tipo === 'I') {
            this.movimiento = new Movimiento();
            this.movimiento.tipo = 'Merma';
            this.movimiento.IO = 'O';
            this.movimiento.fEntrada = material.material.fAlta;
            this.movimiento.noFactura = merma.motivo;
            this.movimiento.fFactura = merma.fAlta;
            this.movimiento.cantidad = material.cantidad;
            this.movimiento.idMaterial = material.material._id;
            this.movimiento.material = material.material.descripcion;
            // this.movimiento.costo = material.material.costo.$numberDecimal;
            // this.movimiento.proveedor = merma.proveedor;
            this.movimientos.push(this.movimiento);
          }
        });

      });

      if (material != undefined && material !== '') {
        this.movimientos = this.movimientos.filter(m => { return m.idMaterial == material });
      } else {
      }

      this.dataSource = new MatTableDataSource(this.movimientos);
      if (mermas.mermas.length === 0 || mermas.mermas === undefined) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = this.movimientos.length;
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
        fFactura: d.fFactura.substring(0, 10),
        noFactura: d.noFactura,
        cantidad: d.cantidad,
        material: d.material,
        costo: d.costo,
        proveedor: d.proveedor.razonSocial,
        // detalles: d.detalles
      };
      this.entradasExcel.push(entradas);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.entradasExcel != undefined && this.entradasExcel != null && this.entradasExcel.length > 0) {
      this.excelService.exportAsExcelFile(this.entradasExcel, 'Movimientos_de_Material');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

}

