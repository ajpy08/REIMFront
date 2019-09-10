import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario.model';
import { Cliente } from 'src/app/models/cliente.models';
import { ClienteService } from '../../services/cliente/cliente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;
  clientes: Cliente[] = [];
  cliente: Cliente = new Cliente('');

  constructor(
    public _usuarioService: UsuarioService,
    public _clienteService: ClienteService,
    public router: Router
  ) { }

  sonIguales( campo1: string, campo2: string ) {

    return ( group: FormGroup ) => {

      // tslint:disable-next-line:prefer-const
      let pass1 = group.controls[campo1].value;
      // tslint:disable-next-line:prefer-const
      let pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        sonIguales: true
      };

    };

  }


  ngOnInit() {

      this.forma = new FormGroup({
        nombre: new FormControl(null, Validators.required ),
        email: new FormControl(null, [Validators.required, Validators.email] ),
        password: new FormControl(null, Validators.required ),
        password2: new FormControl(null, Validators.required ),
        role: new FormControl(null, Validators.required ),
        empresas: new FormControl(null, Validators.required)
      }, { validators: this.sonIguales( 'password', 'password2' )  } );


      this.forma.setValue({
        nombre: 'Test',
        email: 'test@test.com',
        password: '123456',
        password2: '123456',
        role: 'ADMIN_ROLE',
        empresas: '5bfecd483965fc0b7058ceae'
      });

  }


  registrarUsuario() {

    if ( this.forma.invalid ) {
      return;
    }


    // tslint:disable-next-line:prefer-const
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password,
      this.forma.value.role,
      this.forma.value.empresas
    );
console.log(usuario);
    this._usuarioService.altaUsuario( usuario )
              .subscribe( resp => this.forma.reset());


  }

  cambioRole( role: string ) {
    console.log(role);
     this._clienteService.getClientesRole( role )
       .subscribe( clientes => this.clientes = clientes );

  }

}
