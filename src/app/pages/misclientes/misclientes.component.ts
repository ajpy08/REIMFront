import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-misclientes',
  templateUrl: './misclientes.component.html',
  styles: []
})
export class MisclientesComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  clientes : Cliente[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;
  constructor(public _clienteService: ClienteService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {

      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.cargarClientes( id );
        }

      });
    }

  ngOnInit() {
  }

  cargarClientes( id: string ) {
    this.cargando = true;
    this._clienteService.getClientesEmpresa( id )
          .subscribe( clientes => {
            this.clientes = clientes;
            // this.cliente.usuario = cliente.usuario._id;
          });
  }

}
