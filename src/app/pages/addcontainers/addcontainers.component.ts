import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Viaje } from '../viajes/viaje.models';
import { ViajeService } from '../../services/service.index';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from '../../services/service.index';
import { Contenedor } from '../../models/contenedores.models';
import { ContenedorService } from '../../services/service.index';
import { NgForm } from '@angular/forms';

export interface Vacioimport {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-addcontainers',
  templateUrl: './addcontainers.component.html',
  styleUrls: ['./addcontainers.component.css']
})
export class AddcontainersComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  viajes: Viaje[] = [];
  viaje: Viaje = new Viaje('');
  viajec: Viaje = new Viaje('');
  buques: Buque[] = [];
  buque: Buque = new Buque('');
  navieras: Naviera[] = [];
  naviera: Naviera = new Naviera('');
  contenedores: Contenedor[] = [];
  contenedor: Contenedor = new Contenedor('');
  vacioimports: Vacioimport[] = [
    {value: 'Vacio', viewValue: 'Vacio'},
    {value: 'Importacion', viewValue: 'Importación'}
  ];
  constructor(
    public _viajeService: ViajeService,
    public _buqueService: BuqueService,
    public _navieraService: NavieraService,
    public _contenedorService: ContenedorService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
       activatedRoute.params.subscribe( params => {

          // tslint:disable-next-line:prefer-const
          let id = params['id'];

          if ( id !== 'nuevo' ) {
            this.cargarViaje( id );
          }

        });
     }

  ngOnInit() {
    this._viajeService.getViajes()
    .subscribe( viajes => this.viajes = viajes );
    this._buqueService.cargarBuques()
    .subscribe( buques => this.buques = buques );
    this._navieraService.getNavieras()
    .subscribe( navieras => this.navieras = navieras );
    this._contenedorService.cargarContenedores()
    .subscribe( contenedores => this.contenedores = contenedores );
  }
  cargarViaje( id: string) {
    this._viajeService.getViajeXID( id )
          .subscribe( viaje => {

            console.log( viaje );
            this.viaje = viaje;
            // this.viaje.buque = viaje.buque._id;
            // this.cambioBuque( this.viaje.contenedor );
          });
  }

  actualizarContenedor( f: NgForm ) {

    // console.log( f.valid );
    // console.log( f.value );
    // console.log(this.viaje);

    if ( f.invalid ) {
      return;
    }

    // this._viajeService.actualizarContenedor( this.viaje )
    //         .subscribe( viaje => {

    //           this.viaje._id = viaje._id;
    //           this.cargarViaje(this.viaje._id);

    //         });

  }

  removerContenedor(id: string, viaje: Viaje) {
  //  // console.log(viaje);
  //  this._viajeService.removerContenedor( id, viaje )
  //  .subscribe( cviaje => {
  //   this.viaje._id = this.viaje._id;
  //   // console.log(this.viaje);
  //   this.cargarViaje(this.viaje._id);
  //  });

  }


  cambioContenedor( id: string ) {

    this._contenedorService.cargarContenedor( id )
          .subscribe( contenedor => this.contenedor = contenedor );

  }

}
