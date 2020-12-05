import { Component, OnInit, ViewChild } from '@angular/core';
import { Material } from './material.models';
import {
  MaterialService,
  UsuarioService,
  ExcelService
} from '../../services/service.index';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
declare var swal: any;

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent implements OnInit {
  materiales: Material[] = [];
  cargando = true;
  activo = false;
  acttrue = false;
  tablaCargar = false;
  totalRegistros = 0;
  usuarioLogueado: Usuario;
  materialesExcel = [];

  displayedColumns = [
    'actions',
    // 'valPrecios',
    // 'valStock',
    'activo',
    'descripcion',
    'unidadMedida',
    'costo',
    'precio',
    'stock'
  ];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public materialService: MaterialService,
    private usuarioService: UsuarioService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.filtrado(this.activo);

    this.socket.on('new-material', function () {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-material', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-material', function () {
      this.filtrado(this.activo);
    }.bind(this));
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
      console.error('No se puede filtrar en un datasource vacío');
    }
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
        this.cargarMateriales(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarMateriales(bool);
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('delete-material');
    this.socket.removeListener('update-material');
    this.socket.removeListener('new-material');
  }

  cargarMateriales(bool: boolean) {
    this.cargando = true;

    this.materialService.getMateriales(null, bool).subscribe(materiales => {
        this.dataSource = new MatTableDataSource(materiales.materiales);
        if (materiales.materiales.length === 0 || materiales.materiales === undefined) {
          this.tablaCargar = true;
        } else {
          this.tablaCargar = false;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = materiales.materiales.length;
      });
    this.cargando = false;
  }

  habilitaDeshabilitaMaterial(material, event) {
    if (event.checked === false) {
      swal({
        title: '¿Esta seguro?',
        text: 'Esta apunto de deshabilitar a ' + material.descripcion,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this.materialService
            .habilitaDeshabilitaMaterial(material, event.checked)
            .subscribe(() => {
              this.cargarMateriales(true);
            });
        } else {
          event.source.checked = !event.checked;
        }
      });
    } else {
      swal({
        title: '¿Esta seguro?',
        text: 'Esta apunto de habilitar a ' + material.descripcion,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this.materialService
            .habilitaDeshabilitaMaterial(material, event.checked)
            .subscribe(() => {
              this.acttrue = false;
              this.cargarMateriales(true);
            });
        } else {
          event.source.checked = !event.checked;
        }
      });
    }
  }

  borrarMaterial(material: Material) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + material.descripcion,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.materialService
          .borrarMaterial(material)
          .subscribe(() => {
            this.socket.emit('deletematerial', material);
          }, () => {
            swal({
              title: 'No se puede eliminar Material',
              text: 'El material  ' + material.descripcion + '  cuenta con detalles en el sistema. ' +
              'La acción permitida es DESACTIVAR, \n¿ DESEA CONTINUAR ?',
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(borrado => {
              if (borrado) {
                this.materialService.habilitaDeshabilitaMaterial(material, false).subscribe(() => {
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
      const materiales = {
        Nombre_comercial: d.transportista.nombreComercial,
        Nombre: d.nombre,
        VigenciaLicencia: d.vigenciaLicencia,
        Licencia: d.licencia,
        Activo: d.activo
      };
      this.materialesExcel.push(materiales);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.materialesExcel != undefined && this.materialesExcel != null && this.materialesExcel.length > 0) {
      this.excelService.exportAsExcelFile(this.materialesExcel, 'Materiales');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  getStock(material: string) {
    let totalStock = 0;
    this.materialService.getStockMaterial(material).subscribe(stock => {
      totalStock = stock;
    });
    return totalStock;
  }

}
