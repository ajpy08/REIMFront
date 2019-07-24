import { Component, OnInit } from '@angular/core';
import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';
declare var swal: any;
@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styles: []
})
export class OperadoresComponent implements OnInit {
  operadores: Operador[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;

  constructor(public _operadorService: OperadorService) { }

  ngOnInit() {
    this.cargarOperadores();
  }

  cargarOperadores() {
    this.cargando = true;
    this._operadorService.getOperadores(this.desde)
      .subscribe(operadores => {
        this.totalRegistros = operadores.totalRegistros;
        this.operadores = operadores.operadores;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    //console.log(desde);
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

  borrarOperador(operador: Operador) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + operador.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._operadorService.borrarOperador(operador._id)
            .subscribe(borrado => {
              this.cargarOperadores();
            });
        }
      });
  }
}
