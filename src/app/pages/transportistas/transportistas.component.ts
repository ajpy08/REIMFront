import { Component, OnInit, ViewChild } from '@angular/core';
import { Transportista } from './transportista.models';
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


  displayedColumns = ['actions', 'img', 'rfc', 'razonSocial', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
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
    this._transportistaService.getTransportistas()
      .subscribe(transportistas => {
        this.dataSource = new MatTableDataSource(transportistas.transportistas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = transportistas.transportistas.length;
      });
    this.cargando = false;
  }

  

  borrarTransportista(transportista: Transportista) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + transportista.nombreComercial,
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

}
