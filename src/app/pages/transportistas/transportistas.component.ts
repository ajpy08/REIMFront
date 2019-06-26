import { Component, OnInit } from '@angular/core';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';

@Component({
  selector: 'app-transportistas',
  templateUrl: './transportistas.component.html',
  styles: []
})
export class TransportistasComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  transportistas : Transportista[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;

  constructor(public _transportistaService: TransportistaService) { }

  ngOnInit() {
    this.cargarTransportistas();
  }
  cargarTransportistas() {
    this.cargando = true;
    this._transportistaService.cargarTransportistas(this.desde)
    .subscribe(transportistas =>
      // this.totalRegistros = resp.total;
      this.transportistas = transportistas

    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._transportistaService.totalTransportistas) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarTransportistas();

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

  borrarTransportista( transportista: Transportista ) {

    this._transportistaService.borrarTransportista( transportista._id )
            .subscribe( () =>  this.cargarTransportistas() );

  }

}
