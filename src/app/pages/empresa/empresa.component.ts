import { Component, OnInit } from '@angular/core';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/agencia/agencia.service';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../models/usuarios.model';

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
    this._agenciaService.cargarAgencia( id )
    .subscribe( agencia => {
      console.log(agencia);
      this.agencia = agencia;
      this.agencia.usuarioAlta = agencia.usuario._id;
    });
  }

}
