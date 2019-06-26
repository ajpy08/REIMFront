import { Component, OnInit } from '@angular/core';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from 'src/app/services/service.index';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-naviera',
  templateUrl: './naviera.component.html',
  styles: []
})
export class NavieraComponent implements OnInit {
  naviera: Naviera = new Naviera();

  constructor(public _navieraService: NavieraService,
    public router: Router,
    public activatedRoute: ActivatedRoute
    ) {
      activatedRoute.params.subscribe(params => {
        // tslint:disable-next-line:prefer-const
        let id = params['id'];
        if (id !== 'nuevo') {
          this.cargarNaviera(id);
        }
      });
   }

  ngOnInit() {
  }

  cargarNaviera( id: string ) {
    this._navieraService.cargarNaviera(id)
    .subscribe(naviera => {
      console.log(naviera);
      this.naviera = naviera;
      this.naviera.cliente = naviera.usuario._id;
    });
  }

  guardarNaviera(f: NgForm) {
    console.log(f.valid);
    console.log(f.value);

    if ( f.invalid) {
      return;
    }

    this._navieraService.guardarNaviera(this.naviera)
    .subscribe( naviera => {
      this.naviera._id = naviera._id;
      this.router.navigate(['/naviera', naviera._id]);
    });
  }

}
