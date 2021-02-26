import { MantenimientoService } from './../mantenimientos/mantenimiento.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatTabChangeEvent,
  MatTabGroup
} from '@angular/material';
import { ManiobraService } from '../maniobra.service';
import { ESTADOS_CONTENEDOR, ETAPAS_MANIOBRA } from '../../../config/config';
import { Maniobra } from 'src/app/models/maniobra.models';
import {
  UsuarioService,
  ExcelService,
  NavieraService
} from 'src/app/services/service.index';
import { ROLES } from 'src/app/config/config';
import { Usuario } from '../../usuarios/usuario.model';
import { Router } from '@angular/router';
import { Naviera } from '../../navieras/navieras.models';
import * as _moment from 'moment';
declare var swal: any;
const moment = _moment;
import { VariasService } from '../../../services/shared/varias.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  usuarioLogueado: Usuario;
  cargando = true;
  totalRegistros = 0;
  totalRegistrosL = 0;
  totalRegistrosR = 0;
  totalRegistrosA = 0;
  totalRegistrosM = 0;

  totalMantLavado = 0;
  totalMantReparacion = 0;
  totalMantAcondicionamiento = 0;

  displayedColumns = [
    'fLlegada',
    'dias',
    'viaje',
    'nombre',
    'nombreComercial',
    'fVigenciaTemporal',
    'pdfTemporal',
    'contenedor',
    'tipo',
    'peso',
    'grado'
  ];
  displayedColumnsGroups = [
    'fLlegada',
    'dias',
    'viaje',
    'nombre',
    // "nombreComercial",
    'fVigenciaTemporal',
    'pdfTemporal',
    'contenedor',
    'tipo',
    'peso',
    'grado'
  ];

  displayedColumnsM;
  displayedColumnsL;
  displayedColumnsR;

  dataSource: any;
  dataSourceL: any;
  dataSourceR: any;
  dataSourceA: any;
  dataSourceM: any;
  c40: any;
  c20: any;
  c40Gral: any;
  c20Gral: any;
  groupedDisponibles20: any;
  groupedDisponibles40: any;
  groupedDisponibles20Gral: any;
  groupedDisponibles40Gral: any;
  datosExcel = [];
  totalInventario = 0;
  totalReparaciones = 0;
  maniobras: Maniobra[] = [];
  maniobrasGral: Maniobra[] = [];
  mantenimientos = [];
  navieras: Naviera[] = [];
  navieraSeleccionada: string = undefined;
  blockNaviera = false;

  mantLavado;
  mantReparacion;
  mantAcondicionamiento;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild('matPaginatorL', { read: MatPaginator })
  // @ViewChild('matPaginatorR', { read: MatPaginator })
  // matPaginatorL: MatPaginator;
  // matPaginatorR: MatPaginator;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatSort2') matSort2: MatSort;
  @ViewChild('MatSort3') matSort3: MatSort;
  @ViewChild('MatSort4') matSort4: MatSort;
  constructor(
    public maniobraService: ManiobraService,
    private usuarioService: UsuarioService,
    private navieraService: NavieraService,
    private _excelService: ExcelService,
    private router: Router,
    private mantenimientoService: MantenimientoService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarNavieras();

    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIO_ROLE
    ) {

      this.displayedColumns = [
        'actions',
        'fLlegada',
        'dias',
        'viaje',
        'nombre',
        'nombreComercial',
        'fVigenciaTemporal',
        'pdfTemporal',
        'contenedor',
        'tipo',
        'peso',
        'grado'
      ];

      this.displayedColumnsL = this.displayedColumnsR = [
        'actions',
        'fLlegada',
        'dias',
        'viaje',
        'nombre',
        'nombreComercial',
        'contenedor',
        'tipo',
        'peso',
        'grado',
        'lavado',
        // 'reparaciones'
      ];

      this.displayedColumnsM = [
        'lavado',
        'reparacion',
        'acondicionamiento',
        'fLlegada',
        'dias',
        'viaje',
        'nombre',
        'nombreComercial',
        'contenedor',
        'tipo',
        'peso',
        'grado'
      ];
    } else {
      this.navieraSeleccionada = this.usuarioLogueado.empresas[0]._id;
      this.blockNaviera = true;
      this.displayedColumnsL = this.displayedColumnsR = [
        'fLlegada',
        'dias',
        'viaje',
        'nombre',
        'nombreComercial',
        'contenedor',
        'tipo',
        'peso',
        'grado',
        'lavado',
        // 'reparaciones'
      ];

      this.displayedColumnsM = [
        'lavado',
        'reparacion',
        'acondicionamiento',
        'fLlegada',
        'dias',
        'viaje',
        'nombre',
        'nombreComercial',
        'contenedor',
        'tipo',
        'peso',
        'grado'
      ];
    }
    const indexTAB = localStorage.getItem('InventarioTabs');
    if (indexTAB) {
      // tslint:disable-next-line: radix
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }

    this.cargarInventario();
  }

  applyFilter(filterValue: string, dataSource: any) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (dataSource && dataSource.data.length > 0) {
      dataSource.filter = filterValue;
      this.totalRegistros = dataSource.filteredData.length;
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }
  }

  cargarNavieras() {
    this.cargando = true;
    if (
      this.usuarioLogueado.role === ROLES.NAVIERA_ROLE ||
      this.usuarioLogueado.role === ROLES.CLIENT_ROLE
    ) {
      this.navieras = this.usuarioLogueado.empresas;
    } else {
      this.navieraService.getNavieras(true).subscribe(navieras => {
        this.navieras = navieras.navieras;
      });
    }
    this.cargando = false;
  }

  cargarInventario() {
    const promesa = this.cargaManiobras();
    const promesa2 = this.cargaManiobrasTiposContenedores();

    promesa2.then((value: boolean) => {
      if (value) {
        this.agrupa20_40Gral(this.maniobrasGral);
      }
    });

    promesa.then((value: boolean) => {
      if (value) {
        this.agrupa20_40(this.maniobras);
        const mant = this.cargarM();
        mant.then((ok: boolean) => {
          if (ok) {
            this.cargarL();
            this.cargarR();
            this.cargarA();
          }
        });
      }
    });
  }

  agrupa20_40(maniobras) {
    this.c20 = maniobras.filter(m => m.tipo.includes('20'));

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
    if (grouped20) {
      this.groupedDisponibles20 = Object.keys(grouped20).map(tipo => {
        return {
          tipo: tipo,
          maniobras: grouped20[tipo]
        };
      });
    }

    this.c40 = maniobras.filter(m => m.tipo.includes('40'));

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
    if (grouped40) {
      // console.log(grouped40);
      this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
        return {
          tipo: tipo,
          maniobras: grouped40[tipo]
        };
      });
    }
  }

  agrupa20_40Gral(maniobras) {
    this.c20Gral = maniobras.filter(m => m.tipo.includes('20'));

    const grouped20 = this.c20Gral.reduce((curr, m) => {
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
    if (grouped20) {
      this.groupedDisponibles20Gral = Object.keys(grouped20).map(tipo => {
        return {
          tipo: tipo,
          maniobras: grouped20[tipo]
        };
      });
    }

    this.c40Gral = maniobras.filter(m => m.tipo.includes('40'));

    const grouped40 = this.c40Gral.reduce((curr, m) => {
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
    if (grouped40) {
      this.groupedDisponibles40Gral = Object.keys(grouped40).map(tipo => {
        return {
          tipo: tipo,
          maniobras: grouped40[tipo]
        };
      });
    }
  }

  cargaManiobras() {
    return new Promise((resolve, reject) => {
      this.cargando = true;

      this.maniobraService
        .getManiobras(
          'D',
          ETAPAS_MANIOBRA.DISPONIBLE,
          null,
          null,
          null,
          null,
          null,
          null,
          this.navieraSeleccionada
        )
        .subscribe(maniobras => {
          this.maniobras = maniobras.maniobras;

          this.dataSource = new MatTableDataSource(this.maniobras);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator.toArray()[0];
          this.totalRegistros = maniobras.maniobras.length;

          if (this.maniobras) {
            resolve(true);
          }
        });
      this.cargando = false;
    });
  }

  cargaManiobrasTiposContenedores() {
    return new Promise((resolve, reject) => {
      this.cargando = true;

      this.maniobraService
        .getManiobras(
          'D',
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          this.navieraSeleccionada
        )
        .subscribe(maniobras => {
          this.maniobrasGral = maniobras.maniobras;

          // this.dataSource = new MatTableDataSource(this.maniobrasGral);
          // this.dataSource.sort = this.sort;
          // this.dataSource.paginator = this.paginator.toArray()[0];
          // this.totalRegistros = maniobras.maniobras.length;

          if (this.maniobrasGral) {
            resolve(true);
          }
        });
      this.cargando = false;
    });
  }

  cuenta(tipoMantenimiento) {
    if (tipoMantenimiento == 'LAVADO') {
      this.totalMantLavado = this.totalMantLavado + 1;
    } else {
      if (tipoMantenimiento == 'REPARACION') {
        this.totalMantReparacion = this.totalMantReparacion + 1;
      } else {
        if (tipoMantenimiento == 'ACONDICIONAMIENTO') {
          this.totalMantAcondicionamiento = this.totalMantAcondicionamiento + 1;
        }
      }
    }
  }

  cargarM() {
    this.cargando = true;
    this.totalMantLavado = 0;
    this.totalMantReparacion = 0;
    this.totalMantAcondicionamiento = 0;

    return new Promise((resolve, reject) => {
      this.mantenimientoService.getMantenimientos('', '', 'PROCESO').subscribe(mantenimientos => {
        this.mantenimientos = [];

        const groups = VariasService.groupArray2(mantenimientos.mantenimientos, 'maniobra', 'contenedor');
        for (const g in groups) {
          let id;
          let viaje;
          let ma = {}
          let maniobra;
          let consecutivo = 0;
          const grupo = groups[g].sort((o1, o2) => {
            if (o1.maniobra.fAlta > o2.maniobra.fAlta) {
              return 1;
            } else if (o1.maniobra.fAlta < o2.maniobra.fAlta) {
              return -1;
            }
            return 0;
          });

          grupo.forEach(mant => {
            let lavado;
            let tipoLavado;
            let reparacion;
            let acondicionamiento;
            let cambioGrado;
            consecutivo = consecutivo + 1;

            // if (mant.maniobra.contenedor == 'MECU5500477') {
            //   console.log('aq');
            // }

            if (id !== mant.maniobra._id) {
              maniobra = mant.maniobra;

              if (mant.tipoMantenimiento == 'LAVADO') {
                lavado = mant._id;
                tipoLavado = mant.tipoLavado;
              } else {
                if (mant.tipoMantenimiento == 'REPARACION') {
                  reparacion = mant._id;
                } else {
                  if (mant.tipoMantenimiento == 'ACONDICIONAMIENTO') {
                    acondicionamiento = mant._id;
                    cambioGrado = mant.cambioGrado;
                  }
                }
              }

              ma = { consecutivo, lavado, reparacion, acondicionamiento, maniobra, tipoLavado, cambioGrado }
              this.mantenimientos.push(ma);

              id = mant.maniobra._id;
              viaje = mant.maniobra.viaje !== undefined ? mant.maniobra.viaje._id : '';

            } else {

              if (mant.tipoMantenimiento == 'LAVADO') {
                lavado = mant._id;
                tipoLavado = mant.tipoLavado;
              } else {
                if (mant.tipoMantenimiento == 'REPARACION') {
                  reparacion = mant._id;
                } else {
                  if (mant.tipoMantenimiento == 'ACONDICIONAMIENTO') {
                    acondicionamiento = mant._id;
                    cambioGrado = mant.cambioGrado;
                  }
                }
              }

              maniobra = mant.maniobra;
              const pos = this.mantenimientos.findIndex(m => m.maniobra._id === id && m.maniobra.viaje._id === viaje);

              if (!lavado && this.mantenimientos[pos].lavado) {
                lavado = this.mantenimientos[pos].lavado;
              }

              if (!reparacion && this.mantenimientos[pos].reparacion) {
                reparacion = this.mantenimientos[pos].reparacion;
              }

              if (!acondicionamiento && this.mantenimientos[pos].acondicionamiento) {
                acondicionamiento = this.mantenimientos[pos].acondicionamiento;
              }

              ma = { consecutivo, lavado, reparacion, acondicionamiento, maniobra, tipoLavado, cambioGrado }
              this.mantenimientos.splice(pos, 1);
              this.mantenimientos.push(ma);
            }
          });
        }

        // Quito repetidos
        const mantenimientosFinal = [];
        this.mantenimientos.forEach(m => {

          // if (m.maniobra.contenedor == 'CXDU2241522') {
          //   console.log('aq');
          // }

          const existe = mantenimientosFinal.filter(man => man.maniobra.contenedor == m.maniobra.contenedor);
          // const existe = mantenimientosFinal.filter(man => man.maniobra._id == m.maniobra._id);

          if (existe.length == 1) {
            if (m.consecutivo > existe[0].consecutivo) {
              const pos = mantenimientosFinal.findIndex(m2 => m2.maniobra.contenedor === m.maniobra.contenedor);
              // const pos = mantenimientosFinal.findIndex(m2 => m2.maniobra._id === m.maniobra._id);

              if (pos) {
                mantenimientosFinal.splice(pos, 1);
                mantenimientosFinal.push(m);
              }
            }
          } else {
            if (existe.length > 1) {
              const mayor = existe.reduce(function (prev, curr) {
                return prev.consecutivo > curr.consecutivo ? prev : curr;
              });

              const pos = mantenimientosFinal.findIndex(m => m.maniobra._id === mayor.maniobra._id);

              if (pos < 0) {
                mantenimientosFinal.push(mayor);
              } else {
                if (mayor.consecutivo > mantenimientosFinal[pos].consecutivo) {
                  mantenimientosFinal.splice(pos, 1);
                  mantenimientosFinal.push(mayor);
                }
              }
            } else {
              if (existe.length == 0) {
                mantenimientosFinal.push(m);
              }
            }
          }
        });

        if (mantenimientosFinal) {
          let l = mantenimientosFinal.filter(m => m.lavado !== undefined);
          this.totalMantLavado = l.length;
          // console.log(this.totalMantLavado);

          let r = mantenimientosFinal.filter(m => m.reparacion !== undefined);
          this.totalMantReparacion = r.length;
          // console.log(this.totalMantReparacion);

          let a = mantenimientosFinal.filter(m => m.acondicionamiento !== undefined);
          this.totalMantAcondicionamiento = a.length;
          // console.log(this.totalMantAcondicionamiento);
        }

        this.dataSourceM = new MatTableDataSource(mantenimientosFinal);
        this.dataSourceM.sort = this.matSort4;
        this.dataSourceM.paginator = this.paginator.toArray()[1];
        this.totalRegistrosM = mantenimientosFinal.length;

        if (mantenimientos) {
          resolve(true);
        }
      });
      this.cargando = false;
    });
  }

  cargarL() {
    this.cargando = true;

    this.mantLavado = this.mantenimientos.filter(m => m.lavado !== undefined);
    const maniobrasLavado = [];

    this.mantLavado.forEach(m => {
      let maniobra = m.maniobra;
      let tipoLavado = m.tipoLavado;
      maniobrasLavado.push({ maniobra, tipoLavado });

      // maniobrasLavado.push(m.maniobra);
    });

    this.dataSourceL = new MatTableDataSource(maniobrasLavado);
    this.dataSourceL.sort = this.matSort2;
    this.dataSourceL.paginator = this.paginator.toArray()[2];
    this.totalRegistrosL = maniobrasLavado.length;
    this.cargando = false;
  }

  cargarR() {
    this.cargando = true;

    this.mantReparacion = this.mantenimientos.filter(m => m.reparacion !== undefined);
    const maniobrasReparacion = [];

    this.mantReparacion.forEach(m => {
      maniobrasReparacion.push(m.maniobra);
    });
    this.dataSourceR = new MatTableDataSource(maniobrasReparacion);
    this.dataSourceR.sort = this.matSort3;
    this.dataSourceR.paginator = this.paginator.toArray()[3];
    this.totalRegistrosR = maniobrasReparacion.length;
    this.cargando = false;
  }

  cargarA() {
    this.cargando = true;

    this.mantAcondicionamiento = this.mantenimientos.filter(m => m.acondicionamiento !== undefined);
    const maniobrasAcondicionamiento = [];

    this.mantAcondicionamiento.forEach(m => {
      let maniobra = m.maniobra;
      let cambioGrado = m.cambioGrado;
      maniobrasAcondicionamiento.push({ maniobra, cambioGrado });

      // maniobrasAcondicionamiento.push(m.maniobra);
    });
    this.dataSourceA = new MatTableDataSource(maniobrasAcondicionamiento);
    this.dataSourceA.sort = this.matSort3;
    this.dataSourceA.paginator = this.paginator.toArray()[4];
    this.totalRegistrosA = maniobrasAcondicionamiento.length;

    this.cargando = false;
  }

  mostrarFotosReparaciones(maniobra: Maniobra) {
    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE &&
        maniobra.mostrarFotosRNaviera)
    ) {
      return true;
    } else if (
      this.usuarioLogueado.role === ROLES.AA_ROLE &&
      maniobra.mostrarFotosRAA
    ) {
      return true;
    } else {
      return false;
    }
  }

  CreaDatosExcel(datos) {
    this.datosExcel = [];
    datos.forEach(d => {
      const dato = {
        EntradaPatio: d.fLlegada,
        Dias_Patio: this.calculaDias(d.fLlegada),
        Viaje: d.viaje && d.viaje.viaje && d.viaje.viaje !== undefined && d.viaje.viaje !== '' ? d.viaje.viaje : '',
        Buque: d.viaje && d.viaje.buque && d.viaje.buque !== undefined && d.viaje.buque !== null &&
          d.viaje.buque.nombre && d.viaje.buque.nombre !== undefined &&
          d.viaje.buque.nombre !== '' ? d.viaje.buque.nombre : '',
        VigenciaTemporal: d.viaje && d.viaje.fVigenciaTemporal !== undefined &&
          d.viaje.fVigenciaTemporal !== null && d.viaje.fVigenciaTemporal ? d.viaje.fVigenciaTemporal : '',
        Contenedor: d.contenedor,
        Tipo: d.tipo,
        Estado: d.peso,
        Grado: d.grado,
        Naviera: d.naviera && d.naviera.nombreComercial && d.naviera.nombreComercial !== undefined &&
          d.naviera.nombreComercial !== '' ? d.naviera.nombreComercial : '',
        FAlta: d.FAlta !== undefined ? d.fAlta.substring(0, 10) : '',
      };
      this.datosExcel.push(dato);
    });
  }

  exportAsXLSX(dataSource, nombre: string): void {
    this.CreaDatosExcel(dataSource.filteredData);
    if (this.datosExcel) {
      this._excelService.exportAsExcelFile(this.datosExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  CreaDatosExcelMantenimientos(datos) {
    this.datosExcel = [];
    datos.forEach(d => {
      let lavado = false;
      let reparacion = false;
      let acondicionamiento = false;

      let reparaciones = '';

      if (d.lavado) {
        lavado = true
      }

      if (d.reparacion) {
        reparacion = true
      }

      if (d.acondicionamiento) {
        acondicionamiento = true
      }

      if (d.maniobra) {
        const dato = {
          Lavado: lavado ? 'SI' : 'NO',
          Reparacion: reparacion ? 'SI' : 'NO',
          Acondicionamiento: acondicionamiento ? 'SI' : 'NO',
          EntradaPatio: d.maniobra.fLlegada !== undefined ? d.maniobra.fLlegada.substring(0, 10) : '',
          Dias_Patio: this.calculaDias(d.maniobra.fLlegada),
          Viaje: d.maniobra.viaje && d.maniobra.viaje.viaje && d.maniobra.viaje.viaje !== undefined && d.maniobra.viaje.viaje !== '' ? d.maniobra.viaje.viaje : '',
          Buque: d.maniobra.viaje && d.maniobra.viaje.buque && d.maniobra.viaje.buque !== undefined && d.maniobra.viaje.buque !== null &&
            d.maniobra.viaje.buque.nombre && d.maniobra.viaje.buque.nombre !== undefined &&
            d.maniobra.viaje.buque.nombre !== '' ? d.maniobra.viaje.buque.nombre : '',
          VigenciaTemporal: d.maniobra.viaje && d.maniobra.viaje.fVigenciaTemporal !== undefined &&
            d.maniobra.viaje.fVigenciaTemporal !== null && d.maniobra.viaje.fVigenciaTemporal ? d.maniobra.viaje.fVigenciaTemporal : '',
          Contenedor: d.maniobra.contenedor,
          Tipo: d.maniobra.tipo,
          Estado: d.maniobra.peso,
          Grado: d.maniobra.grado,
          // operador: d.maniobra.operador != undefined ? d.maniobra.operador.nombre : '',
          Naviera: d.maniobra.viaje && d.maniobra.viaje.naviera.nombreComercial && d.maniobra.viaje.naviera.nombreComercial !== undefined &&
            d.maniobra.viaje.naviera.nombreComercial !== '' ? d.maniobra.viaje.naviera.nombreComercial : '',
        };
        this.datosExcel.push(dato);
      }
    });
  }

  exportAsXLSXMantenimientos(dataSource, nombre: string): void {
    this.CreaDatosExcelMantenimientos(dataSource.filteredData);
    if (this.datosExcel) {
      this._excelService.exportAsExcelFile(this.datosExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  cuentaInventario(grado: string, estatus: string, source: any): number {
    let count = 0;
    if (source) {
      source.forEach(d => {
        if (grado && grado !== '') {
          if (d.grado === grado && d.estatus === estatus) {
            count++;
          }
        } else {
          if (d.estatus === estatus) {
            count++;
          }
        }

      });
    }
    return count;
  }

  cuentaManiobrasMantLav(grado: string, tipo: string, tipoLavado: string, source: any): number {
    let count = 0;
    if (source) {
      source.forEach(d => {
        if (grado && grado !== '') {
          if (d.maniobra && d.maniobra.grado === grado && d.maniobra.tipo === tipo) {
            if (tipoLavado != undefined && tipoLavado != null && tipoLavado != '') {
              if (d.tipoLavado === tipoLavado) {
                count++;
              }
            } else {
              count++;
            }
          }
        } else {
          if (d.maniobra && d.maniobra.tipo === tipo) {
            if (tipoLavado != undefined && tipoLavado != null && tipoLavado != '') {
              if (d.tipoLavado === tipoLavado) {
                count++;
              }
            } else {
              count++;
            }
          }
        }
      });
    }
    return count;
  }

  cuentaManiobrasMantAcon(grado: string, tipo: string, cambioGrado: boolean, source: any): number {
    let count = 0;
    if (source) {
      source.forEach(d => {
        if (grado && grado !== '') {
          if (d.maniobra && d.maniobra.grado === grado && d.maniobra.tipo === tipo) {
            if (cambioGrado && cambioGrado != null) {
              if (d.cambioGrado == cambioGrado) {
                count++;                
              }
            } else {
              count++;
            }
          }
        } else {
          if (d.maniobra && d.maniobra.tipo === tipo) {
            if (cambioGrado && cambioGrado != null) {
              if (d.cambioGrado === cambioGrado) {
                count++;
              }
            } else {
              count++;
            }
          }
        }
      });
    }
    return count;
  }

  cuentaManiobrasMant(grado: string, tipo: string, source: any): number {
    let count = 0;
    if (source) {
      source.forEach(d => {
        if (grado && grado !== '') {
          if (d.grado === grado && d.tipo === tipo) {
            count++;
          }
        } else {
          if (d.tipo === tipo) {
            count++;
          }
        }

      });
    }
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
          if (this.dataSourceL !== undefined) {
            total += this.cuentaManiobrasMantLav(
              'A',
              g20.tipo,
              '',
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMantLav(
              'B',
              g20.tipo,
              '',
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMantLav(
              'C',
              g20.tipo,
              '',
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMantLav(
              'PT',
              g20.tipo,
              '',
              this.dataSourceL.data
            );
          }
          if (this.dataSourceR !== undefined) {
            total += this.cuentaManiobrasMant(
              'A',
              g20.tipo,
              this.dataSourceR.data
            );
            total += this.cuentaManiobrasMant(
              'B',
              g20.tipo,
              this.dataSourceR.data
            );
            total += this.cuentaManiobrasMant(
              'C',
              g20.tipo,
              this.dataSourceR.data
            );
            total += this.cuentaManiobrasMant(
              'PT',
              g20.tipo,
              this.dataSourceR.data
            );
          }
          if (this.dataSourceA !== undefined) {
            total += this.cuentaManiobrasMantAcon(
              'A',
              g20.tipo,
              undefined,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMantAcon(
              'B',
              g20.tipo,
              undefined,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMantAcon(
              'C',
              g20.tipo,
              undefined,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMantAcon(
              'PT',
              g20.tipo,
              undefined,
              this.dataSourceA.data
            );
          }
        });
      }
    } else if (tipo.includes('40')) {
      if (this.groupedDisponibles40 !== undefined) {
        this.groupedDisponibles40.forEach(g40 => {
          total += this.cuentaInventario('A', 'DISPONIBLE', g40.maniobras);
          total += this.cuentaInventario('B', 'DISPONIBLE', g40.maniobras);
          total += this.cuentaInventario('C', 'DISPONIBLE', g40.maniobras);
          if (this.dataSourceL !== undefined) {
            total += this.cuentaManiobrasMantLav(
              'A',
              g40.tipo,
              '',
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMantLav(
              'B',
              g40.tipo,
              '',
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMantLav(
              'C',
              g40.tipo,
              '',
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMantLav(
              'PT',
              g40.tipo,
              '',
              this.dataSourceL.data
            );
          }
          if (this.dataSourceR !== undefined) {
            total += this.cuentaManiobrasMant(
              'A',
              g40.tipo,
              this.dataSourceR.data
            );
            total += this.cuentaManiobrasMant(
              'B',
              g40.tipo,
              this.dataSourceR.data
            );
            total += this.cuentaManiobrasMant(
              'C',
              g40.tipo,
              this.dataSourceR.data
            );
            total += this.cuentaManiobrasMant(
              'PT',
              g40.tipo,
              this.dataSourceR.data
            );
          }
          if (this.dataSourceA !== undefined) {
            total += this.cuentaManiobrasMantAcon(
              'A',
              g40.tipo,
              undefined,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMantAcon(
              'B',
              g40.tipo,
              undefined,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMantAcon(
              'C',
              g40.tipo,
              undefined,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMantAcon(
              'PT',
              g40.tipo,
              undefined,
              this.dataSourceA.data
            );
          }
        });
      }
    }

    return total;
  }

  obtenSubTotales(tipo: string, dataSource): number {
    let subTotal = 0;
    if (tipo.includes('20')) {
      if (dataSource !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (this.dataSourceL !== undefined) {
          subTotal += this.cuentaManiobrasMantLav(
            'A',
            tipo,
            '',
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMantLav(
            'B',
            tipo,
            '',
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMantLav(
            'C',
            tipo,
            '',
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMantLav(
            'PT',
            tipo,
            '',
            this.dataSourceL.data
          );
        }
        if (this.dataSourceR !== undefined) {
          subTotal += this.cuentaManiobrasMant(
            'A',
            tipo,
            this.dataSourceR.data
          );
          subTotal += this.cuentaManiobrasMant(
            'B',
            tipo,
            this.dataSourceR.data
          );
          subTotal += this.cuentaManiobrasMant(
            'C',
            tipo,
            this.dataSourceR.data
          );
          subTotal += this.cuentaManiobrasMant(
            'PT',
            tipo,
            this.dataSourceR.data
          );
        }
        if (this.dataSourceA !== undefined) {
          subTotal += this.cuentaManiobrasMantAcon(
            'A',
            tipo,
            undefined,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMantAcon(
            'B',
            tipo,
            undefined,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMantAcon(
            'C',
            tipo,
            undefined,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMantAcon(
            'PT',
            tipo,
            undefined,
            this.dataSourceA.data
          );
        }
      } else if (this.dataSourceL !== undefined) {
        subTotal += this.cuentaManiobrasMantLav('A', tipo, '', this.dataSourceL.data);
        subTotal += this.cuentaManiobrasMantLav('B', tipo, '', this.dataSourceL.data);
        subTotal += this.cuentaManiobrasMantLav('C', tipo, '', this.dataSourceL.data);
        subTotal += this.cuentaManiobrasMantLav('PT', tipo, '', this.dataSourceL.data);
      } else if (this.dataSourceR !== undefined) {
        subTotal += this.cuentaManiobrasMant('A', tipo, this.dataSourceR.data);
        subTotal += this.cuentaManiobrasMant('B', tipo, this.dataSourceR.data);
        subTotal += this.cuentaManiobrasMant('C', tipo, this.dataSourceR.data);
        subTotal += this.cuentaManiobrasMant('PT', tipo, this.dataSourceR.data);
      } else if (this.dataSourceA !== undefined) {
        subTotal += this.cuentaManiobrasMantAcon('A', tipo, undefined, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMantAcon('B', tipo, undefined, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMantAcon('C', tipo, undefined, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMantAcon('PT', tipo, undefined, this.dataSourceA.data);
      }
    } else if (tipo.includes('40')) {
      if (this.groupedDisponibles40 !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (this.dataSourceL !== undefined) {
          subTotal += this.cuentaManiobrasMantLav(
            'A',
            tipo,
            '',
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMantLav(
            'B',
            tipo,
            '',
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMantLav(
            'C',
            tipo,
            '',
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMantLav(
            'PT',
            tipo,
            '',
            this.dataSourceL.data
          );
        }

        if (this.dataSourceR !== undefined) {
          subTotal += this.cuentaManiobrasMant(
            'A',
            tipo,
            this.dataSourceR.data
          );
          subTotal += this.cuentaManiobrasMant(
            'B',
            tipo,
            this.dataSourceR.data
          );
          subTotal += this.cuentaManiobrasMant(
            'C',
            tipo,
            this.dataSourceR.data
          );
          subTotal += this.cuentaManiobrasMant(
            'PT',
            tipo,
            this.dataSourceR.data
          );
        }

        if (this.dataSourceA !== undefined) {
          subTotal += this.cuentaManiobrasMantAcon(
            'A',
            tipo,
            undefined,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMantAcon(
            'B',
            tipo,
            undefined,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMantAcon(
            'C',
            tipo,
            undefined,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMantAcon(
            'PT',
            tipo,
            undefined,
            this.dataSourceA.data
          );
        }
      } else if (this.dataSourceL !== undefined) {
        subTotal += this.cuentaManiobrasMant('A', tipo, this.dataSourceL.data);
        subTotal += this.cuentaManiobrasMant('B', tipo, this.dataSourceL.data);
        subTotal += this.cuentaManiobrasMant('C', tipo, this.dataSourceL.data);
        subTotal += this.cuentaManiobrasMant('PT', tipo, this.dataSourceL.data);
      } else if (this.dataSourceR !== undefined) {
        subTotal += this.cuentaManiobrasMant('A', tipo, this.dataSourceR.data);
        subTotal += this.cuentaManiobrasMant('B', tipo, this.dataSourceR.data);
        subTotal += this.cuentaManiobrasMant('C', tipo, this.dataSourceR.data);
        subTotal += this.cuentaManiobrasMant('PT', tipo, this.dataSourceR.data);
      } else if (this.dataSourceA !== undefined) {
        subTotal += this.cuentaManiobrasMantAcon('A', tipo, undefined, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMantAcon('B', tipo, undefined, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMantAcon('C', tipo, undefined, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMantAcon('PT', tipo, undefined, this.dataSourceA.data);
      }
    }
    return subTotal;
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('InventarioTabs', event.index.toString());
  }

  open(id: string) {
    let history;
    const array = [];
    // Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      // asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      // realizo este ciclo para asignar los valores del JSON al Array
      // tslint:disable-next-line: forin
      for (const i in history) {
        array.push(history[i]);
      }
    }
    // Agrego mi nueva ruta a donde debo regresar al array
    array.push('/inventario');

    // sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    // Voy a pagina.
    this.router.navigate([
      '/maniobras/maniobra/' + id + '/termina_lavado_reparacion'
    ]);
  }

  openDetalleManiobra(id: string) {
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
    array.push('/inventario');

    // sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    // Voy a pagina.
    this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
  }

  openMantenimiento(id: string) {
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
    array.push('/inventario');

    // sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    // Voy a pagina.
    this.router.navigate(['/mantenimientos/mantenimiento/' + id]);
  }

  calculaDias(fEnt) {
    let dias = 0;
    if (fEnt !== undefined) {
      const hoy = moment();
      const fEntrada = moment(fEnt);
      if (fEntrada !== undefined) {
        dias = hoy.diff(fEntrada, 'days');
      }
    } else {
      dias = 0;
    }


    return dias;
  }
}
