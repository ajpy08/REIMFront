import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styles: []
})
export class ClienteComponent implements OnInit {
  cliente: Cliente = new Cliente();
  agencias: Agencia[] = [];
  constructor(public _clienteService: ClienteService,public _agenciaService: AgenciaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService) {

      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.cargarCliente( id );
        }

      });
    }

  ngOnInit() {
    this._agenciaService.getAgencias()
    .subscribe( agencias => this.agencias = agencias );

  }
  cargarCliente( id: string ) {
    this._clienteService.cargarCliente( id )
          .subscribe( cliente => {
            console.log( cliente );
            this.cliente = cliente;
            this.cliente.usuarioAlta = cliente.usuario._id;
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

              this.router.navigate(['/cliente', cliente._id ]);

            });

  }


}
