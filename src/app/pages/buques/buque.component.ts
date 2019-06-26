import { Component, OnInit } from '@angular/core';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-buque',
  templateUrl: './buque.component.html',
  styles: []
})
export class BuqueComponent implements OnInit {
  buque: Buque = new Buque();

  constructor(public _buqueService: BuqueService,
    public router: Router,
    public activatedRoute: ActivatedRoute) { 
      activatedRoute.params.subscribe( params => {

        // tslint:disable-next-line:prefer-const
        let id = params['id'];

        if ( id !== 'nuevo' ) {
          this.cargarBuque( id );
        }

      });
    }

  ngOnInit() {
  }

  cargarBuque( id: string ) {
    this._buqueService.cargarBuque( id )
          .subscribe( buque => {

            console.log( buque );
            this.buque = buque;
            this.buque.usuario = buque.usuario._id;
          });
  }

  guardarBuque( f: NgForm ) {

    console.log( f.valid );
    console.log( f.value );

    if ( f.invalid ) {
      return;
    }

    this._buqueService.guardarBuque( this.buque )
            .subscribe( buque => {

              this.buque._id = buque._id;

              this.router.navigate(['/buque', buque._id ]);

            });

  }

}
