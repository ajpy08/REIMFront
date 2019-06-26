import { Component, OnInit } from '@angular/core';
import { Contenedor } from '../../models/contenedores.models';
import { ContenedorService } from '../../services/service.index';

@Component({
  selector: 'app-contenedores',
  templateUrl: './contenedores.component.html',
  styles: []
})
export class ContenedoresComponent implements OnInit {
   // tslint:disable-next-line:typedef-whitespace
   contenedor: Contenedor[] = [];
   // tslint:disable-next-line:no-inferrable-types
   cargando: boolean = true;
   // tslint:disable-next-line:no-inferrable-types
   totalRegistros: number = 0;
   // tslint:disable-next-line:no-inferrable-types
   desde: number = 0;

  constructor(public _contenedorService: ContenedorService) { }

  ngOnInit() {
    this.cargarContenedores();
  }

  cargarContenedores() {
    this.cargando = true;
    this._contenedorService.cargarContenedores(this.desde)
    .subscribe(contenedor =>
      // this.totalRegistros = resp.total;
      this.contenedor = contenedor

    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._contenedorService.totalContenedores) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarContenedores();

  }

  buscarContenedor(termino: string) {
    if (termino.length <= 0) {
      this.cargarContenedores();
      return;
    }
    this.cargando = true;
    this._contenedorService.buscarContenedor(termino)
    .subscribe((contenedor: Contenedor[]) => {
      this.contenedor = contenedor;
      this.cargando = false;

    });
  }

  borrarContenedor( contenedor: Contenedor ) {

    this._contenedorService.borrarContenedor( contenedor._id )
            .subscribe( () =>  this.cargarContenedores() );

  }
}
