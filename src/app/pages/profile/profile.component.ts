import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente.models';
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  
  regForm: FormGroup;
  fileFoto: File = null;
  fotoTemporal = false;
  listaEmpresas: Cliente[] = [];

  constructor(public _usuarioService: UsuarioService,private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.createFormGroup();
    this.cargarUsuario (this._usuarioService.usuario._id)
    
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      img: [''],
      _id: ['']
    });
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

  cargarUsuario( id: string ) {
    this._usuarioService.getUsuarioConIncludes( id ).subscribe(usuario => {
      this.nombre.setValue(usuario.nombre);
      this.email.setValue(usuario.email);
      this.img.setValue(usuario.img);
      this.listaEmpresas = usuario.empresas;
      this._id.setValue(usuario._id);
    });
  }

  onFileSelected(event) {
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
  
  guardarUsuario() {
    if (this.regForm.valid) {
      this._usuarioService.actualizaPerfil( this.regForm.value )
      .subscribe( usuario => {
        this.fileFoto = null;
        this.fotoTemporal = false;
        this.regForm.markAsPristine();
      });
    }
  }

  verClientes(usuario: Usuario) {
    console.log(usuario);
  }
}
