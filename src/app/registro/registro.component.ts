import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { ROLES, ROLES_ARRAY } from '../config/config';
import { RegistroServiceService } from './registro.service';

declare function init_plugins();


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  regForm: FormGroup
  isEditable = true;
  R = ROLES;
  roles = [
    ROLES_ARRAY[4],
    ROLES_ARRAY[5]
  ];


  constructor(private fb: FormBuilder,
    public router: Router,
    private registroService: RegistroServiceService
  ) { }

  ngOnInit() {
    init_plugins();
    this.createFormGroup();
    this.datosPersonales.removeAt(0);
    this.correoFacturacion.removeAt(0);
    this.correoOperativo.removeAt(0);
  }


  guardarRegistro() {
    if (this.regForm.invalid){
      swal('Error', 'Falta Acompletar datos', 'error');     
    }
    if (this.regForm.valid) {
      this.registroService.guardarRegistro(this.regForm.value).subscribe(res => {

        this.regForm.markAsPristine();
          setTimeout('document.location.reload()',1800)
      })
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      role: ['',],
      razonSocial: ['',  Validators.minLength(5)],
      rfc: ['', [ Validators.minLength(12)]],
      direccionFiscal: ['', ],
      codigo: ['', ],
      correotem: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correotem2: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correotem3: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correo: [''],
      nombre: [''],
      datosPersonales: this.fb.array([this.agregarArray('', '')], { validators: Validators.required }),
      correoFacturacion: this.fb.array([this.agregarArray2('')], { validators: Validators.required }),
      correoOperativo: this.fb.array([this.agregarArray3('')], { validators: Validators.required })
    });
  }

  agregarArray(correo: string, nombre: string): FormGroup {
    return this.fb.group({
      correo: [correo],
      nombre: [nombre]
    });
  }
  agregarArray2(correoF: String): FormGroup {
    return this.fb.group({
      correoF: [correoF]
    })
  }

  agregarArray3(correoO: String): FormGroup {
    return this.fb.group({
      correoO: [correoO]
    })
  }

  salir() {
    this.router.navigate(['/']);
  }


  addContenedor2(correo: string, nombre: string): void {
    if (correo === '') {
      swal('Error al Agregar', 'El campo Correo no puede estar Vacio', 'error');
      this.nombre.get(nombre)
    } if (nombre === '') {
      swal('Error al Agregar', 'El campo Nombre no puede estar Vacio.', 'error')
      this.correo.get(correo)
    } else {
      this.datosPersonales.push(this.agregarArray(correo, nombre));
    }

  }
  addContenedor3(correoF: string): void {
    if (correoF === '') {

      swal('Error al Agregar', 'El campo Correo no puede estar Vacio');
    } else {
      this.correoFacturacion.push(this.agregarArray2(correoF));
    }


  }
  addContenedor4(correoO: string): void {
    if (correoO === '') {
      this.correoOperativo.disable({ emitEvent: true })
      swal('Error al Agregar', 'El campo Correo no puede estar Vacio');
    } else {
      this.correoOperativo.push(this.agregarArray3(correoO));
    }

  }

  quit(control: AbstractControl) {
    if (!control.valid) {
      // this.regForm.controls[control.].setValue(response.body.data.nombres);
      control.setValue('');
    }
  }



  quitar3(indice: number) {
    this.datosPersonales.removeAt(indice);
  }

  quitar(indice: number) {
    this.correoFacturacion.removeAt(indice);
  }
  quitar2(indice: number) {
    this.correoOperativo.removeAt(indice);
  }

  get rfc() {
    return this.regForm.get('rfc');
  }

  get razonSocial() {
    return this.regForm.get('razonSocial');
  }
  get direccionFiscal() {
    return this.regForm.get('direccionFiscal');
  }

  get correotem() {
    return this.regForm.get('correotem');
  }
  get correotem2() {
    return this.regForm.get('correotem2');
  }
  get correotem3() {
    return this.regForm.get('correotem3');
  }
  get codigo() {
    return this.regForm.get('codigo');
  }
  get correo() {
    return this.correo.get('correo');
  }

  get nombre() {
    return this.nombre.get('nombre');
  }

  get datosPersonales() {
    return this.regForm.get('datosPersonales') as FormArray;
  }
  get correoFacturacion() {
    return this.regForm.get('correoFacturacion') as FormArray;
  }
  get correoOperativo() {
    return this.regForm.get('correoOperativo') as FormArray;
  }
  get role() {
    return this.regForm.get('role');
  }

}
