import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel, FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Viaje } from '../../models/viajes.models';
import { ViajeService } from '../../services/service.index';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from '../../services/service.index';
import { Contenedor } from '../../models/contenedores.models';
import { ContenedorService } from '../../services/service.index';
import {Observable} from 'rxjs';
import swal from 'sweetalert';

// datapiker
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export class MyItems {
  Value: string;
  constructor(Value: string) {
    this.Value = Value;
  }
}

export interface Vacioimport {
  value: string;
  viewValue: string;
}

export interface Tipo {
  value: string;
  viewValue: string;
}

import * as _moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FileItem } from 'src/app/models/file-item.models';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
import { ExcelService } from '../../services/excel/excel.service';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// tslint:disable-next-line:class-name
export interface datos {
  Contenedor: string;
  Tipo: string;
  Estado: string;
  Cliente: string;
}


@Component({
    selector: 'app-viaje',
    templateUrl: './viaje.component.html',
    styleUrls: ['./viaje.component.css'],
    providers: [
      // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
      // application's root module. We provide it at the component level here, due to limitations of
      // our example generation script.
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      {provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
    ],
  })

  export class ViajeComponent implements OnInit {

  fileTemporal: File;
  forma: FormGroup;
  myControl = new FormControl();
  excelSubir: File;
  filteredOptions: Observable<Contenedor[]>;
  viajes: Viaje[] = [];
  viaje: Viaje = new Viaje('');
  buques: Buque[] = [];
  buque: Buque = new Buque('');
  navieras: Naviera[] = [];
  naviera: Naviera = new Naviera('');
  vacioimports: Vacioimport[] = [
    {value: 'Vacio-0', viewValue: 'Vacio'},
    {value: 'Importacion-1', viewValue: 'Importación'}
  ];
  tipos: Tipo[] = [
    // tslint:disable-next-line:quotemark
    {value: '20-0', viewValue: "20' H"},
    // tslint:disable-next-line:quotemark
    {value: '40-1', viewValue: "40' H"}
  ];
  contenedores: datos[] = [];

    constructor(public _viajeService: ViajeService,
      public _contenedorService: ContenedorService,
      public _buqueService: BuqueService,
      public _navieraService: NavieraService,
      public router: Router,
      public activatedRoute: ActivatedRoute,
      public _modalUploadService: ModalUploadService) {

        activatedRoute.params.subscribe( params => {

          // tslint:disable-next-line:prefer-const
          let id = params['id'];

          if ( id !== 'nuevo' ) {
            this.cargarViaje( id );
          }

        });
      }

    ngOnInit() {
      this._viajeService.cargarViajes()
      .subscribe( viajes => this.viajes = viajes );
      this._buqueService.cargarBuques()
      .subscribe( buques => this.buques = buques );
      this._navieraService.cargarNavieras()
      .subscribe( navieras => this.navieras = navieras );
    }

    cargarViaje( id: string ) {
      this._viajeService.cargarViaje( id )
            .subscribe( viaje => {

              console.log( viaje );
              this.viaje = viaje;
              this.contenedores = viaje.contenedores;
              this.viaje.buque = viaje.buque._id;
              this.cambioBuque( this.viaje.buque );
              // this.viaje.naviera = viaje.naviera._id;
              // this.cambioNaviera( this.viaje.naviera );
              // this.viaje.contenedor = viaje.contenedor._id;
              // this.cambioContenedor( this.viaje.contenedor );
              // this.cambioTransportista( this.camion.transportista );
              // this.camion.usuario = camion.usuario._id;
            });
    }

    cambioBuque( id: string ) {

      this._buqueService.cargarBuque( id )
            .subscribe( buque => this.buque = buque );

    }

    cambioNaviera( id: string ) {

      this._navieraService.cargarNaviera( id )
            .subscribe( naviera => this.naviera = naviera );

    }

    guardarViaje( f: NgForm ) {
    // console.log(this.datos);
    if ( f.invalid ) {
        return;
        }
        this.viaje.contenedores = this.contenedores.map(function(obj) {
            var obj2 = {};
              obj2['Contenedor'] = obj.Contenedor;
              obj2['Tipo'] = obj.Tipo;
              obj2['Estado'] = obj.Estado;
              obj2['Cliente'] = obj.Cliente;
              return obj2;

        });

     console.log(this.viaje);

       this._viajeService.guardarViaje(this.viaje)
       // tslint:disable-next-line:no-shadowed-variable
       .subscribe( viaje => {
          // this.viaje._id = viaje._id;
       // this.router.navigate(['/prealta', prealta._id]);
     });

    }



    seleccionTemporal(archivo: File) {
      console.log(archivo);

       if (!archivo) {
         this.fileTemporal = null;
         return;
       }
       if (archivo.type.indexOf('image') < 0 && archivo.type.indexOf('pdf') < 0) {
        swal('Solo Archivos De Imagen', 'El archivo seleccionado no tiene formato Imagen', 'error');
        this.fileTemporal = null;
        return;
      }
          this.fileTemporal = archivo;

          this._viajeService.seleccionTemporal(this.fileTemporal)
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe( nombreArchivo => {
            this.viaje.pdfTemporal = nombreArchivo;
            console.log(this.viaje.pdfTemporal);
             // this.viaje._id = viaje._id;
          // this.router.navigate(['/prealta', prealta._id]);
        });

     }



    seleccionExcel(archivo: File) {
     // console.log(archivo.name);
      // Obtener nombre del archivo
      var nombreCortado = archivo.name.split('.');
      var extensionArchivo = nombreCortado[nombreCortado.length - 1];
     // console.log(extensionArchivo);

      // Sólo estas extensiones aceptamos
      var extensionesValidas = ['xlsx', 'xls'];

      if (!archivo) {
        this.excelSubir = null;
        return;
      }
      if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        swal('Solo Archivos Excel', 'El archivo seleccionado no tiene formato .xls o .xlsx', 'error');
        this.excelSubir = null;
        return;

      }
         
      this.excelSubir = archivo;
      this.cargarExcel() ;

         // tslint:disable-next-line:prefer-const
        // let reader = new FileReader();
         // tslint:disable-next-line:prefer-const
         // let urlImagenTemp = reader.readAsDataURL(archivo);
        // reader.onloadend = () => this.imagenTemp = reader.result;
    }

    cargarExcel() {
      // console.log(this.excelSubir);
      this._viajeService.cargarExcel(this.excelSubir)
      .subscribe( excel => { 
        // console.log(excel);
        this.contenedores = excel;
        this.viaje.viaje = excel[0].Viaje;

        let index = this.buques.find( dato => dato.buque == excel[0].Buque);

        if (!index) {
          swal( 'El nombre del Buque', 'No fue encontrado en el catalogo', 'error' );
        } else { this.viaje.buque = index._id }

        console.log(this.contenedores);
        console.log(this.viaje.viaje);
        console.log(index);
      });
     }

    anadirContenedor(contenedor: string, tipo: string, estado: string, cliente: string ) {
        // console.log(value);
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:triple-equals
    let index = this.contenedores.find( dato => dato.Contenedor == contenedor);

    // tslint:disable-next-line:triple-equals
    if (contenedor == '') {
      swal( 'Error esta vacio', 'No fue posible insertar', 'error' );
      // console.log('Error esta vacio');
      return;
     }
     if (index != null) {
      swal( 'Error Contenedor Duplicado', 'No fue posible insertar: ' + index.Contenedor, 'error' );
      // console.log('Contenedor duplicado ' + index.contenedor);
     } else {
      // tslint:disable-next-line:max-line-length
      this.contenedores.push({Contenedor: contenedor, Tipo: tipo, Estado: estado, Cliente: cliente});
     }
    }

    limpiarArchivos() {}

  }
