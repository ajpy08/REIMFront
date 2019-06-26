import { Component, OnInit } from '@angular/core';
import { Viaje } from '../../models/viajes.models';
import { ViajeService } from '../../services/service.index';
import { Contenedor } from '../../models/contenedores.models';
import { ContenedorService } from '../../services/service.index';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styles: []
})
export class ViajesComponent implements OnInit {
   // tslint:disable-next-line:typedef-whitespace
   viajes: Viaje[] = [];
  // viajes: Viaje = new Viaje('', []);
   contenedores: Contenedor[] = [];
    // contenedor: Contenedor = new Contenedor('');
   // tslint:disable-next-line:no-inferrable-types
   cargando: boolean = true;
   // tslint:disable-next-line:no-inferrable-types
   totalRegistros: number = 0;
   // tslint:disable-next-line:no-inferrable-types
   desde: number = 0;

  constructor(public _viajeService: ViajeService) { }

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.cargando = true;
    this._viajeService.cargarViajes(this.desde)
    .subscribe(viajes =>
      // this.totalRegistros = resp.total;
    // console.log(viajes),
    this.viajes = viajes

    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    // console.log(desde);
    if (desde >= this._viajeService.totalViajes) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarViajes();

  }

  buscarViaje(termino: string) {
    if (termino.length <= 0) {
      this.cargarViajes();
      return;
    }
    this.cargando = true;
    this._viajeService.buscarViaje(termino)
    .subscribe((viajes: Viaje[]) => {
      this.viajes = viajes;
      this.cargando = false;

    });
  }

  borrarViaje( viajes: Viaje ) {

    this._viajeService.borrarViaje( viajes._id )
            .subscribe( () =>  this.cargarViajes() );

  }
}
