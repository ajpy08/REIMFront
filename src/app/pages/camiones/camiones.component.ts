import { Component, OnInit } from '@angular/core';
import { Camion } from '../../models/camion.models';
import { CamionService } from '../../services/service.index';
declare var swal: any;
@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.component.html',
  styles: []
})
export class CamionesComponent implements OnInit {
  camiones : Camion[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;

  constructor(public _camionService: CamionService) { }

  ngOnInit() {
    this.cargarCamiones();
  }

  cargarCamiones() {
    this.cargando = true;
    this._camionService.getCamiones(this.desde)
    .subscribe(camiones => {
      this.totalRegistros = camiones.total,
      this.camiones = camiones.camiones
      this.cargando = false;
    });
   }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarCamiones();
  }

  buscarCamion(termino: string) {
    if (termino.length <= 0) {
      this.cargarCamiones();
      return;
    }
    this.cargando = true;
    this._camionService.buscarCamion(termino)
    .subscribe((camiones: Camion[]) => {
      this.camiones = camiones;
      this.cargando = false;
    });
  }

  borrarCamion( camion: Camion ) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + camion.noEconomico,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._camionService.borrarCamion( camion._id )
            .subscribe(borrado => {
              this.cargarCamiones();
            });
        }
      });
  }
}
