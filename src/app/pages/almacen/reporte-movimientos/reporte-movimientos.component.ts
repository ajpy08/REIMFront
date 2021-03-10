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

import { MatPaginator, MatSort, MatTableDataSource, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { Usuario } from '../../usuarios/usuario.model';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { Material } from '../materiales/material.models';
import * as _moment from "moment";
import { DatePipe } from "@angular/common";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
declare var swal: any;

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ["l", "L"]
  },
  display: {
    dateInput: "L",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: 'app-reporte-movimientos',
  templateUrl: './reporte-movimientos.component.html',
  styleUrls: ['./reporte-movimientos.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "es-mx" }
  ]
})
export class ReporteMovimientosComponent implements OnInit {
  fIni = moment()
    .local()
    .startOf("day")
    .subtract(1, "month");
  fFin = moment()
    .local()
    .startOf("day");

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

      materiales.materiales.forEach(m => {
        if (m.tipo === 'I') {
          this.materiales.push(m);
        }
      });
    });
    if (this.almacenService.material) {
      this.material = this.almacenService.material._id;
    }
    this.cargarDatos(this.material);

    // } else {
    //   this.cargarEntradas(undefined);
    //   this.cargarMantenimientos(undefined);
    //   this.cargarMermas(undefined);
    // }

    /* #region  Socket.IO */
    this.socket.on('new-entrada', function () {
      this.cargarDatos(this.material);
    }.bind(this));

    this.socket.on('update-entrada', function (data: any) {
      if (data.data._id) {
        this.cargarDatos(this.material);
      }
    }.bind(this));

    this.socket.on('delete-entrada', function () {
      this.cargarDatos(this.material);
    }.bind(this));
    /* #endregion */
  }

  cargarDatos(material) {
    this.movimientos = [];

    this.cargarEntradas(material);
    this.cargarMantenimientos(material);
    this.cargarMermasAprobadas(material);
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

    this.entradaService.getEntradas('', '', material, 'I',
      this.fIni ? this.fIni.utc().format("DD-MM-YYYY") : "",
      this.fFin ? this.fFin.utc().format("DD-MM-YYYY") : "").subscribe(entradas => {
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

    this.mantenimientoService.getMantenimientosConMaterial('', '', '', '', '', material,
      this.fIni ? this.fIni.utc().format("DD-MM-YYYY") : "",
      this.fFin ? this.fFin.utc().format("DD-MM-YYYY") : "").subscribe(mantenimientos => {


        mantenimientos.mantenimientos.forEach(mant => {
          mant.materiales.forEach(material => {
            if (material.material.tipo === 'I') {
              this.movimiento = new Movimiento();
              this.movimiento.tipo = 'Mantenimiento';
              this.movimiento.IO = 'O';
              this.movimiento.fEntrada = mant.fAlta;
              this.movimiento.noFactura = mant.maniobra.contenedor;
              this.movimiento.fFactura = material.fAlta;
              this.movimiento.cantidad = material.cantidad;
              this.movimiento.idMaterial = material._id;
              this.movimiento.material = material.descripcion;
              // this.movimiento.costo = material.costo.$numberDecimal;
              // this.movimiento.proveedor = mant.proveedor;
              this.movimientos.push(this.movimiento);
            }
          });

        });

        // if (material != undefined && material !== '') {
        //   this.movimientos = this.movimientos.filter(m => { return m.idMaterial == material });
        // } else {
        // }

        this.dataSource = new MatTableDataSource(this.movimientos);
        if (mantenimientos.mantenimientos.length === 0 || mantenimientos.mantenimientos === undefined) {
          this.tablaCargar = true;
        } else {
          this.tablaCargar = false;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = this.movimientos.length;
        console.log(this.movimientos);
      });
    this.cargando = false;
  }

  cargarMermasAprobadas(material) {
    this.cargando = true;

    this.mermaService.getMermasAprobadas('', '', material,
      this.fIni ? this.fIni.utc().format("DD-MM-YYYY") : "",
      this.fFin ? this.fFin.utc().format("DD-MM-YYYY") : "").subscribe(mermas => {


        mermas.mermas.forEach(merma => {
          merma.materiales.forEach(material => {
            if (material.material.tipo === 'I') {
              this.movimiento = new Movimiento();
              this.movimiento.tipo = 'Merma';
              this.movimiento.IO = 'O';
              this.movimiento.fEntrada = merma.fAprobacion;
              this.movimiento.noFactura = merma.motivo;
              this.movimiento.fFactura = material.material.fAlta;
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
        IO: d.IO,
        tipo: d.tipo,
        fEntrada: d.fEntrada,
        noFactura: d.noFactura,
        fFactura: d.fFactura.substring(0, 10),
        cantidad: d.cantidad,
        material: d.material,
        // costo: d.costo,
        // proveedor: d.proveedor !== undefined ? d.proveedor.razonSocial : '',
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

