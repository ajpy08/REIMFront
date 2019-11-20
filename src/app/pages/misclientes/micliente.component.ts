import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-micliente',
  templateUrl: './micliente.component.html',
  styles: []
})

export class MiclienteComponent implements OnInit {
  cliente: Cliente = new Cliente();
  clientes: Cliente[] = [];
  usuario: Usuario;

  constructor(public _clienteService: ClienteService,
    public _usuarioService: UsuarioService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
      this.usuario = this._usuarioService.usuario;

      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.getCliente( id );
        }

      });
     }

  ngOnInit() {
  }

  getCliente( id: string ) {
    // this.cargando = true;
    this._clienteService.getCliente( id )
          .subscribe( cliente => {
            this.cliente = cliente;
            //this.cliente.usuario = cliente.usuario._id;
          });
  }

  guardarCliente( f: NgForm ) {

    console.log( f.valid );
    console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._clienteService.guardarCliente( this.cliente )
            .subscribe( cliente => {

              this.cliente._id = cliente._id;

              this.router.navigate(['/micliente', cliente._id ]);

            });

  }

}
