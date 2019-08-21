import { Component, OnInit, ViewChild } from '@angular/core';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;

@Component({
  selector: 'app-transportistas',
  templateUrl: './transportistas.component.html',
  styles: []
})

export class TransportistasComponent implements OnInit {

  transportistas: Transportista[] = [];
  cargando = true;
  totalRegistros = 0;
  desde = 0;

  displayedColumns = ['actions', 'razonSocial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
    'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'caat'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _transportistaService: TransportistaService) { }
  ngOnInit() {
    this.cargarTransportistas();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarTransportistas() {
    this.cargando = true;
    this._transportistaService.getTransportistas(this.desde)
      .subscribe(transportistas => {
        this.dataSource = new MatTableDataSource(transportistas.transportistas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = transportistas.transportistas.length;
      });
    this.cargando = false;
  }

  // cambiarDesde(valor: number) {
  //   const desde = this.desde + valor;
  //   if (desde >= this.totalRegistros) {
  //     return;
  //   }
  //   if (desde < 0) {
  //     return;
  //   }
  //   this.desde += valor;
  //   this.cargarTransportistas();
  // }

  borrarTransportista(transportista: Transportista) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + transportista.razonSocial,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._transportistaService.borrarTransportista(transportista._id)
            .subscribe(borrado => {
              this.cargarTransportistas();
            });
        }
      });
  }

  buscarTransportista(termino: string) {
    if (termino.length <= 0) {
      this.cargarTransportistas();
      return;
    }
    this.cargando = true;
    this._transportistaService.buscarTransportista(termino)
      .subscribe((transportistas: Transportista[]) => {
        this.transportistas = transportistas;
        this.cargando = false;

      });
  }

}
