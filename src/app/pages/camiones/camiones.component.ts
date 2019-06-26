import { Component, OnInit } from '@angular/core';
import { Camion } from '../../models/camion.models';
import { CamionService } from '../../services/service.index';

@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.component.html',
  styles: []
})
export class CamionesComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  camiones : Camion[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;
  constructor(public _camionService: CamionService) { }

  ngOnInit() {
    this.cargarCamiones();
  }

  cargarCamiones() {
    this.cargando = true;
    this._camionService.cargarCamiones(this.desde)
    .subscribe(camiones =>
      // this.totalRegistros = resp.total;
      this.camiones = camiones
    );
   }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._camionService.totalCamiones) {
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

  borrarCamion( camiones: Camion ) {

    this._camionService.borrarCamion( camiones._id )
            .subscribe( () =>  this.cargarCamiones() );

  }

}
