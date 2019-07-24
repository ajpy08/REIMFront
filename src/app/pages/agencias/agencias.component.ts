import { Component, OnInit } from '@angular/core';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';
declare var swal: any;
@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styles: []
})
export class AgenciasComponent implements OnInit {
  agencias: Agencia[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;

  constructor(public _agenciaService: AgenciaService) { }

  ngOnInit() {
    this.cargarAgencias();
  }
  
  cargarAgencias() {
    this.cargando = true;
    this._agenciaService.getAgencias(this.desde)
      .subscribe(agencias => {
        this.totalRegistros = agencias.total;
        this.agencias = agencias.agencias;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    //console.log(desde);
    if (desde >= this.totalRegistros) {
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

  borrarAgencia(agencia: Agencia) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + agencia.razonSocial,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._agenciaService.borrarAgencia(agencia._id)
            .subscribe(borrado => {
              this.cargarAgencias();
            });
        }
      });
  }
}
