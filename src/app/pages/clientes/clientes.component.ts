import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {
  // tslint:disable-next-line:typedef-whitespace
  clientes : Cliente[] = [];
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;

  constructor(public _clienteService: ClienteService) { }

  ngOnInit() {
    this.cargarClientes();
  }
  cargarClientes() {
    this.cargando = true;
    this._clienteService.cargarClientes(this.desde)
    .subscribe(clientes =>
      // this.totalRegistros = resp.total;
      this.clientes = clientes
    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._clienteService.totalClientes) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarClientes();

  }

  buscarCliente(termino: string) {
    if (termino.length <= 0) {
      this.cargarClientes();
      return;
    }
    this.cargando = true;
    this._clienteService.buscarCliente(termino)
    .subscribe((clientes: Cliente[]) => {
      this.clientes = clientes;
      this.cargando = false;

    });
  }

  borrarCliente( cliente: Cliente ) {

    this._clienteService.borrarCliente( cliente._id )
            .subscribe( () =>  this.cargarClientes() );

  }

}
