import { Component, OnInit } from '@angular/core';
import { Viaje } from './viaje.models';
import { ViajeService } from '../../services/service.index';
declare var swal: any;

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styles: []
})

export class ViajesComponent implements OnInit {

  viajes: Viaje[] = [];
  cargando = true;
  totalRegistros = 0;
  desde = 0;

  constructor(public _viajeService: ViajeService) { }
  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.cargando = true;
    this._viajeService.getViajes(this.desde)
    .subscribe(viajes => {
      this.totalRegistros = viajes.total;
      this.viajes = viajes.viajes;
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
    this.cargarViajes();
  }

  borrarViaje (viaje: Viaje) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a el viaje ' + viaje.viaje,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      })
      .then(borrar => {
        if (borrar) {
          this._viajeService.borrarViaje(viaje._id)
          .subscribe(borrado => {
            this.cargarViajes();
          });
        }
      });
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


}
