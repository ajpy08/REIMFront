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
  groupedDisponibles20: any;
  groupedDisponibles40: any;
  datosExcel = [];
  totalInventario = 0;
  totalReparaciones = 0;
  maniobras: Maniobra[] = [];
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

    promesa.then((value: boolean) => {
      if (value) {
        this.agrupa20_40(this.maniobras);
        const mant = this.cargarM();
        mant.then((ok: boolean) => {
          if (ok) {
            // let l = this.mantenimientos.filter(m => m.lavado !== undefined);
            // let r = this.mantenimientos.filter(m => m.reparacion !== undefined);
            // let a = this.mantenimientos.filter(m => m.acondicionamiento !== undefined);
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
      this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
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

          // this.maniobras = this.maniobras.sort((a, b) => a.fLlegada.localeCompare(b.fLlegada));

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

  cargarM() {
    this.cargando = true;

    return new Promise((resolve, reject) => {
      this.mantenimientoService.getMantenimientos('', '', 'PROCESO').subscribe(mantenimientos => {
        this.mantenimientos = [];
        const tempOrder = mantenimientos.mantenimientos.sort(function (a, b) {
          return (b.maniobra.contenedor > a.maniobra.contenedor)
        });

        console.log(tempOrder);

        const groups = VariasService.groupArray2(tempOrder, 'maniobra', 'contenedor');
        for (const g in groups) {
          let id;
          let viaje;
          let ma = {}
          let lavado;
          let reparacion;
          let acondicionamiento;
          groups[g].forEach(mant => {
            if (mant._id == '5fff4a689f15780eec4c1b18' || mant._id == '5fff4a689f15780eec4c17e9') {
              console.log('Aqui');
            }

            if (mant.maniobra.contenedor == 'RFSU5013501') {
              console.log('Aqui 2');
            }

            // const pos = this.mantenimientos.findIndex(m => m.maniobra._id ===  mant.maniobra._id && m.maniobra.viaje._id === mant.maniobra.viaje);
            // const pos = this.mantenimientos.findIndex(m => m.maniobra.contenedor === mant.maniobra.contenedor && m.maniobra.viaje._id === mant.maniobra.viaje);
            if (id !== mant.maniobra._id) {
              // if (pos < 0) {              

              id = mant.maniobra._id;
              viaje = mant.maniobra.viaje !== undefined ? mant.maniobra.viaje._id : '';
              let maniobra = mant.maniobra;

              if (mant.tipoMantenimiento == 'LAVADO') {
                lavado = mant._id;
              } else {
                if (mant.tipoMantenimiento == 'REPARACION') {
                  reparacion = mant._id;
                } else {
                  if (mant.tipoMantenimiento == 'ACONDICIONAMIENTO') {
                    acondicionamiento = mant._id;
                  }
                }
              }

              ma = { lavado, reparacion, acondicionamiento, maniobra }
              this.mantenimientos.push(ma);
            } else {
              if (mant.tipoMantenimiento == 'LAVADO') {
                lavado = mant._id;
              } else {
                if (mant.tipoMantenimiento == 'REPARACION') {
                  reparacion = mant._id;
                } else {
                  if (mant.tipoMantenimiento == 'ACONDICIONAMIENTO') {
                    acondicionamiento = mant._id;
                  }
                }
              }

              const pos = this.mantenimientos.findIndex(m => m.maniobra._id === id && m.maniobra.viaje._id === viaje);
              let maniobra = this.mantenimientos[pos].maniobra;
              ma = { lavado, reparacion, acondicionamiento, maniobra }
              this.mantenimientos.splice(pos, 1);
              this.mantenimientos.push(ma);
            }
          });
        }

        this.dataSourceM = new MatTableDataSource(this.mantenimientos);
        this.dataSourceM.sort = this.matSort4;
        this.dataSourceM.paginator = this.paginator.toArray()[1];
        this.totalRegistrosM = this.mantenimientos.length;

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
      maniobrasLavado.push(m.maniobra);
    });

    this.dataSourceL = new MatTableDataSource(maniobrasLavado);
    this.dataSourceL.sort = this.matSort2;
    this.dataSourceL.paginator = this.paginator.toArray()[2];
    this.totalRegistrosL = maniobrasLavado.length;

    // this.maniobraService
    //   .getManiobras(
    //     null,
    //     ETAPAS_MANIOBRA.LAVADO_REPARACION,
    //     null,
    //     null,
    //     null,
    //     null,
    //     true,
    //     null,
    //     this.navieraSeleccionada
    //   )
    //   .subscribe(maniobras => {
    //     this.maniobras = maniobras.maniobras;

    //     this.dataSourceL = new MatTableDataSource(maniobras.maniobras);
    //     this.dataSourceL.sort = this.matSort2;
    //     this.dataSourceL.paginator = this.paginator.toArray()[2];
    //     this.totalRegistrosL = maniobras.maniobras.length;
    //   });
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
    // this.maniobraService
    //   .getManiobras(
    //     null,
    //     ETAPAS_MANIOBRA.LAVADO_REPARACION,
    //     null,
    //     null,
    //     null,
    //     null,
    //     null,
    //     true,
    //     this.navieraSeleccionada
    //   )
    //   .subscribe(maniobras => {
    //     this.maniobras = maniobras.maniobras;

    //     this.dataSourceR = new MatTableDataSource(maniobras.maniobras);
    //     this.dataSourceR.sort = this.matSort3;
    //     this.dataSourceR.paginator = this.paginator.toArray()[3];
    //     this.totalRegistrosR = maniobras.maniobras.length;
    //   });
    this.cargando = false;
  }

  cargarA() {
    this.cargando = true;

    this.mantAcondicionamiento = this.mantenimientos.filter(m => m.acondicionamiento !== undefined);
    const maniobrasAcondicionamiento = [];

    this.mantAcondicionamiento.forEach(m => {
      maniobrasAcondicionamiento.push(m.maniobra);
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

  // cuentaManiobrasMant(grado: string, tipo: string, source: any): number {
  //   let count = 0;
  //   if (source) {
  //     source.forEach(d => {
  //       if (d.grado === grado && d.tipo === tipo && d.reparaciones.length > 0) {
  //         count++;
  //       }
  //     });
  //   }
  //   return count;
  // }

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
            total += this.cuentaManiobrasMant(
              'A',
              g20.tipo,
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMant(
              'B',
              g20.tipo,
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMant(
              'C',
              g20.tipo,
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMant(
              'PT',
              g20.tipo,
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
            total += this.cuentaManiobrasMant(
              'A',
              g20.tipo,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMant(
              'B',
              g20.tipo,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMant(
              'C',
              g20.tipo,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMant(
              'PT',
              g20.tipo,
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
            total += this.cuentaManiobrasMant(
              'A',
              g40.tipo,
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMant(
              'B',
              g40.tipo,
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMant(
              'C',
              g40.tipo,
              this.dataSourceL.data
            );
            total += this.cuentaManiobrasMant(
              'PT',
              g40.tipo,
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
            total += this.cuentaManiobrasMant(
              'A',
              g40.tipo,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMant(
              'B',
              g40.tipo,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMant(
              'C',
              g40.tipo,
              this.dataSourceA.data
            );
            total += this.cuentaManiobrasMant(
              'PT',
              g40.tipo,
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
          subTotal += this.cuentaManiobrasMant(
            'A',
            tipo,
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMant(
            'B',
            tipo,
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMant(
            'C',
            tipo,
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMant(
            'PT',
            tipo,
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
          subTotal += this.cuentaManiobrasMant(
            'A',
            tipo,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMant(
            'B',
            tipo,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMant(
            'C',
            tipo,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMant(
            'PT',
            tipo,
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
        subTotal += this.cuentaManiobrasMant('A', tipo, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMant('B', tipo, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMant('C', tipo, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMant('PT', tipo, this.dataSourceA.data);
      }
    } else if (tipo.includes('40')) {
      if (this.groupedDisponibles40 !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (this.dataSourceL !== undefined) {
          subTotal += this.cuentaManiobrasMant(
            'A',
            tipo,
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMant(
            'B',
            tipo,
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMant(
            'C',
            tipo,
            this.dataSourceL.data
          );
          subTotal += this.cuentaManiobrasMant(
            'PT',
            tipo,
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
          subTotal += this.cuentaManiobrasMant(
            'A',
            tipo,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMant(
            'B',
            tipo,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMant(
            'C',
            tipo,
            this.dataSourceA.data
          );
          subTotal += this.cuentaManiobrasMant(
            'PT',
            tipo,
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
        subTotal += this.cuentaManiobrasMant('A', tipo, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMant('B', tipo, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMant('C', tipo, this.dataSourceA.data);
        subTotal += this.cuentaManiobrasMant('PT', tipo, this.dataSourceA.data);
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
    const hoy = moment();
    const fEntrada = moment(fEnt);
    let dias = 0;
    if (fEnt !== undefined && fEntrada !== undefined) {
      dias = hoy.diff(fEntrada, 'days');
    } else {
      dias = 0;
    }


    return dias;
  }
}
