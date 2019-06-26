import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
   // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:typedef-whitespace
  agencias: Agencia[] = [];
  agencia: Agencia = new Agencia();


  constructor(public _usuarioService: UsuarioService,
    public _agenciaService: AgenciaService,
    public _modalUploadSevice: ModalUploadService) {
     }

  ngOnInit() {
    this._agenciaService.cargarAgencias()
    .subscribe( agencias => this.agencias = agencias );
    this.cargarUsuarios();
    this._modalUploadSevice.notification
    .subscribe(resp => this.cargarUsuarios());
  }

  mostarModal(id: string) {
    this._modalUploadSevice.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
    .subscribe((resp: any) => {
      console.log(resp.usuarios);
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
     // console.log(this.totalRegistros);
    });


  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    // console.log(desde);
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuarios(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino)
    .subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;

    });
  }

  borrarUsuario(usuario: Usuario) {
    // console.log(usuario);
    if (usuario._id === this._usuarioService.usuario._id) {
    swal('Error!', 'No se puede borrar a si mismo' , 'error');
    return;
    }
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      })
      .then(borrar => {
        if (borrar) {
          this._usuarioService.borrarUsuario(usuario._id)
          .subscribe(borrado => {
          //  console.log(borrado);
            this.cargarUsuarios();
          });

        }
      });

  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
    .subscribe(resp => {
      this.cargarUsuarios();
    });

  }

}
