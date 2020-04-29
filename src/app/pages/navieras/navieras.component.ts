import { OnInit, ViewChild, Component } from '@angular/core';
import { Naviera } from './navieras.models';
import { NavieraService, ExcelService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;
@Component({
  selector: 'app-navieras',
  templateUrl: './navieras.component.html'
})
export class NavierasComponent implements OnInit {
  navieras: Naviera[] = [];
  cargando = true;
  activo = false;
  acttrue = false;
  tablaCargar = false;
  totalRegistros = 0;
  navieraExcel = [];

  displayedColumns = [
    'actions',
    'activo',
    'img',
    'rfc',
    'razonSocial',
    'calle',
    'noExterior',
    'colonia',
    'municipio',
    'ciudad',
    'estado',
    'cp',
    'formatoR1',
    'correo',
    'correoFac',
    'credito',
    'caat'
  ];

  // displayedColumns = ['actions', 'img', 'razonSocial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
  // 'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'caat'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _navieraService: NavieraService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.filtrado(this.activo);
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
        this.cargarNavieras(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarNavieras(bool);
    }

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
      console.error('Error al filtrar el dataSource de Navieras');
    }
  }

  cargarNavieras(bool: boolean) {
    this.cargando = true;
    this._navieraService.getNavieras(bool).subscribe(navieras => {
      this.dataSource = new MatTableDataSource(navieras.navieras);
      if (navieras.navieras.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = navieras.navieras.length;
    });
    this.cargando = false;
  }

  borrarNaviera(naviera: Naviera) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + naviera.nombreComercial,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._navieraService.borrarNaviera(naviera).subscribe(borrado => {
          this.filtrado(this.activo);
        }, (error) => {
          swal({
            title: 'No se permite eliminar Naviera',
            text: 'La naviera  ' + naviera.nombreComercial + ' cuenta con historial de registro en el sistema. ' +
              ' La acción permitida es DESACTIVAR,  ¿ DESEA CONTINUAR?',
              icon: 'warning',
              buttons: true,
              dangerMode: true
          }).then(act => {
            if (act) {
              this._navieraService.habilitaDeshabilitaNaviera(naviera, false).subscribe(() => {
                swal('Correcto', 'Cambio de estado de la Naviera ' + naviera.nombreComercial + 'realizado con exito', 'success');
                this.filtrado(this.acttrue);
              });
            }
          });
        });
      }
    });
  }
  crearDatosExcel(datos) {
    datos.forEach(d => {
      var naviera = {
        Rfc: d.rfc,
        RazonSocial: d.razonSocial,
        Calle: d.calle,
        No_Exterior: d.noExterior,
        Colonia: d.colonia,
        Municipio: d.municipio,
        Ciudad: d.ciudad,
        Estado: d.estado,
        CP: d.cp,
        Correo: d.correo,
        Correo_Facturación: d.correoFac,
        Credito: d.credito,
        Caat: d.caat,
        FAlta: d.fAlta.substring(0, 10)
      };
      this.navieraExcel.push(naviera);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.navieraExcel) {
      this.excelService.exportAsExcelFile(this.navieraExcel, 'Naviera');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  habilitarDesabilitarNaviera(naviera, event) {
    if (event.checked === false) {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de deshabilitar a la naviera ' + naviera.nombreComercial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._navieraService.habilitaDeshabilitaNaviera(naviera, event.checked).subscribe(borado => {
            this.acttrue = true;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    } else {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de habilitar a la naviera con placa ' + naviera.nombreComercial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._navieraService.habilitaDeshabilitaNaviera(naviera, event.checked).subscribe(borado => {
            this.acttrue = false;
            this.filtrado(this.acttrue);
            
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    }

  }
}

