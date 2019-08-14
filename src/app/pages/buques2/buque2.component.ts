import { Component, OnInit } from '@angular/core';
import { Buque } from '../../models/buques.models';
import { BuqueService, NavieraService } from '../../services/service.index';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Naviera } from 'src/app/models/navieras.models';

@Component({
  selector: 'app-buque2',
  templateUrl: './buque2.component.html',
  styles: []
})
export class Buque2Component implements OnInit {
  buque: Buque = new Buque();
  navieras: Naviera[] = [];
  regForm: FormGroup;
  edicion = false;

  constructor(public _buqueService: BuqueService,
    public _navieraService: NavieraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,) {
  }

  ngOnInit() {
    this.createFormGroup();
    this._navieraService.getNavieras()
      .subscribe((navieras) => {
        this.navieras = navieras.navieras;
      });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarBuque(id);
    }
    else {
      for (var control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
  }

  cargarBuque(id: string) {
    this._buqueService.getBuque(id)
      .subscribe(res => {
        this.buque = res;
        //console.log( this.buque );
        for (var propiedad in this.buque) {
          //console.log(propiedad);
          for (var control in this.regForm.controls) {
            //console.log(control);
            //if( propiedad == control.toString() && res[propiedad] != null && res[propiedad] != undefined) {
            if (propiedad == control.toString()) {
              //console.log(propiedad + ': ' + res[propiedad]);
              this.regForm.controls[propiedad].setValue(res[propiedad]);
            }
          }
        }
      });
  }

  get naviera() {
    return this.regForm.get('naviera');
  }

  get nombre() {
    return this.regForm.get('nombre');
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      naviera: ['', [Validators.required]],
      nombre: [''],
      _id: ['']
    });
  }

  guardarBuque() {
    if (this.regForm.valid) {
      //console.log(this.regForm.value);
      this._buqueService.guardarBuque(this.regForm.value)
        .subscribe(res => {
          // this.fileImg = null;
          // this.fileImgTemporal = false;
          // this.file = null;
          // this.fileTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/buque2', this.regForm.get('_id').value]);
            this.edicion = true;
          }
          this.regForm.markAsPristine();
        });
    }
  }
}
