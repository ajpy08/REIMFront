import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService, ViajeService } from '../../../services/service.index';
import { ExcelService } from '../../../services/service.index';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import * as Moment from 'moment';
import swal from 'sweetalert';

import { Viaje } from '../../viajes/viaje.models';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AsignarFacturaComponent } from '../asignar-factura/asignar-factura.component';
import { Router, UrlHandlingStrategy } from '@angular/router';


const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM DD',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM DD',
  },
};

@Component({
  selector: 'app-facturacion-maniobras',
  templateUrl: './facturacion-maniobras.component.html',
  styleUrls: ['./facturacion-maniobras.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FacturacionManiobrasComponent implements OnInit {
  date = new FormControl(moment());
  //maniobras: any[] = [];
  //maniobrasSeleccionadas: string[] = [];
  maniobrasSinFacturaVacios: any[] = [];
  maniobrasSinFacturaLavadoVacios: any[] = [];
  maniobrasSinFacturaReparacionVacios: any[] = [];

  maniobrasVaciosDescagadas: any[] = [];
  maniobrasVaciosLavadoDescagadas: any[] = [];
  maniobrasVaciosReparacionDescagadas: any[] = [];

  ManiobrasVaciosExcel = [];
  ManiobrasVaciosLavadoExcel = [];
  ManiobrasVaciosReparacionExcel = [];
  data: any = { fechaCreado: '' };
  cargando = true;
  totalRegistrosVacios = 0;
  totalRegistrosLavadoVacios = 0;
  totalRegistrosReparacionVacios = 0;

  displayedColumns = ['select', 'actions', 'folio', 'cargaDescarga', 'contenedor', 'tipo', 'lavado', 'grado',
    'fLlegada', 'operador', 'placa', 'transportista', 'reparaciones', 'facturaManiobra', 'viaje',
    'buque', 'peso', 'cliente', 'agencia', 'estatus', 'hDescarga',];
  dataSourceVacios: any;
  dataSourceLavadoVacios: any;
  dataSourceReparacionVacios: any;
  selectionVacios = new SelectionModel<Maniobra>(true, []);
  selectionLavadoVacios = new SelectionModel<Maniobra>(true, []);
  selectionReparacionVacios = new SelectionModel<Maniobra>(true, []);

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('MatPaginatorLavado', { read: MatPaginator}) MatPaginatorLavado: MatPaginator;
  @ViewChild('MatSortLavado') MatSortLavado: MatSort;

  @ViewChild('MatPaginatorReparacion', { read: MatPaginator}) MatPaginatorReparacion: MatPaginator
  @ViewChild('MatSortReparacion') MatSortReparacion: MatSort;

  @ViewChild(MatSort) sort: MatSort;

  checkedVacios = true;
  checkedHDescargaVacios = true;
  checkedHDescagaL = true;
  checkedHDescagaR = true;
  checkedLavadoVacios = true;
  checkedReparacionVacios = true;
  facturaVacios: string;
  facturaLavadoVacios: string;
  facturaReparacionVacios: string;
  fechaFiltroViaje: Date;
  viajes: Viaje[] = [];
  viaje: string = undefined;
  viajeLavado: string = undefined;
  viajeReparacion: string = undefined;
  CD: string = undefined;
  //filtrarCD = new FormControl(false);

  constructor(public _maniobraService: ManiobraService, public _viajeService: ViajeService,
    public _excelService: ExcelService, public matDialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.cargarViajes(new Date().toString());

    this.consultaManiobrasVacios().then((value: { ok: Boolean, mensaje: String }) => {
      if (value.ok && this.checkedVacios) {
        this.filtraManiobrasDescargaVacios(this.checkedVacios);
        if (this.checkedHDescargaVacios && this.dataSourceVacios.data.length > 0) {
          this.cargarManiobrasDescargadosVacios(this.checkedHDescargaVacios);
        }
      }
    });

    this.consultaManiobrasLavadoVacios().then((value: { ok: Boolean, mensaje: String }) => {
      if (value.ok && this.checkedLavadoVacios) {
        this.filtraManiobrasDescargaVaciosLavado(this.checkedLavadoVacios);
        if (this.checkedHDescagaL && this.dataSourceLavadoVacios.data.length > 0) {
          this.cargarManiobrasDescargadosVaciosLavados(this.checkedHDescagaL);
        }
      }
    });

    this.consultaManiobrasReparacionVacios().then((value: { ok: Boolean, mensaje: String }) => {
      if (value.ok && this.checkedReparacionVacios) {
        this.filtraManiobrasDescargaVaciosReparacion(this.checkedReparacionVacios);
        if (this.checkedHDescagaR && this.dataSourceReparacionVacios.data.length > 0) {
          this.cargarManiobrasDescargadosVaciosReparaciones(this.checkedHDescagaR);
        }
      }
    });
    let indexTAB = localStorage.getItem('FacturacionTabs');
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
  }

  consulta(){
    this.consultaManiobrasVacios().then((value: { ok: Boolean, mensaje: String }) => {
      if (value.ok && this.checkedVacios) {
        this.filtraManiobrasDescargaVacios(this.checkedVacios);
        if (this.checkedHDescargaVacios && this.dataSourceVacios.data.length > 0) {
          this.cargarManiobrasDescargadosVacios(this.checkedHDescargaVacios);
        }
      }
    });

    this.consultaManiobrasLavadoVacios().then((value: { ok: Boolean, mensaje: String }) => {
      if (value.ok && this.checkedLavadoVacios) {
        this.filtraManiobrasDescargaVaciosLavado(this.checkedLavadoVacios);
        if (this.checkedHDescagaL && this.dataSourceLavadoVacios.data.length > 0) {
          this.cargarManiobrasDescargadosVaciosLavados(this.checkedHDescagaL);
        }
      }
    });

    this.consultaManiobrasReparacionVacios().then((value: { ok: Boolean, mensaje: String }) => {
      if (value.ok && this.checkedReparacionVacios) {
        this.filtraManiobrasDescargaVaciosReparacion(this.checkedReparacionVacios);
        if (this.checkedHDescagaR && this.dataSourceReparacionVacios.data.length > 0) {
          this.cargarManiobrasDescargadosVaciosReparaciones(this.checkedHDescagaR);
        }
      }
    });
  }

  consultaManiobrasVacios() {
    return new Promise((resolve, reject) => {

      // let cargaDescarga = "D";

      // if(this.filtrarCD.value) {
      //   cargaDescarga = this.CD;
      // }
      this._maniobraService.getOtrasManiobras(null, this.viaje, "VACIO", false, false)
        .subscribe(maniobras => {
          this.dataSourceVacios = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceVacios.sort = this.sort;
          this.dataSourceVacios.paginator = this.paginator;
          this.totalRegistrosVacios = maniobras.total;

          if (this.dataSourceVacios.data.length > 0 && this.checkedVacios) {
            this.filtraManiobrasDescargaVacios(this.checkedVacios);
            // if (this.checkedHDescargaVacios && this.dataSourceVacios.data.length > 0) {
            //   this.cargarManiobrasDescargadosVacios(this.checkedHDescargaVacios);
            // }
          }

          resolve({ ok: true, mensaje: 'Termine' })
        },
          () => {
            reject('Failed!!');
          });
    });
  }

  consultaManiobrasLavadoVacios() {
    return new Promise((resolve, reject) => {
      //let cargaDescarga = "D";

      // if(this.filtrarCD.value) {
      //   cargaDescarga = this.CD;
      // }

      this._maniobraService.getOtrasManiobras(null, this.viaje, "VACIO", true, false)
        .subscribe(maniobras => {
          this.dataSourceLavadoVacios = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceLavadoVacios.sort = this.MatSortLavado;
          this.dataSourceLavadoVacios.paginator = this.MatPaginatorLavado;
          this.totalRegistrosLavadoVacios = maniobras.total;

          if (this.dataSourceLavadoVacios.data.length > 0 && this.checkedLavadoVacios) {
            this.filtraManiobrasDescargaVaciosLavado(this.checkedLavadoVacios);
          }

          resolve({ ok: true, mensaje: 'Termine' })
        },
          () => {
            reject('Failed!!');
          });
    });
  }

  consultaManiobrasReparacionVacios() {
    return new Promise((resolve, reject) => {
      let cargaDescarga = "D";

      // if(this.filtrarCD.value) {
      //   cargaDescarga = this.CD;
      // }

      this._maniobraService.getOtrasManiobras(null, this.viaje, "VACIO", false, true)
        .subscribe(maniobras => {
          this.dataSourceReparacionVacios = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceReparacionVacios.sort = this.MatSortReparacion;
          this.dataSourceReparacionVacios.paginator = this.MatPaginatorReparacion;
          this.totalRegistrosReparacionVacios = maniobras.total;

          if (this.dataSourceReparacionVacios.data.length > 0 && this.checkedReparacionVacios) {
            this.filtraManiobrasDescargaVaciosReparacion(this.checkedReparacionVacios);
          }

          resolve({ ok: true, mensaje: 'Termine' })
        },
          () => {
            reject('Failed!!');
          });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceVacios.filter = filterValue;
    this.totalRegistrosVacios = this.dataSourceVacios.filteredData.length;
  }

  filtraManiobrasDescargaVacios(sinFactura: boolean) {
    this.maniobrasSinFacturaVacios = [];
    this.checkedVacios = sinFactura;
    if (sinFactura) {
      //console.log("Filtro sin factura")
      this.dataSourceVacios.data.forEach(m => {
        if (!m.facturaManiobra) {
          this.maniobrasSinFacturaVacios.push(m);
        }
      });
      this.dataSourceVacios = new MatTableDataSource(this.maniobrasSinFacturaVacios);
      this.dataSourceVacios.sort = this.sort;
      this.dataSourceVacios.paginator = this.paginator;
      this.totalRegistrosVacios = this.dataSourceVacios.data.length;
      if (this.checkedHDescargaVacios && this.dataSourceVacios.data.length > 0) {
        //console.log("Filtro Descargados (dentro de filtro sin factura)")
        this.cargarManiobrasDescargadosVacios(this.checkedHDescargaVacios);
      } else {
        //console.log("No Filtro Descargados por que Descargados : " + this.checkedHDescargaVacios + " y el datasource tiene " + this.dataSourceVacios.data.length)
      }
    } else {
      //console.log("Filtro todos con y sin factura")
      if (this.checkedHDescargaVacios){
        this.consultaManiobrasVacios().then((value: { ok: Boolean, mensaje: String }) => {
          // if (value.ok && this.checkedVacios) {
          //   //console.log("Sin factura despues de recargar")
          //   this.filtraManiobrasDescargaVacios(this.checkedVacios);
          // } else {
            if (value.ok && this.checkedHDescargaVacios && this.dataSourceVacios.data.length > 0) {
              //console.log("Descargados despues de recargar")
              this.cargarManiobrasDescargadosVacios(this.checkedHDescargaVacios);
            }
          // }
        }).catch((error) => {
          console.log(error.mensaje)
        });
      }
    }
  }

  filtraManiobrasDescargaVaciosLavado(sinFactura: boolean) {
    this.maniobrasSinFacturaLavadoVacios = [];
    this.checkedLavadoVacios = sinFactura;
    if (sinFactura) {
      this.dataSourceLavadoVacios.data.forEach(m => {
        if (!m.facturaManiobra) {
          this.maniobrasSinFacturaLavadoVacios.push(m);
        }
      });
      this.dataSourceLavadoVacios = new MatTableDataSource(this.maniobrasSinFacturaLavadoVacios);
      this.dataSourceLavadoVacios.sort = this.MatSortLavado;
      this.dataSourceLavadoVacios.paginator = this.MatPaginatorLavado;
      this.totalRegistrosLavadoVacios = this.dataSourceLavadoVacios.data.length;
      if (this.checkedHDescagaL && this.dataSourceLavadoVacios.data.length > 0) {
        this.cargarManiobrasDescargadosVaciosLavados(this.checkedHDescagaL);
      }
    } else {
      if (this.checkedHDescagaL){
        this.consultaManiobrasLavadoVacios().then((value: { ok: Boolean, mensaje: String }) => {
          // if (value.ok && this.checkedLavadoVacios) {
          //   this.cargarManiobrasSinFacturaLavadoVacios(this.checkedLavadoVacios);
          // } else {
            if (value.ok && this.checkedHDescagaL && this.dataSourceLavadoVacios.data.length > 0) {
              this.cargarManiobrasDescargadosVaciosLavados(this.checkedHDescagaL);
            }
          // }
        }).catch((error) => {
          console.log(error.mensaje)
        });
      }
    }
  }

  filtraManiobrasDescargaVaciosReparacion(sinFactura: boolean) {
    this.maniobrasSinFacturaReparacionVacios = [];
    this.checkedReparacionVacios = sinFactura;
    if (sinFactura) {
      this.dataSourceReparacionVacios.data.forEach(m => {
        if (!m.facturaManiobra) {
          this.maniobrasSinFacturaReparacionVacios.push(m);
        }
      });
      this.dataSourceReparacionVacios = new MatTableDataSource(this.maniobrasSinFacturaReparacionVacios);
      this.dataSourceReparacionVacios.sort = this.MatSortReparacion;
      this.dataSourceReparacionVacios.paginator = this.MatPaginatorReparacion;
      this.totalRegistrosReparacionVacios = this.dataSourceReparacionVacios.data.length;
      if (this.checkedHDescagaR && this.dataSourceReparacionVacios.data.length > 0) {
        this.cargarManiobrasDescargadosVaciosReparaciones(this.checkedHDescagaR);
      }
    } else {
      if (this.checkedHDescagaR) {
        this.consultaManiobrasReparacionVacios().then((value: { ok: Boolean, mensaje: String }) => {
          // if (value.ok && this.checkedReparacionVacios) {
          //   this.cargarManiobrasSinFacturaReparacionVacios(this.checkedReparacionVacios);
          // } else {
            if (value.ok && this.checkedHDescagaR && this.dataSourceReparacionVacios.data.length > 0) {
              this.cargarManiobrasDescargadosVaciosReparaciones(this.checkedHDescagaR);
            }
          // }
        }).catch((error) => {
          console.log(error.mensaje)
        });
      } 
    }
  }

  cargarManiobrasDescargadosVacios(descargados: boolean) {
    this.maniobrasVaciosDescagadas = [];
    this.checkedHDescargaVacios = descargados;
    if (descargados) {
      this.dataSourceVacios.data.forEach(m => {
        if (m.hDescarga) {
          this.maniobrasVaciosDescagadas.push(m);
        }
      });
      this.dataSourceVacios = new MatTableDataSource(this.maniobrasVaciosDescagadas);
      this.dataSourceVacios.sort = this.sort;
      this.dataSourceVacios.paginator = this.paginator;
      this.totalRegistrosVacios = this.dataSourceVacios.data.length;
    } else {
      this.consultaManiobrasVacios().then((value: { ok: Boolean, mensaje: String }) => {
        if (value.ok && this.checkedVacios) {
          this.filtraManiobrasDescargaVacios(this.checkedVacios);
        }
      }).catch((error) => {
        console.log(error.mensaje)
      });
    }
  }

  cargarManiobrasDescargadosVaciosLavados(descargados: boolean) {
    this.maniobrasVaciosLavadoDescagadas = [];
    this.checkedHDescagaL = descargados;
    if (descargados) {
      this.dataSourceLavadoVacios.data.forEach(m => {
        if (m.hDescarga) {
          this.maniobrasVaciosLavadoDescagadas.push(m);
        }
      });
      this.dataSourceLavadoVacios = new MatTableDataSource(this.maniobrasVaciosLavadoDescagadas);
      this.dataSourceLavadoVacios.sort = this.MatSortLavado;
      this.dataSourceLavadoVacios.paginator = this.MatPaginatorLavado;
      this.totalRegistrosLavadoVacios = this.dataSourceLavadoVacios.data.length;
    } else {
      this.consultaManiobrasLavadoVacios().then((value: { ok: Boolean, mensaje: String }) => {
        if (value.ok && this.checkedLavadoVacios) {
          this.filtraManiobrasDescargaVaciosLavado(this.checkedLavadoVacios);
        }
      }).catch((error) => {
        console.log(error.mensaje)
      });
    }
  }

  cargarManiobrasDescargadosVaciosReparaciones(descargados: boolean) {
    this.maniobrasVaciosReparacionDescagadas = [];
    this.checkedHDescagaR = descargados;
    if (descargados) {
      this.dataSourceReparacionVacios.data.forEach(m => {
        if (m.hDescarga) {
          this.maniobrasVaciosReparacionDescagadas.push(m);
        }
      });
      this.dataSourceReparacionVacios = new MatTableDataSource(this.maniobrasVaciosReparacionDescagadas);
      this.dataSourceReparacionVacios.sort = this.MatSortReparacion;
      this.dataSourceReparacionVacios.paginator = this.MatPaginatorReparacion;
      this.totalRegistrosReparacionVacios = this.dataSourceReparacionVacios.data.length;
    } else {
      this.consultaManiobrasReparacionVacios().then((value: { ok: Boolean, mensaje: String }) => {
        if (value.ok && this.checkedReparacionVacios) {
          this.filtraManiobrasDescargaVaciosReparacion(this.checkedReparacionVacios);
        }
      }).catch((error) => {
        console.log(error.mensaje)
      });
    }
  }

  cargarViajes(anio: string) {
    this.cargando = true;
    this._viajeService.getViajesA(anio)
      .subscribe(viajes => {
        this.viajes = viajes.viajes;
        this.cargando = false;
      });
  }

  public exportpdf() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  CreaDatosVaciosExcel(datos, tipo) {
    datos.forEach(m => {
      var reparaciones = '';

      m.reparaciones.forEach(r => {
        reparaciones += r.reparacion + ", ";
      });
      reparaciones = reparaciones.substring(0, reparaciones.length - 2);


      var maniobra = {
        cargaDescarga: m.cargaDescarga,
        folio: m.folio,
        contenedor: m.contenedor,
        tipo: m.tipo,
        lavado: m.lavado,
        lavadoObservacion: m.lavadoObservacion,
        grado: m.grado,
        fLlegada: m.fLlegada != undefined ? m.fLlegada.substring(0, 10) : '',
        Operador: m.operador && m.operador.nombre && m.operador.nombre != undefined && m.operador.nombre && m.operador.nombre != ''? m.operador.nombre: '' && m.operador.nombre,
        placa: m.camion != undefined ? m.camion.placa : '',
        Transportista: m.transportista && m.transportista.nombreComercial && m.transportista.nombreComercial != undefined && m.transportista.nombreComercial != '' ? m.transportista.nombreComercial: '' && m.transportista.nombreComercial,
        reparaciones: reparaciones,
        reparacionesObservacion: m.reparacionesObservacion,
        facturaManiobra: m.facturaManiobra,
        Viaje: m.viaje && m.viaje.viaje && m.viaje.viaje != undefined && m.viaje.viaje != '' ? m.viaje.viaje : '' && m.viaje.viaje,
        Buque: m.viaje && m.viaje != undefined && m.viaje.buque && m.viaje.buque && m.viaje.buque != undefined && m.viaje.buque.nombre != ''? m.viaje.buque.nombre: '' && m.viaje.buque.nombre,
        peso: m.peso,
        Cliente: m.cliente && m.cliente.nombreComercial && m.cliente.nombreComercial != undefined && m.cliente.nombreComercial != '' && m.cliente.nombreComercial,
        Agencia: m.agencia && m.agencia.nombreComercial && m.agencia.nombreComercial != undefined && m.agencia.nombreComercial != '' && m.agencia.nombreComercial,
        estatus: m.estatus,
        hDescarga: m.hDescarga,
        fAlta: m.fAlta.substring(0, 10)

        // folio: m.folio,
        // camion: m.camion,
        // destinatario: m.destinatario,
        // hLlegada: m.hLlegada,
        // hEntrada: m.hEntrada,
        // facturarA: m.facturarA,
        // correoFac: m.correoFac,
        // correoOp: m.correoOp,
        // solicitud: m.solicitud,
        // hSalida: m.hSalida,
        // descargaAutorizada: m.descargaAutorizada,
        // fTerminacionLavado: m.fTerminacionLavado,
        // hTerminacionLavado: m.hTerminacionLavado,
        // fTerminacionReparacion: m.fTerminacionReparacion,
        // hTerminacionReparacion: m.hTerminacionReparacion,
        // maniobraAsociada: m.maniobraAsociada,
        // fAsignacionPapeleta: m.fAsignacionPapeleta,
        // fExpiracionPapeleta: m.fExpiracionPapeleta,
        // usuarioAlta: m.usuarioAlta,
      };

      if (tipo === 'Vacios') {
        this.ManiobrasVaciosExcel.push(maniobra);
      } else {
        if (tipo === 'VaciosLavado') {
          this.ManiobrasVaciosLavadoExcel.push(maniobra);
        } else {
          if (tipo === 'VaciosReparacion') {
            this.ManiobrasVaciosReparacionExcel.push(maniobra);
          }
        }
      }
    });
  }

  exportAsXLSXVacios(): void {
    this.CreaDatosVaciosExcel(this.dataSourceVacios.data, 'Vacios');
    if (this.ManiobrasVaciosExcel) {
      this._excelService.exportAsExcelFile(this.ManiobrasVaciosExcel, 'Maniobras de Vacios Descarga');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  exportAsXLSXVaciosLavado(): void {
    this.CreaDatosVaciosExcel(this.dataSourceLavadoVacios.data, 'VaciosLavado');
    if (this.ManiobrasVaciosLavadoExcel) {
      this._excelService.exportAsExcelFile(this.ManiobrasVaciosLavadoExcel, 'Maniobras de Vacios Lavado');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  exportAsXLSXVaciosReparacion(): void {
    this.CreaDatosVaciosExcel(this.dataSourceReparacionVacios.data, 'VaciosReparacion');
    if (this.ManiobrasVaciosReparacionExcel) {
      this._excelService.exportAsExcelFile(this.ManiobrasVaciosReparacionExcel, 'Maniobras de Vacios Reparación');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedVacios() {
    const numSelected = this.selectionVacios.selected.length;
    const numRows = this.dataSourceVacios.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleVacios() {
    this.isAllSelectedVacios() ?
      this.selectionVacios.clear() :
      this.dataSourceVacios.data.forEach(row => this.selectionVacios.select(row));
  }

  isAllSelectedLavadoVacios() {
    const numSelected = this.selectionLavadoVacios.selected.length;
    const numRows = this.dataSourceLavadoVacios.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleLavadoVacios() {
    this.isAllSelectedLavadoVacios() ?
      this.selectionLavadoVacios.clear() :
      this.dataSourceLavadoVacios.data.forEach(row => this.selectionLavadoVacios.select(row));
  }

  isAllSelectedReparacionVacios() {
    const numSelected = this.selectionReparacionVacios.selected.length;
    const numRows = this.dataSourceReparacionVacios.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleReparacionVacios() {
    this.isAllSelectedReparacionVacios() ?
      this.selectionReparacionVacios.clear() :
      this.dataSourceReparacionVacios.data.forEach(row => this.selectionReparacionVacios.select(row));
  }

  openDialogVacios() {
    //console.log("Entre")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionVacios;
    let dialogRef = this.matDialog.open(AsignarFacturaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          // if (this.checkedVacios) {
            this.selectionVacios = new SelectionModel<Maniobra>(true, []);
            this.filtraManiobrasDescargaVacios(this.checkedVacios);
            // if (this.checkedHDescargaVacios && this.dataSourceVacios.data.length > 0) {
            //   this.cargarManiobrasDescargadosVacios(this.checkedHDescargaVacios);
            // }
          // }
      }
    });
  }

  openDialogVaciosLavado() {
    //console.log("Entre Lavado")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionLavadoVacios;
    let dialogRef = this.matDialog.open(AsignarFacturaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (this.checkedLavadoVacios) {
          this.selectionLavadoVacios = new SelectionModel<Maniobra>(true, []);
          this.filtraManiobrasDescargaVaciosLavado(this.checkedLavadoVacios);
          // if (this.checkedHDescagaL && this.dataSourceLavadoVacios.data.length > 0) {
          //   this.cargarManiobrasDescargadosVaciosLavados(this.checkedHDescagaL);
          // }
        // }
      }
    });
  }

  openDialogVaciosReparacion() {
    //console.log("Entre Reparacion")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionReparacionVacios;
    let dialogRef = this.matDialog.open(AsignarFacturaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (this.checkedReparacionVacios) {
          this.selectionReparacionVacios = new SelectionModel<Maniobra>(true, []);
          this.filtraManiobrasDescargaVaciosReparacion(this.checkedReparacionVacios);
          // if (this.checkedHDescagaR && this.dataSourceReparacionVacios.data.length > 0) {
          //   this.cargarManiobrasDescargadosVaciosReparaciones(this.checkedHDescagaR);
          // }
        // }
      }
    });
  }

  corregirContenedor(id) {
    this._maniobraService.corrigeContenedor(id).subscribe(res => {
      id.contenedor = res.contenedor;
    });
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('FacturacionTabs', event.index.toString());
  }
  // detalle(id: string) {
  //   localStorage.setItem('history', '/facturacion-maniobras');

  //   this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
  // }

  open(id: string) {
    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable history lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }
    }
    //Agrego mi nueva ruta al array
    array.push("/facturacion-maniobras");


    ////sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    //Voy a pagina.
    this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
  }
}
