import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ManiobraService } from '../../services/service.index';
import { ExcelService } from '../../services/service.index';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import * as _moment from 'moment';
import swal from 'sweetalert';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatTabChangeEvent,
  MatTabGroup
} from '@angular/material';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Maniobra } from 'src/app/models/maniobra.models';
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L']
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }
  ]
})
export class ReportesComponent implements OnInit {
  maniobraContenedor: any[] = [];
  ManiobrasExcel = [];
  horas = [];
  minutos = [];
  reparaciones20: any;
  reparaciones40: any;
  lavado20: any;
  lavado40: any;
  maniobraslavado: Maniobra[] = [];
  maniobras: Maniobra[] = [];
  data: any = { fechaCreado: '' };
  cargando = false;
  c40: any;
  c20: any;
  totalRegistros = 0;
  totalPenLavar = 0;
  totalPenReparar = 0;
  totalReparacion = 0;
  tiempo: any[] = [];
  tiempoLavado: any[] = [];
  fIniLlegada = moment()
    .local()
    .startOf('day');
  fFinLlegada = moment()
    .local()
    .startOf('day');
  contenedor: string = undefined;
  displayedColumns = [
    'contenedor',
    'tipo',
    'fIniLavado',
    'hIniLavado',
    'hFinLavado',
    'tiempoLavado',
  ];
  displayedColumnsXLavar = [
    'fAlta',
    'contenedor',
    'tipo',
    'lavado'
  ];

  displayedColumnsReparaciones = [
    'buque',
    'contenedor',
    'tipo',
    'fIniReparacion',
    'hIniReparacion',
    'fFinReparacion',
    'hFinReparacion',
    'tiempoReparacion'
  ];

  displayedColumnsPenXReparar = [
    'buque',
    'contenedor',
    'tipo',
    'fAlta',
    'reparaciones'
  ];

  dataSource: any;
  dtxLavar: any;
  dtxReparar: any;
  dtReparacion: any;
  checkedContenedor = false;
  checkedTipo20 = false;
  checkedTipo40 = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('pagXLavar', { read: MatPaginator }) pagXLavar: MatPaginator;
  @ViewChild('pagXReparar', { read: MatPaginator }) pagXReparar: MatPaginator;
  @ViewChild('pagReparaciones', { read: MatPaginator }) pagReparaciones: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortXLavar') sortXLavar: MatSort;
  @ViewChild('sortXReparar') sortXReparar: MatSort;
  @ViewChild('sortReparaciones') sortReparaciones: MatSort;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(public _maniobraService: ManiobraService,
    public _excelService: ExcelService,
    private router: Router) { }

  ngOnInit() {

    this.consultaXlavar();
    this.consultaXreparar();
    this.consultarlavado();
    this.cargarLR();

    // this.consultaManiobras().then(
    //   (value: { ok: Boolean; mensaje: String }) => { }
    // );
    const indexTAB = localStorage.getItem('TiemposTab');
    if (localStorage.getItem('TiemposTab')) {
      if (indexTAB) {
        // tslint:disable-next-line: radix
        this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
      }
    } else {
      this.tabGroup.selectedIndex = 0;
    }

  }

  cargarLR() {
    const lavado = this.consultarlavado();
    const promesa = this.consultarReparaciones();

    lavado.then((value: boolean) => {
      if (value) {
        this.group20_40L(this.maniobraslavado);
      }
    });

    promesa.then((value: boolean) => {
      if (value) {
        this.group20_40(this.maniobras);
      }
    });
  }

  filtrar(bool: boolean, tipo20: boolean, tipo40: boolean) {
    if (bool === true) {
      if (this.contenedor !== undefined && this.contenedor !== '') {
        this.consultarContenedor();
      } else {
        swal('Error', 'Debes de escribir un contenedor', 'error');
      }
    } else if (bool === false && tipo20 === false && tipo40 === false) {
      this.consultaLavadoXFechas();
    } else if (tipo20 === true || tipo40 === true) {
      if (tipo20) {
        this.consultaTipo('20');
      } else {
        this.consultaTipo('40');
      }
    }
  }

  filtrarReparaciones(reparaciones: boolean, tipo20: boolean, tipo40: boolean) {
    if (reparaciones === true) {
      if (this.contenedor !== undefined && this.contenedor !== '') {
        this.consultarContenedorR();
      } else {
        swal('Error', 'Debes de escribir un contenedor', 'error');
      }
    } else if (reparaciones === false && tipo20 === false && tipo40 === false) {
      this.consultarReparacionesXfecha();
    } else if (tipo40 === true || tipo20 === true) {
      if (tipo20) {
        this.consultaTipoR('20');
      } else {
        this.consultaTipoR('40');
      }
    }
  }

  tiempos(tiempo: any) {
    let resultadoxTipo;
    let totalM = 0;
    let totalh = 0;
    let mString = 0;
    this.horas = [];
    let final = 0;
    this.minutos = [];



    tiempo.forEach(s => {

      // tslint:disable-next-line: radix
      const m = parseInt(s.substr(3, 2));
      // tslint:disable-next-line: radix
      const h = parseInt(s.substr(0, 2));
      this.minutos.push(m);
      this.horas.push(h);
    });
    totalM = this.minutos.reduce((a, b) => a + b, 0);
    totalh = this.horas.reduce((a, b) => a + b, 0);

    if (totalM === 0 && totalh === 0 ) {
      resultadoxTipo = '00:00';
      return resultadoxTipo;
    }



    const min = totalM / 60;
    const total = totalh + min;
    const promedio = total / tiempo.length;
    const ent = promedio.toString();

    if (min > 0) {
      // tslint:disable-next-line: radix
      mString = parseInt(ent.substr(2, 2));
    } else {
      final = 0 + 0;
    }
    // tslint:disable-next-line: radix
    const hors = parseInt(ent.substr(0, 1));
    const pend = '0.' + mString;
    const r = + pend * 60;
    final = Math.round(r);
    if (hors < 10 && final < 10) {
      resultadoxTipo = '0' + hors + ':' + '0' + final;
    } else {
      resultadoxTipo = hors + ':' + final;
    }
    return resultadoxTipo;

  }

  tiemposContenedores(tipo: string) {
    this.tiempo = [];
    let tiempoFinal = 0;
    let final = '';
    if (tipo.includes('20')) {
      if (this.reparaciones20 !== undefined) {
        this.reparaciones20.forEach(g20 => {
          g20.maniobras.forEach(g20maniobras => {
            if (tipo === '20') {
              tiempoFinal = this.time(g20maniobras.hIniReparacion, g20maniobras.hFinReparacion);
              this.tiempo.push(tiempoFinal);
            }

            if (g20maniobras.tipo === tipo) {
              tiempoFinal = this.time(g20maniobras.hIniReparacion, g20maniobras.hFinReparacion);
              this.tiempo.push(tiempoFinal);
            }
          });
        });
      } 
    } else if (tipo.includes('40')) {
      if (this.reparaciones40 !== undefined) {
        this.reparaciones40.forEach(g40 => {
          g40.maniobras.forEach(g40maniobras => {
            if (tipo === '40') {
              tiempoFinal = this.time(g40maniobras.hIniReparacion, g40maniobras.hFinReparacion);
              this.tiempo.push(tiempoFinal);
            }
            if (g40maniobras.tipo === tipo) {
              tiempoFinal = this.time(g40maniobras.hIniReparacion, g40maniobras.hFinReparacion);
              this.tiempo.push(tiempoFinal);
            }
          });
        });
      } 
    }
    final = this.tiempos(this.tiempo);
    return final;
  }

  tiemposContenedoresLavado(tipo: string) {
    this.tiempoLavado = [];
    let tiempoFinal = 0;
    let finalLavado = '';
    if (tipo.includes('20')) {
      if (this.lavado20 !== undefined) {
        this.lavado20.forEach(g20 => {
          g20.maniobras.forEach(g20maniobras => {
            if (tipo === '20') {
              tiempoFinal = this.time(g20maniobras.hIniLavado, g20maniobras.hFinLavado);
              this.tiempoLavado.push(tiempoFinal);
            }

            if (g20maniobras.tipo === tipo) {
              tiempoFinal = this.time(g20maniobras.hIniLavado, g20maniobras.hFinLavado);
              this.tiempoLavado.push(tiempoFinal);
            }
          });
        });
      } 
    } else if (tipo.includes('40')) {
      if (this.lavado40 !== undefined) {
        this.lavado40.forEach(g40 => {
          g40.maniobras.forEach(g40maniobras => {
            if (tipo === '40') {
              tiempoFinal = this.time(g40maniobras.hIniLavado, g40maniobras.hFinLavado);
              this.tiempoLavado.push(tiempoFinal);
            }
            if (g40maniobras.tipo === tipo) {
              tiempoFinal = this.time(g40maniobras.hIniLavado, g40maniobras.hFinLavado);
              this.tiempoLavado.push(tiempoFinal);
            }
          });
        });
      } 
    }
    finalLavado = this.tiempos(this.tiempoLavado);
    return finalLavado;
  }

  group20_40(maniobras) {
    // let totalReparacion20 = 0;

    this.c20 = maniobras.filter(m => m.tipo.includes('20'));
    const group20 = this.c20.reduce((curr, m) => {
      if (!curr[m.tipo]) {
        curr[m.tipo] = [m];
      } else {
        curr[m.tipo].push(m);
      }
      return curr;

    }, {});

    if (group20) {

      this.reparaciones20 = Object.keys(group20).map(tipo => {
        return {

          tipo: tipo,
          maniobras: group20[tipo]
        };
      });


      // const totalTime = this.time(group20.)

    }

    // ! COTENEDORES DE 40 REPARACIONES

    this.c40 = maniobras.filter(m => m.tipo.includes('40'));
    const group40 = this.c40.reduce((curr, m) => {
      if (!curr[m.tipo]) {
        curr[m.tipo] = [m];
      } else {
        curr[m.tipo].push(m);
      }
      return curr;
    }, {});

    if (group40) {
      this.reparaciones40 = Object.keys(group40).map(tipo => {
        return {
          tipo: tipo,
          maniobras: group40[tipo]
        };
      });
    }
  }

  group20_40L(maniobras) {
    // let totalReparacion20 = 0;

    this.c20 = maniobras.filter(m => m.tipo.includes('20'));
    const group20 = this.c20.reduce((curr, m) => {
      if (!curr[m.tipo]) {
        curr[m.tipo] = [m];
      } else {
        curr[m.tipo].push(m);
      }
      return curr;

    }, {});

    if (group20) {

      this.lavado20 = Object.keys(group20).map(tipo => {
        return {

          tipo: tipo,
          maniobras: group20[tipo]
        };
      });


      // const totalTime = this.time(group20.)

    }

    // ! COTENEDORES DE 40 REPARACIONES

    this.c40 = maniobras.filter(m => m.tipo.includes('40'));
    const group40 = this.c40.reduce((curr, m) => {
      if (!curr[m.tipo]) {
        curr[m.tipo] = [m];
      } else {
        curr[m.tipo].push(m);
      }
      return curr;
    }, {});

    if (group40) {
      this.lavado40 = Object.keys(group40).map(tipo => {
        return {
          tipo: tipo,
          maniobras: group40[tipo]
        };
      });
    }
  }

  consultarReparaciones() {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._maniobraService
        .getReporteR(
          null, null, null
        )
        .subscribe(
          maniobras => {

            this.dtReparacion = new MatTableDataSource(maniobras.consulta);
            this.dtReparacion.sort = this.sortReparaciones;
            this.dtReparacion.paginator = this.pagReparaciones;
            this.totalReparacion = maniobras.total;
            this.maniobras = maniobras.consulta;

            if (this.maniobras) {
              resolve(true);
            }
          },
          () => {
            reject('Failed!!');
          }
        );
      this.cargando = false;
    });
  }
  consultarReparacionesXfecha() {
    this.cargando = true;
    return new Promise((resolve, reject) => {
      this._maniobraService
        .getReporteR(
          this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
          this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : '', null
        )
        .subscribe(
          maniobras => {
            this.dtReparacion = new MatTableDataSource(maniobras.consulta);
            this.dtReparacion.sort = this.sortReparaciones;
            this.dtReparacion.paginator = this.pagReparaciones;
            this.totalReparacion = maniobras.total;
            resolve({ ok: true, mensaje: 'Termine' });
          },
          () => {
            reject('Failed!!');
          }
        );
      this.cargando = false;
    });
  }
  consultaXreparar() {
    this._maniobraService.getXReparar().subscribe(xreparar => {
      this.dtxReparar = new MatTableDataSource(xreparar.consulta);
      this.dtxReparar.sort = this.sortXReparar;
      this.dtxReparar.paginator = this.pagXReparar;
      this.totalPenReparar = xreparar.total;
    });
  }

  consultaXlavar() {
    this._maniobraService.getXLAvar().subscribe(xlavar => {
      this.dtxLavar = new MatTableDataSource(xlavar.consulta);
      this.dtxLavar.sort = this.sortXLavar;
      this.dtxLavar.paginator = this.pagXLavar;
      this.totalPenLavar = xlavar.total;
    });
  }

  consultaTipo(tipo: string) {
    this.cargando = true;
    return new Promise((resolve, reject) => {
      this._maniobraService.getReporte(this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
        this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : '', tipo).subscribe(maniobras => {
          this.dataSource = new MatTableDataSource(maniobras.consulta);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = maniobras.consulta.length;
          resolve({ ok: true, mensaje: 'Termine' });
        }, () => {
          reject('FILED!!');
        });
      this.cargando = false;
    });
  }

  consultaTipoR(tipo: string) {
    this.cargando = true;
    return new Promise((resolve, reject) => {
      this._maniobraService.getReporteR(this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
        this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : '', tipo).subscribe(maniobras => {

          this.dtReparacion = new MatTableDataSource(maniobras.consulta);
          this.dtReparacion.sort = this.sortReparaciones;
          this.dtReparacion.paginator = this.pagReparaciones;
          this.totalReparacion = maniobras.consulta.length;
          resolve({ ok: true, mensaje: 'Termine' });
        }, () => {
          reject('FILED!!');
        });
      this.cargando = false;
    });
  }

  consultaLavadoXFechas() {
    this.cargando = true;
    return new Promise((resolve, reject) => {
      this._maniobraService
        .getReporte(
          this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
          this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : '', null
        )
        .subscribe(
          maniobras => {
            this.dataSource = new MatTableDataSource(maniobras.consulta);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = maniobras.total;
            resolve({ ok: true, mensaje: 'Termine' });
          },
          () => {
            reject('Failed!!');
          }
        );
      this.cargando = false;
    });
  }

  consultarlavado() {
    this.cargando = true;
    return new Promise((resolve, reject) => {
      this._maniobraService
        .getReporte(
          null, null, null
        )
        .subscribe(
          maniobras => {
            this.dataSource = new MatTableDataSource(maniobras.consulta);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = maniobras.total;
            this.maniobraslavado = maniobras.consulta;

            if (this.maniobraslavado) {
              resolve(true);
            }
          },
          () => {
            reject('Failed!!');
          }
        );
      this.cargando = false;
    });
  }

  time(hIni, hFin) {
    let resultado;
    const a = moment([hIni], 'HH:mm');
    const b = moment([hFin], 'HH:mm');
    const diffH = Math.abs(b.diff(a, 'hours'));
    const diffM = Math.abs(b.diff(a, 'minutes'));

    if (diffM > 59) {
      const minRestantes = diffM - (diffH * 60);
      resultado = (diffH < 10 ? '0' : '') + diffH + ':' + (minRestantes < 10 ? '0' : '') + minRestantes;
    } else {
      if (hFin !== undefined) {
        resultado = '00:' + (diffM < 10 ? '0' : '') + diffM;
      } else {
        resultado = '00:00';
      }
    }
    return resultado;
  }

  consultarContenedor() {
    return new Promise((resolve, reject) => {
      this._maniobraService
        .getManiobras(
          null,
          null,
          null,
          this.contenedor,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        )
        .subscribe(
          maniobras => {
            maniobras.maniobras.forEach(t => {
              if (t.hIniLavado) {
                this.time(t.hIniLavado, t.hFinLavado);
              }
            });
            this.dataSource = new MatTableDataSource(maniobras.maniobras);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = maniobras.total;
            resolve({ ok: true, mensaje: 'Termine' });
          },
          () => {
            reject('Failed!!');
          }
        );
    });
  }

  consultarContenedorR() {
    return new Promise((resolve, reject) => {
      this._maniobraService
        .getManiobras(
          null,
          null,
          null,
          this.contenedor,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        )
        .subscribe(
          maniobras => {
            this.dtReparacion = new MatTableDataSource(maniobras.maniobras);
            this.dtReparacion.sort = this.sortReparaciones;
            this.dtReparacion.paginator = this.pagReparaciones;
            this.totalReparacion = maniobras.total;
            resolve({ ok: true, mensaje: 'Termine' });
          },
          () => {
            reject('Failed!!');
          }
        );
    });
  }

  /* #region  FILTERS KEYUP */
  // ! LAVADO
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error('Error al filtrar lavado de Reportes');
    }
  }

  // ! PENDIENTE POR LAVAR
  applyFilterXlavar(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if (this.dtxLavar && this.dtxLavar.data.length > 0) {
      this.dtxLavar.filter = filterValue;
      this.totalPenLavar = this.dtxLavar.filteredData.length;
    } else {
      console.error('Error al filtrar Pendientes por Lavar de Reportes');
    }
  }

  // ! REPARACIONES
  applyFilterReparaciones(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if (this.dtReparacion && this.dtReparacion.data.length > 0) {
      this.dtReparacion.filter = filterValue;
      this.totalPenLavar = this.dtReparacion.filteredData.length;
    } else {
      console.error('Error al filtrar Reparaciones de Reportes');
    }
  }

  // ! PENDIENTES POR REPARAR
  applyFilterXreparar(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if (this.dtxReparar && this.dtxReparar.data.length > 0) {
      this.dtxReparar.filter = filterValue;
      this.totalPenLavar = this.dtxReparar.filteredData.length;
    } else {
      console.error('Error al filtrar Pendientes por Reparar de Reportes');
    }
  }





  /* #endregion */



  /* #region  EXCEL LAVADO */


  CreaDatosExcel(datos) {
    this.ManiobrasExcel = [];
    datos.forEach(m => {
      let resultado = '';
      resultado = this.time(m.hIniLavado, m.hFinLavado);
      const maniobra = {
        Contenedor: m.contenedor,
        Tipo: m.tipo,
        Fecha: m.fIniLavado !== undefined ? m.fLlegada.substring(0, 10) : '',
        Hora_Inicio_Lavado: m.hIniLavado,
        Hora_Fin_Lavado: m.hFinLavado,
        tiempo: resultado

      };
      this.ManiobrasExcel.push(maniobra);
    });
  }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dataSource.data);
    if (this.ManiobrasExcel) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasExcel,
        'Tiempos_Lavado'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
  /* #endregion */


  /* #region  EXCEL PENDIENTE DE LAVAR  */

  CreaDatosExcelPenLavar(datos) {
    this.ManiobrasExcel = [];
    datos.forEach(m => {

      const maniobra = {
        Contenedor: m.contenedor,
        Tipo: m.tipo,
        Fecha_Alta: m.fAlta !== undefined ? m.fLlegada.substring(0, 10) : '',
        Lavado: m.lavado
      };
      this.ManiobrasExcel.push(maniobra);
    });
  }

  exportAsXLSXPenLavar(): void {
    this.CreaDatosExcelPenLavar(this.dtxLavar.data);
    if (this.ManiobrasExcel) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasExcel,
        'Pendientes_X_Lavar'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
  /* #endregion */


  /* #region   EXCEL PENDIENTES POR REPARAR */
  CreaDatosExcelPenReparar(datos) {
    this.ManiobrasExcel = [];
    datos.forEach(m => {

      let reparaciones = '';

      m.reparaciones.forEach(r => {
        reparaciones += r.reparacion + ', ';
      });

      reparaciones = reparaciones.substring(0, reparaciones.length - 2);

      let observaciones = '';

      if (m.lavadoObservacion !== undefined && reparaciones !== '') {
        observaciones += `LAVADO OBSERVACION: ${m.lavadoObservacion} \nREPARACION OBSERVACION: ${reparaciones}`;
      } else {
        if (m.lavadoObservacion !== undefined) {
          observaciones += `LAVADO OBSERVACION: ${m.lavadoObservacion}`;
        } else {
          if (reparaciones !== '') {
            observaciones += `REPARACION OBSERVACION: ${reparaciones}`;
          }
        }
      }


      const maniobra = {
        Nombre_Buque: m.viaje.buque && m.viaje.buque !== undefined && m.viaje.buque.nombre !== '' ? m.viaje.buque.nombre : '' && m.viaje.buque.nombre,
        Contenedor: m.contenedor,
        Tipo: m.tipo,
        Fecha_Alta: m.fAlta !== undefined ? m.fLlegada.substring(0, 10) : '',
        Reparaciones: reparaciones,
        observaciones: observaciones,

      };
      this.ManiobrasExcel.push(maniobra);
    });
  }
  exportAsXLSXPenReparar() {
    this.CreaDatosExcelPenReparar(this.dtxReparar.data);
    if (this.ManiobrasExcel.length > 0) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasExcel,
        'Pendientes_X_Reparar'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
  /* #endregion */

  /* #region  EXCEL REPARACIONES */
  CreaDatosExcelReparaciones(datos) {
    this.ManiobrasExcel = [];
    datos.forEach(m => {
      let resultado = '';
      resultado = this.time(m.hIniReparacion, m.hFinReparacion);


      const maniobra = {
        Nombre_Buque: m.viaje.buque && m.viaje.buque !== undefined && m.viaje.buque.nombre !== '' ? m.viaje.buque.nombre : '' && m.viaje.buque.nombre,
        Contenedor: m.contenedor,
        Tipo: m.tipo,
        Fecha_Inicio_Reparacion: m.fIniReparacion !== undefined ? m.fLlegada.substring(0, 10) : '',
        Hora_Inicio_Reparacion: m.hIniReparacion,
        Fecha_Fin_Reparacion: m.fFinReparacion !== undefined ? m.fLlegada.substring(0, 10) : '',
        Hpra_Fin_Reparacion: m.hFinReparacion,
        Tiempo: resultado,
      };
      this.ManiobrasExcel.push(maniobra);
    });
  }
  exportAsXLSXReparaciones() {
    this.CreaDatosExcelReparaciones(this.dtReparacion.data);
    if (this.ManiobrasExcel.length > 0) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasExcel,
        'Tiempo Reparaciones'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
  /* #endregion */

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('TiemposTab', event.index.toString());
  }

}
