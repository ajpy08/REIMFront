import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Maniobra } from '../maniobra.models';
import { ManiobraService } from '../maniobra.service';
import { hypenatePropsObject } from '@angular/animations/browser/src/render/shared';

@Component({
  selector: 'app-papeleta',
  templateUrl: './papeleta.component.html',
  styleUrls: ['./papeleta.component.css']
})
export class PapeletaComponent implements OnInit {
  maniobra = new Maniobra();
  fechaAsignacion = new Date();
  fechaExpiracion = new Date();
  
  constructor(activateRoute: ActivatedRoute, public router: Router, maniobraService: ManiobraService) { 
    activateRoute.params.subscribe( params => {
      let id = params['id'];
      maniobraService.getManiobraConIncludes(id).subscribe((maniobra) => {
        this.maniobra = maniobra.maniobra;
        this.fechaAsignacion = this.maniobra.fAlta;
      });
      if (this.maniobra == undefined) {
        this.router.navigate(['/buques2' ]);
      }
    });
  }

  ngOnInit() {
    this.fechaExpiracion.setDate(this.fechaAsignacion.getDate() + 3);    
  }
}
