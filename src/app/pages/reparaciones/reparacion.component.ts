import { Component, OnInit } from '@angular/core';
import { Reparacion } from 'src/app/pages/reparaciones/reparacion.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReparacionService } from 'src/app/pages/reparaciones/reparacion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  styleUrls: []
})
export class ReparacionComponent implements OnInit {
  reparacionObj: Reparacion;
  regForm: FormGroup;
  url: string;

  constructor(private reparacionService: ReparacionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarReparacion(id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }

    // listen to input reparacion
    this.regForm.get('reparacion').valueChanges.subscribe(val => {
      this.regForm.get('reparacion').setValue(val.toUpperCase(), {
        emitEvent: false
      });
    });
    this.url = '/reparaciones';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      reparacion: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      _id: ['']
    });
  }


  get reparacion() {
    return this.regForm.get('reparacion');
  }
  get costo() {
    return this.regForm.get('costo');
  }
  get _id() {
    return this.regForm.get('_id');
  }

  cargarReparacion(id: string) {
    this.reparacionService.getReparacion(id)
      .subscribe(res => {
        this.reparacionObj = res;
        this.reparacion.setValue(res.reparacion);
        this.costo.setValue(res.costo);
        this._id.setValue(res._id);
      });
  }

  guardarReparacion() {
    if (this.regForm.valid) {
      this.reparacionService.guardarReparacion(this.regForm.value)
        .subscribe(res => {
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/reparaciones/reparacion', this.regForm.get('_id').value]);
          }
          this.regForm.markAsPristine();
        });
    }
  }

  back() {

    if (localStorage.getItem('historyArray')) {

      let history;
      const array = [];
      // Si tengo algo en localStorage en la variable historyArray lo obtengo
      if (localStorage.getItem('historyArray')) {
        // asigno a mi variable history lo que obtengo de localStorage (history)
        history = JSON.parse(localStorage.getItem('historyArray'));

        // realizo este ciclo para asignar los valores del JSON al Array
        // tslint:disable-next-line: forin
        for (const i in history) {
          array.push(history[i]);
        }

        // Asigno a mi variable el valor del ultimo elemento del array para saber a donde regresare.
        // pop() elimina del array el ultimo elemento
        this.url = array.pop();

        // Asigno a localStorage (history) el nuevo JSON 
        localStorage.setItem('historyArray', JSON.stringify(array));
      }

      this.router.navigate([this.url]);
    } else {
      this.open();
    }
  }

  // if (localStorage.getItem('history')) {
  //   this.url = localStorage.getItem('history');
  // }
  // this.router.navigate([this.url]);
  // localStorage.removeItem('history')
  // //this.location.back();

  open() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
  }
}
