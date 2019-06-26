import { Component, OnInit } from '@angular/core';
import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styles: []
})
export class OperadoresComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  operadores : Operador[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;

  constructor(public _operadorService: OperadorService) { }

  ngOnInit() {
    this.cargarOperadores();
  }

  cargarOperadores() {
    this.cargando = true;
    this._operadorService.cargarOperadores(this.desde)
    .subscribe(operadores =>
      // this.totalRegistros = resp.total;
      this.operadores = operadores
    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._operadorService.totalOperadores) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarOperadores();

  }

  buscarOperador(termino: string) {
    if (termino.length <= 0) {
      this.cargarOperadores();
      return;
    }
    this.cargando = true;
    this._operadorService.buscarOperador(termino)
    .subscribe((operadores: Operador[]) => {
      this.operadores = operadores;
      this.cargando = false;

    });
  }

  borrarOperador( operador: Operador ) {

    this._operadorService.borrarOperador( operador._id )
            .subscribe( () =>  this.cargarOperadores() );

  }
}
