import { Component, OnInit } from '@angular/core';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
declare var swal: any;
@Component({
  selector: 'app-buques',
  templateUrl: './buques.component.html',
  styles: []
})
export class BuquesComponent implements OnInit {
  buques: Buque[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;

  constructor(public _buqueService: BuqueService) { }

  ngOnInit() {
    this.cargarBuques();
  }

  cargarBuques() {
    this.cargando = true;
    this._buqueService.getBuques(this.desde)
      .subscribe(buques => {
        this.totalRegistros = buques.total,
          this.buques = buques.buques
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
    this.cargarBuques();

  }

  buscarBuque(termino: string) {
    if (termino.length <= 0) {
      this.cargarBuques();
      return;
    }
    this.cargando = true;
    this._buqueService.buscarBuque(termino)
      .subscribe((buques: Buque[]) => {
        this.buques = buques;
        this.cargando = false;
      });
  }

  borrarBuque(buque: Buque) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + buque.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._buqueService.borrarBuque(buque._id)
            .subscribe(() => this.cargarBuques());
        }
      });
  }
}
