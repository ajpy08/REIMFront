import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { Cliente } from '../../models/cliente.models';
import { ClienteService, SubirArchivoService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ROLES_ARRAY, PERMISOS } from '../../config/config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {
  regForm: FormGroup;
  listaEmpresas: Cliente[] = [];
  fileFoto: File = null;
  fotoTemporal = false;
  roles = ROLES_ARRAY;
  per = PERMISOS;
  url: string;
  seleccionados: string;
  verSeleccion = '';

  constructor(
    private _usuarioService: UsuarioService,
    private _clienteService: ClienteService,
    private _subirArchivoService: SubirArchivoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarUsuario(id);
    }
    this.url = '/usuarios';

  }


  createFormGroup() {
    this.regForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordConfirm: ['', [Validators.required, this.match('password')]],
      role: ['', [Validators.required]],
      empresas: [''],
      permiso: [''],
      activo: [''],
      observaciones: [''],
      img: [''],
      _id: ['']
    });
  }

  match(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      // control.parent es el FormGroup
      if (this.regForm) { // en las primeras llamadas control.parent es undefined
        const checkValue = this.regForm.controls[controlKey].value;
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
  get password() {
    return this.regForm.get('password');
  }
  get passwordConfirm() {
    return this.regForm.get('passwordConfirm');
  }
  get img() {
    return this.regForm.get('img');
  }
  get role() {
    return this.regForm.get('role');
  }

  get permiso() {
    return this.regForm.get('permiso');
  }
  get empresas() {
    return this.regForm.get('empresas');
  }

  get activo() {
    return this.regForm.get('activo');
  }
  get observaciones() {
    return this.regForm.get('observaciones');
  }

  get _id() {
    return this.regForm.get('_id');
  }


  cargarUsuario(id: string) {
    this._usuarioService.getUsuario(id).subscribe(usuario => {
      this._clienteService.getClientesRole(usuario.role).subscribe(empresas => this.listaEmpresas = empresas);
      this.nombre.setValue(usuario.nombre);
      this.email.setValue(usuario.email);
      this.password.disable();
      this.passwordConfirm.disable();
      this.role.setValue(usuario.role);
      this.role.disable();
      this.empresas.setValue(usuario.empresas);
      this.observaciones.setValue(usuario.observaciones);
      this.img.setValue(usuario.img);
      this._id.setValue(usuario._id);
      this.permiso.setValue(usuario.permiso);

    });
  }

  cambioRole(role: string) {
    this._clienteService.getClientesRole(role)
      .subscribe(empresas => this.listaEmpresas = empresas);
  }

  onFileSelected(event) {
    this.fileFoto = <File>event.target.files[0];
    this.subirFoto();
  }

  subirFoto() {
    this._subirArchivoService.subirArchivoBucketTemporal(this.fileFoto)
      .subscribe(nombreArchivo => {
        this.regForm.get('img').setValue(nombreArchivo);
        this.regForm.get('img').markAsDirty();
        this.fotoTemporal = true;
        this.guardarUsuario();
      });
  }

  guardarUsuario() {
    if (this.regForm.valid) {
      this._usuarioService.guardarUsuario(this.regForm.value)
        .subscribe(usuario => {
          this.fileFoto = null;
          this.fotoTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(usuario._id);
            this.password.disable();
            this.passwordConfirm.disable();
            this.role.disable();
            this.router.navigate(['/usuarios/usuario', this.regForm.get('_id').value]);
          }
          this.regForm.markAsPristine();
        });
    }
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
    // this.location.back();
  }
}
