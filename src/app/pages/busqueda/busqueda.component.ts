import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../usuarios/usuario.model';
import { Operador } from '../../models/operador.models';
import { Camion } from '../../models/camion.models';
import { Cliente } from '../../models/cliente.models';
import { Contenedor } from '../../models/contenedores.models';
import { Agencia } from '../../models/agencia.models';
import { Transportista } from '../../models/transportista.models';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  contenedores: Contenedor[] = [];
  clientes: Cliente[] = [];
  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];


  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {

    activatedRoute.params
      .subscribe( params => {
        // tslint:disable-next-line:prefer-const
        let termino = params['termino'];
        this.buscar( termino );
      });

  }

  ngOnInit() {
  }

  buscar( termino: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get( url )
        .subscribe( (resp: any) => {

          console.log( resp );
          this.operadores = resp.operadores;
          this.camiones = resp.camiones;
          this.contenedores = resp.contenedores;
          this.clientes = resp.clientes;
          this.agencias = resp.agencias;
          this.transportistas = resp.transportistas;
          this.usuarios = resp.usuarios;
        });

  }

}
