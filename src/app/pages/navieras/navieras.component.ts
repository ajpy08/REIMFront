import { Component, OnInit } from '@angular/core';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from '../../services/service.index';

@Component({
  selector: 'app-navieras',
  templateUrl: './navieras.component.html',
  styles: []
})
export class NavierasComponent implements OnInit {

  navieras: Naviera[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  // totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;

  constructor(public _navieraService: NavieraService) { }

  ngOnInit() {
    this.cargarNavieras();
  }

  cargarNavieras() {
    this.cargando = true;
    this._navieraService.cargarNavieras(this.desde)
    .subscribe(navieras =>
      this.navieras = navieras
      );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._navieraService.totalNavieras) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarNavieras();
  }

  buscarNaviera(termino: string) {
    if (termino.length <= 0) {
      this.cargarNavieras();
      return;
    }
    this.cargando = true;
    this._navieraService.buscarNaviera(termino)
    .subscribe((navieras: Naviera[]) => {
      this.navieras = navieras;
      this.cargando = false;
    });
  }

  borrarNaviera( naviera: Naviera ) {
    this._navieraService.borrarNaviera(naviera._id)
    .subscribe(() => this.cargarNavieras());
  }

}
