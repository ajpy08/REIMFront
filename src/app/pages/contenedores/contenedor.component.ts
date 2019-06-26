import { Component, OnInit } from '@angular/core';
import { Contenedor } from '../../models/contenedores.models';
import { ContenedorService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-contenedor',
  templateUrl: './contenedor.component.html',
  styles: []
})
export class ContenedorComponent implements OnInit {
    contenedor: Contenedor = new Contenedor();
    constructor(public _contenedorService: ContenedorService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService) {

      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.cargarContenedor( id );
        }

      });
    }

  ngOnInit() {

  }

  cargarContenedor( id: string ) {
    this._contenedorService.cargarContenedor( id )
          .subscribe( contenedor => {

            console.log( contenedor );
            this.contenedor = contenedor;
            this.contenedor.usuario = contenedor.usuario._id;
          });
  }

  guardarContenedor( f: NgForm ) {

    console.log( f.valid );
    console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._contenedorService.guardarContenedor( this.contenedor )
            .subscribe( contenedor => {

              this.contenedor._id = contenedor._id;

              this.router.navigate(['/contenedor', contenedor._id ]);

            });

  }


}
