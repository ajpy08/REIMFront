import { Component, OnInit } from '@angular/core';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';

@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styles: []
})
export class AgenciasComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  agencias: Agencia[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;

  constructor(public _agenciaService: AgenciaService) { }

  ngOnInit() {
    this.cargarAgencias();
  }
  cargarAgencias() {
    this.cargando = true;
    this._agenciaService.cargarAgencias(this.desde)
    .subscribe(agencias =>
      // this.totalRegistros = resp.total;
      this.agencias = agencias

    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._agenciaService.totalAgencias) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarAgencias();

  }

  buscarAgencia(termino: string) {
    if (termino.length <= 0) {
      this.cargarAgencias();
      return;
    }
    this.cargando = true;
    this._agenciaService.buscarAgencia(termino)
    .subscribe((agencias: Agencia[]) => {
      this.agencias = agencias;
      this.cargando = false;

    });
  }

  borrarAgencia( agencia: Agencia ) {

    this._agenciaService.borrarAgencia( agencia._id )
            .subscribe( () =>  this.cargarAgencias() );

  }

}
