import { Component, OnInit } from '@angular/core';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styles: []
})
export class TransportistaComponent implements OnInit {
  transportista: Transportista = new Transportista();
  constructor(public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService) {

      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.cargarTransportista( id );
        }

      });
    }

  ngOnInit() {

  }

  cargarTransportista( id: string ) {
    this._transportistaService.cargarTransportista( id )
          .subscribe( transportista => {

            console.log( transportista );
            this.transportista = transportista;
            this.transportista.usuarioAlta = transportista.usuario._id;
          });
  }

  guardarTransportista( f: NgForm ) {

    console.log( f.valid );
    console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._transportistaService.guardarTransportista( this.transportista )
            .subscribe( transportista => {

              this.transportista._id = transportista._id;

              this.router.navigate(['/transportista', transportista._id ]);

            });

  }


}
