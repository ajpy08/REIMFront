import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: any;
  profile: Usuario = new Usuario('');

  constructor(public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    this.usuario.email = usuario.email;

    this._usuarioService.actualizarUsuario(this.usuario)
    .subscribe();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      swal('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;

    }
       this.imagenSubir = archivo;
       // tslint:disable-next-line:prefer-const
       let reader = new FileReader();
       // tslint:disable-next-line:prefer-const
       let urlImagenTemp = reader.readAsDataURL(archivo);
       reader.onloadend = () => this.imagenTemp = reader.result;
  }


  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

  verClientes(usuario: Usuario) {
    console.log(usuario);
  }
}
