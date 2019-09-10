import { Component, OnInit } from '@angular/core';
import { Agencia } from '../agencias/agencia.models';
import { AgenciaService } from '../agencias/agencia.service';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styles: []
})
export class EmpresaComponent implements OnInit {
  cliente: Cliente = new Cliente();
  agencia: Agencia = new Agencia();
  // tslint:disable-next-line:typedef-whitespace
  agencias: Agencia[] = [];

  constructor(public _clienteService: ClienteService,
    public _agenciaService: AgenciaService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {

activatedRoute.params.subscribe( params => {

// tslint:disable-next-line:prefer-const
let id = params['id'];

if ( id !== 'nuevo' ) {
  this.cargarAgencia( id );
}

});

    }

  ngOnInit() {
  }

  cargarAgencia( id: string) {
    this._agenciaService.getAgencia( id )
    .subscribe( agencia => {
      console.log(agencia);
      this.agencia = agencia;
      this.agencia.usuarioAlta = agencia.usuario._id;
    });
  }

}
