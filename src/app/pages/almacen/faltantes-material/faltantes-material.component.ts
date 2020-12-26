import { AlmacenService } from './../almacen.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Material } from '../materiales/material.models';
import {
  MaterialService,
  UsuarioService,
  ExcelService
} from '../../../services/service.index';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { VariasService } from '../../facturacion/varias.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var swal: any;

@Component({
  selector: 'app-faltantes-material',
  templateUrl: './faltantes-material.component.html',
  styleUrls: ['./faltantes-material.component.css']
})
export class FaltantesMaterialComponent implements OnInit {
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
    'descripcion',
    'unidadMedida',
    'costo',
    'precio',
    'stock',
    'minimo'
  ];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public materialService: MaterialService,
    private usuarioService: UsuarioService,
    private excelService: ExcelService,
    public router: Router,
    public almacenService: AlmacenService
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
      if (this.dataSource.filteredData.length === 0) {
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

      let datos = materiales.materiales;

      const start = async () => {
        await VariasService.asyncForEach(datos, async (d) => {
          const stock: any = await this.materialService.getStockMaterialAsync(d._id);
          d.stock = stock.stock;
        });
        datos = datos.filter((i) => { return i.stock <= i.minimo.$numberDecimal });
        this.dataSource = new MatTableDataSource(datos);
        if (materiales.materiales.length === 0 || materiales.materiales === undefined) {
          this.tablaCargar = true;
        } else {
          this.tablaCargar = false;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = datos.length;
      };
      start();
    });
    this.cargando = false;
  }

  async filtraMovs(material) {
    // const mat: any = await this.materialService.getMaterialAsync(material);
    // if (mat.material) {
    //   this.almacenService.material = mat.material;
    // }
    this.almacenService.material = material;
    this.router.navigate(['/reporte-movimientos']);
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
        Descripcion: d.descripcion,
        Unidad: d.unidadMedida.descripcion,
        Costo: d.costo.$numberDecimal,
        Precio: d.precio.$numberDecimal,
        Stock: d.stock
      };
      this.materialesExcel.push(materiales);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.materialesExcel != undefined && this.materialesExcel != null && this.materialesExcel.length > 0) {
      this.excelService.exportAsExcelFile(this.materialesExcel, 'Inventario_Materiales');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
