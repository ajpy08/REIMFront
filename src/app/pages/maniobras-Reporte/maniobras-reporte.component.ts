import { Component, OnInit, ViewChild } from '@angular/core';
import { ManiobraService, ViajeService, UsuarioService } from '../../services/service.index';
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
  MatDialog
} from '@angular/material';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Viaje } from '../viajes/viaje.models';
import { ROLES } from 'src/app/config/config';
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
  selector: 'app-maniobras-trasportista',
  templateUrl: './maniobras-reporte.component.html',
  styleUrls: ['./maniobras-reporte.component.css'],
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
export class ManiobrasTrasportistaComponent implements OnInit {
  maniobrasVacios: any[] = [];
  maniobraContenedor: any[] = [];
  ManiobrasExcel = [];
  usuarioLogueado: any;
  data: any = { fechaCreado: '' };
  cargando = false;
  tablaCargar = false;
  totalRegistros = 0;
  fIniLlegada = moment()
    .local()
    .startOf('day');
  fFinLlegada = moment()
    .local()
    .startOf('day');

  viajes: Viaje[] = [];
  viaje: string = undefined;
  contenedor: string = undefined;

  displayedColumns = [
    'cargaDescarga',
    // 'actions',
    'fechaingreso',
    // 'hLlegada',
    // 'operador',
    // 'placa',
    // 'transportista',
    // 'hEntrada',
    'contenedor',
    'tipo',
    // 'sello',
    'cliente',
    // 'agencia',
    'solicitud.blBooking',
    // 'hDescarga',
    'grado',
    // 'lavado',
    // 'hSalida',
    // 'reparaciones',
    // 'viaje.naviera.nombreComercial',
    // 'viaje',
    // 'viaje.buque.nombre',
    'estatus',
    'peso'
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  checkedVacios = false;
  checkedContenedor = false;

  constructor(
    public _maniobraService: ManiobraService,
    public _viajeService: ViajeService,
    public _excelService: ExcelService,
    private _usuarioService: UsuarioService,
    public matDialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;


    this.cargarViajes(new Date().toString());
    this.consultaManiobras().then(
      (value: { ok: Boolean; mensaje: String }) => { }
    );
  }

  filtrar(bool: boolean) {
    if (bool === true) {
      if (this.contenedor !== undefined && this.contenedor !== '') {
        this.consultarContenedor();
      } else {
        swal('Error', 'Debes de escribir un contenedor', 'error');
      }
    } else if (bool === false) {
      this.consultaManiobras();
    }
  }

  consultarContenedor() {
    return new Promise((resolve, reject) => {
      this._maniobraService
        .getManiobras(
          null,
          null,
          null,
          this.contenedor,
          this.viaje,
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
            this.dataSource = new MatTableDataSource(maniobras.maniobras);
            if (maniobras.maniobras.length === 0) {
              this.tablaCargar = true;
            } else {
              this.tablaCargar = false;
            }
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

  consultaManiobras() {
    this.cargando = true;
    let trasportista = '';
    let cliente = '';
    let naviera = '';
    return new Promise((resolve, reject) => {

      if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
        if (this.usuarioLogueado.empresas) {
          this.usuarioLogueado.empresas.forEach(empresas => {
            trasportista = empresas._id;
            this._maniobraService
              .getManiobras(
                null,
                null,
                trasportista,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
                this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : ''
              )
              .subscribe(
                maniobras => {
                  this.dataSource = new MatTableDataSource(maniobras.maniobras);
                  if (maniobras.maniobras.length === 0) {
                    this.tablaCargar = true;
                  } else {
                    this.tablaCargar = false;
                  }
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
      } else if (this.usuarioLogueado.role === ROLES.CLIENT_ROLE) {

        if (this.usuarioLogueado.empresas) {
          this.usuarioLogueado.empresas.forEach(empresas => {
            cliente = empresas._id;
            this._maniobraService
              .getManiobras(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
                this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : '',
                cliente,
              )
              .subscribe(
                maniobras => {
                  this.dataSource = new MatTableDataSource(maniobras.maniobras);
                  if (maniobras.maniobras.length === 0) {
                    this.tablaCargar = true;
                  } else {
                    this.tablaCargar = false;
                  }
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

      } else if (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE) {
        if (this.usuarioLogueado.empresas) {
          this.usuarioLogueado.empresas.forEach(empresas => {
            naviera = empresas._id;
            this._maniobraService
              .getManiobras(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                naviera,
                null,
                this.fIniLlegada ? this.fIniLlegada.utc().format('DD-MM-YYYY') : '',
                this.fFinLlegada ? this.fFinLlegada.utc().format('DD-MM-YYYY') : '',
              )
              .subscribe(
                maniobras => {
                  this.dataSource = new MatTableDataSource(maniobras.maniobras);
                  if (maniobras.maniobras.length === 0) {
                    this.tablaCargar = true;
                  } else {
                    this.tablaCargar = false;
                  }
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
      }
        this.cargando = false;
      });
  }


cargarViajes(anio: string) {
  this.cargando = true;
  this._viajeService.getViajesA(anio).subscribe(viajes => {
    this.viajes = viajes.viajes;
    this.cargando = false;
  });
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
    console.error('Error al filtrar el dataSource de Maniobras Diario');
  }
}

filtraManiobrasVacios(vacios: boolean) {
  this.cargando = true;
  this.maniobrasVacios = [];
  this.checkedVacios = vacios;
  if (vacios && this.dataSource) {
    this.dataSource.data.forEach(m => {
      if (m.peso === 'VACIO') {
        this.maniobrasVacios.push(m);
      }
    });
    this.dataSource = new MatTableDataSource(this.maniobrasVacios);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.totalRegistros = this.dataSource.data.length;
  } else {
    this.consultaManiobras()
      .then((value: { ok: Boolean; mensaje: String }) => { })
      .catch(error => {
        console.log(error.mensaje);
      });
  }
  this.cargando = false;
}

  public exportpdf() {
  const data = document.getElementById('contentToConvert');
  html2canvas(data).then(canvas => {
    const imgWidth = 208;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    const position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    pdf.save('MYPdf.pdf'); // Generated PDF
  });
}

CreaDatosExcel(datos) {
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
      Fecha: m.fLlegada !== undefined ? m.fLlegada.substring(0, 10) : '',
      CargaDescarga: m.cargaDescarga,
      Hora_Llegada: m.hLlegada,
      // Operador:
      //   m.operador &&
      //     m.operador.nombre &&
      //     m.operador.nombre !== undefined &&
      //     m.operador.nombre &&
      //     m.operador.nombre !== ''
      //     ? m.operador.nombre
      //     : '' && m.operador.nombre,
      // Placa: m.camion !== undefined && m.camion !== null ? m.camion.placa : '',
      // Transportista:
      //   m.transportista &&
      //     m.transportista.nombreComercial &&
      //     m.transportista.nombreComercial !== undefined &&
      //     m.transportista.nombreComercial !== ''
      //     ? m.transportista.nombreComercial
      //     : '' && m.transportista.nombreComercial,
      // Hora_Entrada: m.hEntrada,
      Contenedor: m.contenedor,
      Tipo: m.tipo,
      // Sello: m.sello,
      Cliente:
        m.cliente &&
        m.cliente.nombreComercial &&
        m.cliente.nombreComercial !== undefined &&
        m.cliente.nombreComercial !== '' &&
        m.cliente.nombreComercial,
      // A_A:
      //   m.agencia &&
      //   m.agencia.nombreComercial &&
      //   m.agencia.nombreComercial !== undefined &&
      //   m.agencia.nombreComercial !== '' &&
      //   m.agencia.nombreComercial,
      Booking:
        m.solicitud &&
          m.solicitud.blBooking &&
          m.solicitud.blBooking !== undefined &&
          m.solicitud.blBooking !== ''
          ? m.solicitud.blBooking
          : '' && m.solicitud.blBooking,
      // EIR: m.null,
      // Hora_Descarga: m.hDescarga,
      Grado: m.grado,
      // Lavado: m.lavado,
      // Hora_Salida: m.hSalida,
      // Obervaciones: observaciones,
      // Buque:
      //   m.viaje &&
      //     m.viaje.buque.nombre &&
      //     m.viaje.buque.nombre !== undefined &&
      //     m.viaje.buque.nombre !== ''
      //     ? m.viaje.buque.nombre
      //     : '' && m.viaje.buque.nombre,
      // Viaje:
      //   m.viaje &&
      //     m.viaje.viaje &&
      //     m.viaje.viaje !== undefined &&
      //     m.viaje.viaje !== ''
      //     ? m.viaje.viaje
      //     : '' && m.viaje.viaje,
      // Naviera:
      //   m.viaje &&
      //     m.viaje.naviera.nombreComercial &&
      //     m.viaje.naviera.nombreComercial !== undefined &&
      //     m.viaje.naviera.nombreComercial !== ''
      //     ? m.viaje.naviera.nombreComercial
      //     : '' && m.viaje.naviera.nombreComercial,
      Peso: m.peso,
      Estatus: m.estatus
    };
    this.ManiobrasExcel.push(maniobra);
  });
}

exportAsXLSX(): void {
  this.CreaDatosExcel(this.dataSource.data);
  if (this.ManiobrasExcel) {
  this._excelService.exportAsExcelFile(
    this.ManiobrasExcel,
    'Maniobras Diarias'
  );
} else {
  swal('No se puede exportar un excel vacio', '', 'error');
}
  }

// detalle(id: string) {
//   localStorage.setItem('history', '/maniobras_diario');

//   this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
// }

open(id: string) {
  let history;
  const array = [];
  // Si tengo algo en localStorage en la variable history lo obtengo
  if (localStorage.getItem('historyArray')) {
    // asigno a mi variable history lo que obtengo de localStorage (historyArray)
    history = JSON.parse(localStorage.getItem('historyArray'));

    // realizo este ciclo para asignar los valores del JSON al Array
    // tslint:disable-next-line: forin
    for (const i in history) {
      array.push(history[i]);
    }
  }
  // Agrego mi nueva ruta al array
  array.push('maniobras_diario');

  //// sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
  localStorage.setItem('historyArray', JSON.stringify(array));

  // Voy a pagina.
  this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
}
}
