import { Component, OnInit } from '@angular/core';
import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';

import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
// datapiker
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import swal from 'sweetalert';

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

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.css'],
  providers: [
      // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
      // application's root module. We provide it at the component level here, due to limitations of
      // our example generation script.
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      {provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
    ],
})
export class OperadorComponent implements OnInit {

  fotoTemporal: File;
  rutaFoto : string;
  licenciaTemporal: File;
  transportistas: Transportista[] = [];
  operador: Operador = new Operador();


  constructor(
    public _operadorService: OperadorService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe( params => {

      // tslint:disable-next-line:prefer-const
      let id = params['id'];

      if ( id !== 'nuevo' ) {
        this.cargarOperador( id );
        this.rutaFoto = '';
      }
      else
      {
        this.rutaFoto = './uploads/operadores/';
      }

    });
  }

  ngOnInit() {

    this._transportistaService.getTransportistas()
    .subscribe( transportistas => this.transportistas = transportistas );

    this._modalUploadService.notification
    .subscribe( resp => {
      this.operador.img = resp.operador.img;
    });
  }

  cargarOperador( id: string ) {
    this._operadorService.getOperador( id )
          .subscribe( operador => {
            console.log( operador );
            this.operador = operador;
          });
  }

  guardarOperador( f: NgForm ) {

    console.log( f.valid );
    console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._operadorService.guardarOperador( this.operador )
            .subscribe( operador => {

              this.operador._id = operador._id;

              this.router.navigate(['/operador', operador._id ]);

            });

  }

  subirFotoTermporal(archivo: File) {
    console.log(archivo);

     if (!archivo) {
       this.fotoTemporal = null;
       return;
     }
     if (archivo.type.indexOf('image') < 0 && archivo.type.indexOf('pdf') < 0) {
      swal('Solo Archivos De Imagen', 'El archivo seleccionado no tiene formato Imagen', 'error');
      this.fotoTemporal = null;
      return;
    }
        this.fotoTemporal = archivo;
        this._operadorService.subirArchivoTemporal(this.fotoTemporal)
        // tslint:disable-next-line:no-shadowed-variable
        .subscribe( nombreArchivo => {
          this.rutaFoto = './uploads/temp/';
          this.operador.img = nombreArchivo;
          console.log(this.operador.img);
      });
   }

   subirLicenciaTermporal(archivo: File) {
    console.log(archivo);

     if (!archivo) {
       this.licenciaTemporal = null;
       return;
     }
     if (archivo.type.indexOf('image') < 0 && archivo.type.indexOf('pdf') < 0) {
      swal('Solo Archivos De Imagen', 'El archivo seleccionado no tiene formato Imagen', 'error');
      this.licenciaTemporal = null;
      return;
    }
        this.licenciaTemporal = archivo;
        this._operadorService.subirArchivoTemporal(this.licenciaTemporal)
        // tslint:disable-next-line:no-shadowed-variable
        .subscribe( nombreArchivo => {
          this.operador.licencia = nombreArchivo;
          console.log(this.operador.licencia);
      });
   }

  cambiarFoto() {

    this._modalUploadService.mostrarModal( 'operadores', this.operador._id );

  }


}
