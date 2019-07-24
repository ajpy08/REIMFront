import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/cliente/cliente.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {
  regForm: FormGroup;
  empresas: Cliente[] = [];
  fileFoto: File = null;
  fotoTemporal = false;
  edicion = false;
  constructor(
    public _usuarioService: UsuarioService,
    public _clienteService: ClienteService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarUsuario( id );
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [ Validators.required, this.match('password')]],
      role: ['', [Validators.required]],
      empresas: [''],
      img: [''],
      _id: ['']
    });
  }

  match(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      // control.parent es el FormGroup
      if ( this.regForm ) { // en las primeras llamadas control.parent es undefined
        const checkValue =  this.regForm.controls[controlKey].value;
        if (control.value !== checkValue) {
          return {
            match: true
          };
        }
      }
      return null;
    };
  }

  get nombre() {
    return this.regForm.get('nombre');
  }
  get email() {
    return this.regForm.get('email');
  }
  get img() {
    return this.regForm.get('img');
  }
  get _id() {
    return this.regForm.get('_id');
  }
  get password() {
    return this.regForm.get('password');
  }
  get passwordConfirm() {
    return this.regForm.get('passwordConfirm');
  }

cargarUsuario( id: string ) {
  this._usuarioService.getUsuarioxID(id).subscribe(usuario => {
    this._clienteService.getClientesRole( usuario.role ).subscribe( empresas => this.empresas = empresas );
    this.regForm.controls['nombre'].setValue(usuario.nombre);
    this.regForm.controls['email'].setValue(usuario.email);
    this.regForm.controls['password'].setValue(usuario.password);
    this.regForm.controls['passwordConfirm'].setValue(usuario.password);
    this.regForm.controls['role'].setValue(usuario.role);
    this.regForm.controls['role'].disable();
    this.regForm.controls['empresas'].setValue(usuario.empresas);
    this.regForm.controls['img'].setValue(usuario.img);
    this.regForm.controls['_id'].setValue(usuario._id);
  });
}


cambioRole( role: string ) {
  console.log(role)
  this._clienteService.getClientesRole(role)
    .subscribe( empresas => this.empresas = empresas );  
    
    console.log(this.empresas)
}

guardarUsuario() {
  //console.log(this.regForm.value);
  if (this.regForm.valid) {
    this._usuarioService.guardarUsuario( this.regForm.value )
              .subscribe( usuario => {
                this.fileFoto = null;
                this.fotoTemporal = false;
                if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
                  this.regForm.get('_id').setValue(usuario._id);
                  this.router.navigate(['/usuarios', this.regForm.get('_id').value ]);
                  this.edicion = true;
                }
                this.regForm.markAsPristine();
              });
  }
}

onFileSelected(event) {
  //console.log(event);
  this.fileFoto = <File> event.target.files[0];
  this.subirFoto();
}

subirFoto() {
      this._usuarioService.subirFotoTemporal(this.fileFoto)
      .subscribe( nombreArchivo => {
        this.regForm.get('img').setValue(nombreArchivo);
        this.regForm.get('img').markAsDirty();
        this.fotoTemporal = true;
        this.guardarUsuario();
  });
}
}
