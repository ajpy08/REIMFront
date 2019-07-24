import { Component, OnInit } from '@angular/core';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
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

  constructor(public _transportistaService: TransportistaService) { }
  ngOnInit() {
    this.cargarTransportistas();
  }

  cargarTransportistas() {
    this.cargando = true;
    this._transportistaService.getTransportistas(this.desde)
    .subscribe(transportistas => {
              this.totalRegistros = transportistas.total;
              this.transportistas = transportistas.transportistas;
              this.cargando = false;
            });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarTransportistas();
  }

  borrarTransportista( transportista: Transportista ) {
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
