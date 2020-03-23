import { Component, OnInit, ViewChild } from '@angular/core';
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
declare var swal: any;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  usuarioLogueado: Usuario;
  cargando = true;
  totalRegistros = 0;
  totalRegistrosLR = 0;
  displayedColumns = [
    'fLlegada',
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
  displayedColumnsLR;

  dataSource: any;
  dataSourceLR: any;
  c40: any;
  c20: any;
  groupedDisponibles20: any;
  groupedDisponibles40: any;
  datosExcel = [];
  totalInventario = 0;
  totalReparaciones = 0;
  maniobras: Maniobra[] = [];
  navieras: Naviera[] = [];
  navieraSeleccionada: string = undefined;
  blockNaviera = false;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('MatPaginatorLR', { read: MatPaginator })
  MatPaginatorLR: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatSort2') MatSort2: MatSort;
  constructor(
    public maniobraService: ManiobraService,
    private usuarioService: UsuarioService,
    private navieraService: NavieraService,
    private _excelService: ExcelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarNavieras();

    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      this.displayedColumnsLR = [
        'actions',
        'fLlegada',
        'viaje',
        'nombre',
        'nombreComercial',
        'contenedor',
        'tipo',
        'peso',
        'grado',
        'lavado',
        'reparaciones'
      ];
    } else {
      this.navieraSeleccionada = this.usuarioLogueado.empresas[0]._id;
      this.blockNaviera = true;
      this.displayedColumnsLR = [
        'fLlegada',
        'viaje',
        'nombre',
        'nombreComercial',
        'contenedor',
        'tipo',
        'peso',
        'grado',
        'lavado',
        'reparaciones'
      ];
    }
    const indexTAB = localStorage.getItem('InventarioTabs');
    if (indexTAB) {
      // tslint:disable-next-line: radix
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }

    this.cargarInventario();
  }

  applyFilter(filterValue: string, dataSource: any, totalRegistros: number) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (dataSource && dataSource.data.length > 0) {
      dataSource.filter = filterValue;
      this.totalRegistros = dataSource.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Inventario');
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
      this.navieraService.getNavieras().subscribe(navieras => {
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
        this.cargarLR();
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

          this.dataSource = new MatTableDataSource(maniobras.maniobras);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = maniobras.maniobras.length;

          if (this.maniobras) {
            resolve(true);
          }
        });
      this.cargando = false;
    });
  }

  // cargarInventario() {
  //   this.cargando = true;
  //   if ((this.usuarioLogueado.role === ROLES.NAVIERA_ROLE || this.usuarioLogueado.role === ROLES.CLIENT_ROLE)
  //     && this.usuarioLogueado.empresas.length > 0) {
  //     this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE, null, null, null, null, null, null, this.usuarioLogueado.empresas[0]._id)
  //       .subscribe(maniobras => {

  //         this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));

  //         const grouped20 = this.c20.reduce((curr, m) => {
  //           if (!curr[m.tipo]) {
  //             // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
  //             curr[m.tipo] = [m];
  //           } else {
  //             // Si ya tienes ese tipo lo agregas al final del arreglo
  //             curr[m.tipo].push(m);
  //           }
  //           return curr;
  //         }, {});

  //         // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
  //         this.groupedDisponibles20 = Object.keys(grouped20).map(tipo => {
  //           return {
  //             tipo: tipo,
  //             maniobras: grouped20[tipo]
  //           };
  //         });

  //         this.c40 = maniobras.maniobras.filter(m => m.tipo.includes('40'));

  //         const grouped40 = this.c40.reduce((curr, m) => {
  //           if (!curr[m.tipo]) {
  //             // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
  //             curr[m.tipo] = [m];
  //           } else {
  //             // Si ya tienes ese tipo lo agregas al final del arreglo
  //             curr[m.tipo].push(m);
  //           }
  //           return curr;
  //         }, {});

  //         // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
  //         this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
  //           return {
  //             tipo: tipo,
  //             maniobras: grouped40[tipo]
  //           };
  //         });

  //         this.dataSource = new MatTableDataSource(maniobras.maniobras);
  //         this.dataSource.sort = this.sort;
  //         this.dataSource.paginator = this.paginator;
  //         this.totalRegistros = maniobras.maniobras.length;
  //       });
  //     this.cargando = false;
  //   } else {
  //     if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
  //       this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE ||
  //       this.usuarioLogueado.role === ROLES.PATIO_ROLE) {
  //       this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE, null, null, null, null, null, null, null, null, null)
  //         .subscribe(maniobras => {
  //           this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));

  //           const grouped20 = this.c20.reduce((curr, m) => {
  //             if (!curr[m.tipo]) {
  //               // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
  //               curr[m.tipo] = [m];
  //             } else {
  //               // Si ya tienes ese tipo lo agregas al final del arreglo
  //               curr[m.tipo].push(m);
  //             }
  //             return curr;
  //           }, {});

  //           // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
  //           this.groupedDisponibles20 = Object.keys(grouped20).map(tipo => {
  //             return {
  //               tipo: tipo,
  //               maniobras: grouped20[tipo]
  //             };
  //           });

  //           this.c40 = maniobras.maniobras.filter(m => m.tipo.includes('40'));

  //           const grouped40 = this.c40.reduce((curr, m) => {
  //             if (!curr[m.tipo]) {
  //               // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
  //               curr[m.tipo] = [m];
  //             } else {
  //               // Si ya tienes ese tipo lo agregas al final del arreglo
  //               curr[m.tipo].push(m);
  //             }
  //             return curr;
  //           }, {});

  //           // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
  //           this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
  //             return {
  //               tipo: tipo,
  //               maniobras: grouped40[tipo]
  //             };
  //           });

  //           this.dataSource = new MatTableDataSource(maniobras.maniobras);
  //           this.dataSource.sort = this.sort;
  //           this.dataSource.paginator = this.paginator;
  //           this.totalRegistros = maniobras.maniobras.length;
  //         });
  //       this.cargando = false;
  //     }
  //   }
  //   this.cargarLR();
  // }

  // cargarLR() {
  //   if (
  //     this.usuarioLogueado.role === ROLES.NAVIERA_ROLE &&
  //     this.usuarioLogueado.empresas.length > 0
  //   ) {
  //     this.cargando = true;
  //     this.maniobraService
  //       .getManiobrasNaviera(
  //         ETAPAS_MANIOBRA.LAVADO_REPARACION,
  //         this.usuarioLogueado.empresas[0]._id
  //       )
  //       .subscribe(maniobras => {
  //         this.dataSourceLR = new MatTableDataSource(maniobras.maniobras);
  //         this.dataSourceLR.sort = this.MatSort2;
  //         this.dataSourceLR.paginator = this.MatPaginatorLR;
  //         this.totalRegistrosLR = maniobras.total;
  //       });
  //     this.cargando = false;
  //   } else {
  //     if (
  //       this.usuarioLogueado.role == ROLES.ADMIN_ROLE ||
  //       this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE ||
  //       this.usuarioLogueado.role == ROLES.PATIO_ROLE
  //     ) {
  //       this.cargando = true;
  //       this.maniobraService
  //         .getManiobrasNaviera(ETAPAS_MANIOBRA.LAVADO_REPARACION)
  //         .subscribe(maniobras => {
  //           this.dataSourceLR = new MatTableDataSource(maniobras.maniobras);
  //           this.dataSourceLR.sort = this.MatSort2;
  //           this.dataSourceLR.paginator = this.MatPaginatorLR;
  //           this.totalRegistrosLR = maniobras.total;
  //         });
  //       this.cargando = false;
  //     }
  //   }
  // }

  cargarLR() {
    this.cargando = true;

    this.maniobraService
      .getManiobras(
        null,
        ETAPAS_MANIOBRA.LAVADO_REPARACION,
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

        this.dataSourceLR = new MatTableDataSource(maniobras.maniobras);
        this.dataSourceLR.sort = this.sort;
        this.dataSourceLR.paginator = this.paginator;
        this.totalRegistrosLR = maniobras.maniobras.length;
      });
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

      let reparaciones = '';

      d.reparaciones.forEach(r => {
        reparaciones += r.reparacion + ', ';
      });

      if (reparaciones.length > 1) {
        reparaciones = reparaciones.substring(0, reparaciones.length - 2);
      }


      // console.log(d)
      const dato = {
        EntradaPatio: d.fLlegada,
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
        // operador: d.operador != undefined ? d.operador.nombre : '',
        Naviera: d.naviera && d.naviera.nombreComercial && d.naviera.nombreComercial !== undefined &&
        d.naviera.nombreComercial !== '' ? d.naviera.nombreComercial : '',
        Reparaciones: reparaciones,
        FAlta: d.fAlta.substring(0, 10),
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

  cuentaInventario(grado: string, estatus: string, source: any): number {
    let count = 0;
    if (source) {
      source.forEach(d => {
        if (d.grado === grado && d.estatus === estatus) {
          count++;
        }
      });
    }
    return count;
  }

  cuentaReparaciones(grado: string, tipo: string, source: any): number {
    let count = 0;
    if (source) {
      source.forEach(d => {
        if (d.grado === grado && d.tipo === tipo && d.reparaciones.length > 0) {
          count++;
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
          if (this.dataSourceLR !== undefined) {
            total += this.cuentaReparaciones(
              'A',
              g20.tipo,
              this.dataSourceLR.data
            );
            total += this.cuentaReparaciones(
              'B',
              g20.tipo,
              this.dataSourceLR.data
            );
            total += this.cuentaReparaciones(
              'C',
              g20.tipo,
              this.dataSourceLR.data
            );
            total += this.cuentaReparaciones(
              'PT',
              g20.tipo,
              this.dataSourceLR.data
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
          if (this.dataSourceLR !== undefined) {
            total += this.cuentaReparaciones(
              'A',
              g40.tipo,
              this.dataSourceLR.data
            );
            total += this.cuentaReparaciones(
              'B',
              g40.tipo,
              this.dataSourceLR.data
            );
            total += this.cuentaReparaciones(
              'C',
              g40.tipo,
              this.dataSourceLR.data
            );
            total += this.cuentaReparaciones(
              'PT',
              g40.tipo,
              this.dataSourceLR.data
            );
          }
        });
      }
    }

    return total;
  }

  obtenSubTotales(tipo: string, dataSource, dataSourceLR): number {
    let subTotal = 0;
    if (tipo.includes('20')) {
      if (dataSource !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (dataSourceLR !== undefined) {
          subTotal += this.cuentaReparaciones(
            'A',
            tipo,
            this.dataSourceLR.data
          );
          subTotal += this.cuentaReparaciones(
            'B',
            tipo,
            this.dataSourceLR.data
          );
          subTotal += this.cuentaReparaciones(
            'C',
            tipo,
            this.dataSourceLR.data
          );
          subTotal += this.cuentaReparaciones(
            'PT',
            tipo,
            this.dataSourceLR.data
          );
        }
      } else if (dataSourceLR !== undefined) {
        subTotal += this.cuentaReparaciones('A', tipo, dataSourceLR.data);
        subTotal += this.cuentaReparaciones('B', tipo, dataSourceLR.data);
        subTotal += this.cuentaReparaciones('C', tipo, dataSourceLR.data);
        subTotal += this.cuentaReparaciones('PT', tipo, dataSourceLR.data);
      }
    } else if (tipo.includes('40')) {
      if (this.groupedDisponibles40 !== undefined) {
        subTotal += this.cuentaInventario('A', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('B', 'DISPONIBLE', dataSource);
        subTotal += this.cuentaInventario('C', 'DISPONIBLE', dataSource);

        if (dataSourceLR !== undefined) {
          subTotal += this.cuentaReparaciones(
            'A',
            tipo,
            this.dataSourceLR.data
          );
          subTotal += this.cuentaReparaciones(
            'B',
            tipo,
            this.dataSourceLR.data
          );
          subTotal += this.cuentaReparaciones(
            'C',
            tipo,
            this.dataSourceLR.data
          );
          subTotal += this.cuentaReparaciones(
            'PT',
            tipo,
            this.dataSourceLR.data
          );
        }
      } else if (dataSourceLR !== undefined) {
        subTotal += this.cuentaReparaciones('A', tipo, this.dataSourceLR.data);
        subTotal += this.cuentaReparaciones('B', tipo, this.dataSourceLR.data);
        subTotal += this.cuentaReparaciones('C', tipo, this.dataSourceLR.data);
        subTotal += this.cuentaReparaciones('PT', tipo, this.dataSourceLR.data);
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
}
