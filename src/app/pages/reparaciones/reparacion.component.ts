import { Component, OnInit } from '@angular/core';
import { Reparacion } from 'src/app/models/reparacion.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReparacionService } from 'src/app/services/reparacion/reparacion.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reparacion',
  templateUrl: './reparacion.component.html',
  styleUrls: []
})
export class ReparacionComponent implements OnInit {
  reparacion: Reparacion;
  regForm: FormGroup;

  constructor(private reparacionService: ReparacionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarReparacion(id);
    } else {
      for (var control in this.regForm.controls){
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }

    // listen to input descripcion
    this.regForm.get('descripcion').valueChanges.subscribe(val => {
      this.regForm.get('descripcion').setValue(val.toUpperCase(), {
        emitEvent: false});
    });

  }

  createFormGroup() {
    this.regForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      _id: ['']
    });
  }

  
  get descripcion() {
    return this.regForm.get('descripcion');
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
        this.descripcion.setValue(res.descripcion);
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
}
