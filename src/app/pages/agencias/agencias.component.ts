import { Component, OnInit, ViewChild } from '@angular/core';
import { Agencia } from './agencia.models';
import { AgenciaService, ExcelService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;
@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styles: []
})
export class AgenciasComponent implements OnInit {
  agencias: Agencia[] = [];
  agenciasExcel = [];
  cargando = true;
  activo = false;
  tablaCargar = false;
  acttrue = false;
  totalRegistros = 0;

  displayedColumns = [
    'actions',
    'activo',
    'img',
    'rfc',
    'razonSocial',
    'nombreComercial',
    'calle',
    'noExterior',
    'noInterior',
    'colonia',
    'municipio',
    'ciudad',
    'estado',
    'cp',
    'formatoR1',
    'correo',
    'correoFac',
    'credito',
    'patente'
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _agenciaService: AgenciaService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.filtrado(this.activo);
  }


  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
        this.cargarAgencias(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarAgencias(bool);
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
      console.log('Error al filtrar el dataSource de Agencias');
    }
  }

  cargarAgencias(bool: boolean) {
    this.cargando = true;
    this._agenciaService.getAgencias(bool).subscribe(agencias => {
      this.dataSource = new MatTableDataSource(agencias.agencias);
      if (agencias.agencias.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = agencias.agencias.length;
    });
    this.cargando = false;
  }

  borrarAgencia(agencia: Agencia) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + agencia.nombreComercial,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._agenciaService.borrarAgencia(agencia._id).subscribe(borrado => {
          this.filtrado(this.acttrue);
        }, (error) => {
          swal({
            title: 'No se permite eliminar a la Agencia ',
            text: 'La Agencia ' + agencia.nombreComercial + ' cuenta con historial de regisro en el sistema.' +
            ' La acción permitida es DESACTIVAR, ¿ DESEA CONTINUAR ?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
          }).then(act => {
            if (act) {
              this._agenciaService.habilitarDeshabilitarAgencia(agencia, false).subscribe(() => {
                swal ('Correcto', 'Cambio de estatus de la Agencia ' + agencia.nombreComercial + ' realizado con exito', 'success');
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
      const agencias = {
        Rfc: d.rfc,
        RazonSocial: d.razonSocial,
        NombreComercial: d.nombreComercial,
        Calle: d.calle,
        NoExterior: d.noExterior,
        NoInterior: d.noInterior,
        Colonia: d.colonia,
        Municipio: d.municipio,
        Ciudad: d.ciudad,
        Estado: d.estado,
        Cp: d.cp,
        Correo: d.correo,
        CorreoFac: d.correoFac,
        Credito: d.credito,
        Patente: d.patente
      };
      this.agenciasExcel.push(agencias);
    });
  }
  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.agenciasExcel) {
      this.excelService.exportAsExcelFile(this.agenciasExcel, 'Agencia');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  habilitarDeshabilitarAgencia(agencia, event) {
    if (event.checked === false) {
      swal ({
        title: '¿ Estas Seguro ?',
        text: 'Estas apunto de deshabilitar a la Agencia ' + agencia.nombreComercial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrado => {
        if (borrado) {
          this._agenciaService.habilitarDeshabilitarAgencia(agencia, event.checked).subscribe(act => {
          this.acttrue = true;
          this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      });
    } else {
      swal({
        title: '¿ Estas Seguro ?',
        text: 'Estas apunto de habilitar a la Agencia ' + agencia.nombreComercial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrado => {
        if (borrado) {
          this._agenciaService.habilitarDeshabilitarAgencia(agencia, event.checked).subscribe(act => {
            this.acttrue = false;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      });
    }
  }
}
