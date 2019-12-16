import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, RequiredValidator, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { ROLES, ROLES_ARRAY } from '../config/config';
import { RegistroServiceService } from './registro.service';
import { resolve } from 'url';
import { reject } from 'q';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  regForm: FormGroup
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
    this.createFormGroup();
    this.datosPersonales.removeAt(0);
    this.correoFacturacion.removeAt(0);
    this.correoOperativo.removeAt(0);
  }


  guardarRegistro() {
    if(this.regForm.valid) {
      this.registroService.guardarRegistro(this.regForm.value).subscribe(res =>{

        this.regForm.markAsPristine();
      })
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      role: ['', [Validators.required]],
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      rfc: ['', [Validators.required, Validators.minLength(12)]],
      direccionFiscal: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      correotem: ['', [ Validators.required, Validators.email],this.cheketeEmail],
      correotem2: ['', [Validators.required, Validators.email], this.cheketeEmail],
      correotem3: ['', [Validators.required, Validators.email], this.cheketeEmail],
      datosPersonales: this.fb.array([this.agregarArray('', '')]),
      correoFacturacion: this.fb.array([this.agregarArray2('')]),
      correoOperativo: this.fb.array([this.agregarArray3('')])
    });
  }

cheketeEmail(Control: AbstractControl){
  return new Promise ((resolve, reject) =>{
    setTimeout(() =>{
      if (Control.value === '@'){
        resolve({emailIsTaken: true })
      } else {
        resolve(null)}
    })
  });
}

  agregarArray(correo: string, nombre: string): FormGroup {
    return this.fb.group({
      correo: [correo],
      nombre: [nombre]
    })
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
    if (correo === '' && nombre === '') {
      swal('Error al Agregar', 'Los Campos Correo y Nombre no pueden estar Vacios.');
    } else if (correo === '') {
      swal('Error al Agregar', 'El campo Correo no puede estar Vacio');
    } else if (nombre === '') {
      swal('Error al Agregar', 'El campo Nombre no puede estar Vacio.')
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
      this.correoOperativo.disable({emitEvent: true})
      swal('Error al Agregar', 'El campo Correo no puede estar Vacio');
    } else {
      this.correoOperativo.push(this.agregarArray3(correoO));
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

  get correotem(){
    return this.regForm.get('correotem');
  }
  get correotem2(){
    return this.regForm.get('correotem2');
  }
  get correotem3(){
    return this.regForm.get('correotem3');
  }
  get codigo() {
    return this.regForm.get('codigo');
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
