import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Maniobra } from '../../models/maniobra.models';
import { ManiobraService } from '../../services/service.index';
import { NgForm, FormControl } from '@angular/forms';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';

import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';
import { Camion } from '../../models/camion.models';
import { CamionService } from '../../services/service.index';
import { Viaje } from '../../models/viajes.models';
import { ViajeService } from '../../services/service.index';
import { Contenedor } from '../../models/contenedores.models';
import { ContenedorService } from '../../services/service.index';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';

import { Router, ActivatedRoute } from '@angular/router';
import { ModalDropzoneService } from '../../components/modal-dropzone/modal-dropzone.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-ingreso_camion',
  templateUrl: './ingreso_camion.component.html',
})


export class IngresoCamionComponent implements OnInit {

  maniobra: Maniobra = new Maniobra('', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
  transportistas: any [] = [];
  transportista: Transportista = new Transportista('', '');
  operadores: Operador[] = [];
  operador: Operador = new Operador();
  camiones: Camion[] = [];
  camion: Camion = new Camion();
  contenedores: Contenedor[] = [];
  contenedor: Contenedor = new Contenedor('');
  clientes: Cliente[] = [];
  cliente: Cliente = new Cliente('');
  agencias: Agencia[] = [];
  agencia: Agencia = new Agencia('', '');
  viajes: Viaje[] = [];
  viaje: Viaje = new Viaje('');
  viajec: Viaje = new Viaje('');
  myControl = new FormControl();
  filteredOptions: Observable<Viaje[]>;

  constructor(
    public _maniobraService: ManiobraService,
    public _viajeService: ViajeService,
    public _operadorService: OperadorService,
    public _camionService: CamionService,
    public _contenedorService: ContenedorService,
    public _clienteService: ClienteService,
    public _agenciaService: AgenciaService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalDropzoneService: ModalDropzoneService
  ) {

    activatedRoute.params.subscribe( params => {

      // tslint:disable-next-line:prefer-const
      let id = params['id'];

      if ( id !== 'nuevo' ) {
       
      }

    });

  }

  ngOnInit() {
    this._transportistaService.getTransportistas()
    .subscribe( transportistas => this.transportistas = transportistas );
    console.log("aqui");
    console.log(this.transportistas);
    }


    cambioTransportista( id: string ) {
        this._transportistaService.getTransportistaXID( id )
              .subscribe( transportista => this.transportista = transportista );
    
    
    }


}
