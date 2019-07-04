import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/cliente/cliente.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: []
})
export class UsuarioComponent implements OnInit {
  usuario: Usuario = new Usuario();
  empresas: Cliente[] = [];
  empresa: Cliente = new Cliente('');
  fileFoto: File=null;
  fotoTemporal: boolean=false;
  

  constructor(
    public _usuarioService: UsuarioService,
    public _clienteService: ClienteService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      // tslint:disable-next-line:prefer-const
      let id = params['id'];
      if (id !== 'nuevo') {
        this.cargarUsuario(id);
      }
    });
    
   }

   onFileSelected(event){
     console.log(event);
     this.fileFoto = <File> event.target.files[0];
     this.subirFoto();
   }
   
   subirFoto(){
         this._usuarioService.subirFotoTemporal(this.fileFoto)
         .subscribe( nombreArchivo => {
          this.usuario.img = nombreArchivo;
          this.fotoTemporal = true;
     });
   }

   ngOnInit() {
  }

  cargarUsuario( id: string ) {
    this._usuarioService.cargarUsuario(id)
    .subscribe(usuario => {
      this.usuario = usuario;
      this._clienteService.cargarClientesRole( this.usuario.role )
        .subscribe( empresas => this.empresas = empresas );
    });
  }

  cambioRole( role: string ) {
      this._clienteService.cargarClientesRole( role )
        .subscribe( empresas => this.empresas = empresas );
   }

  guardarUsuario( f: NgForm ) {
    //console.log( f.valid );
    //console.log( f.value );
    if ( f.invalid ) {
      return;
    }
    this._usuarioService.guardarUsuario( this.usuario )
            .subscribe( usuario => {
              
              this.fileFoto=null;
              this.fotoTemporal=false;
              console.log(usuario);
              if (this.usuario._id==="undefined")
              {
                this.usuario._id = usuario._id;
                this.router.navigate(['/usuarios', this.usuario._id]);
              }
            });
  }

}