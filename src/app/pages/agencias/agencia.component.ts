import { Component, OnInit } from '@angular/core';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-agencia',
  templateUrl: './agencia.component.html',
  styles: []
})
export class AgenciaComponent implements OnInit {
  agencia: Agencia = new Agencia();
  constructor(public _agenciaService: AgenciaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService) {

      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.cargarAgencia( id );
        }

      });
    }

  ngOnInit() {

  }

  cargarAgencia( id: string ) {
    this._agenciaService.cargarAgencia( id )
          .subscribe( agencia => {

            console.log( agencia );
            this.agencia = agencia;
            this.agencia.usuarioAlta = agencia.usuario._id;
          });
  }

  guardarAgencia( f: NgForm ) {

    console.log( f.valid );
    console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._agenciaService.guardarAgencia( this.agencia )
            .subscribe( agencia => {

              this.agencia._id = agencia._id;

              this.router.navigate(['/agencia', agencia._id ]);

            });

  }


}
