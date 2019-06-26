import { Component, OnInit } from '@angular/core';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';

@Component({
  selector: 'app-buques',
  templateUrl: './buques.component.html',
  styles: []
})
export class BuquesComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  buques: Buque[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;

  constructor(public _buqueService: BuqueService) { }

  ngOnInit() {
    this.cargarBuques();
  }

  cargarBuques() {
    this.cargando = true;
    this._buqueService.cargarBuques(this.desde)
    .subscribe(buques =>
      // this.totalRegistros = resp.total;
      this.buques = buques

    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._buqueService.totalBuques) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarBuques();

  }

  buscarBuque(termino: string) {
    if (termino.length <= 0) {
      this.cargarBuques();
      return;
    }
    this.cargando = true;
    this._buqueService.buscarBuque(termino)
    .subscribe((buque: Buque[]) => {
      this.buques = buque;
      this.cargando = false;

    });
  }

  borrarBuque( buque: Buque ) {

    this._buqueService.borrarBuque( buque._id )
            .subscribe( () =>  this.cargarBuques() );

  }


}
