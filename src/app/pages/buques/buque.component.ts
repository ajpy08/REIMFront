import { Component, OnInit } from '@angular/core';
import { Buque } from './buques.models';
import { BuqueService, NavieraService } from '../../services/service.index';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Naviera } from 'src/app/pages/navieras/navieras.models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-buque',
  templateUrl: './buque.component.html',
  styles: []
})
export class BuqueComponent implements OnInit {
  buque: Buque = new Buque();
  navieras: Naviera[] = [];
  regForm: FormGroup;
  url: string;


  constructor(public _buqueService: BuqueService,
    public _navieraService: NavieraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location) {
  }

  ngOnInit() {
    this.createFormGroup();
    this._navieraService.getNavieras()
      .subscribe((navieras) => {
        this.navieras = navieras.navieras;
      });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {

      this.cargarBuque(id);
    }
    else {
      for (var control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
    this.url = '/buques';
  }

  cargarBuque(id: string) {
    this._buqueService.getBuque(id)
      .subscribe(res => {
        this.buque = res;
        for (var propiedad in this.buque) {
          for (var control in this.regForm.controls) {
            if (propiedad == control.toString()) {
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
      nombre: ['', [Validators.required]],
      _id: ['']
    });
  }

  guardarBuque() {
    if (this.regForm.valid) {
      this._buqueService.guardarBuque(this.regForm.value)
        .subscribe(res => {
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/buques/buque', this.regForm.get('_id').value]);
          }
          this.regForm.markAsPristine();
        });
    }
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    //this.location.back();
  }
}
