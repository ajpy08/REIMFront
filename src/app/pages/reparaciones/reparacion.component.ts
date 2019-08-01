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
  edicion = false;

  constructor(private reparacionService: ReparacionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarReparacion(id);
    } else {
      for (var control in this.regForm.controls){
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      costo: [''],
      _id: ['']
    });
  }

  cargarReparacion(id: string) {
    this.reparacionService.getReparacion(id)
      .subscribe(res => {
        this.reparacion = res;
        //console.log( this.buque );
        for (var propiedad in this.reparacion) {
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

  guardarReparacion() {
    if (this.regForm.valid) {
      //console.log(this.regForm.value);
      this.reparacionService.guardarReparacion(this.regForm.value)
        .subscribe(res => {
          // this.fileImg = null;
          // this.fileImgTemporal = false;
          // this.file = null;
          // this.fileTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/reparacion', this.regForm.get('_id').value]);
            this.edicion = true;
          }
          this.regForm.markAsPristine();
        });
    }
  }


  get descripcion() {
    return this.regForm.get('descripcion');
  }

  get costo() {
    return this.regForm.get('costo');
  }

}
