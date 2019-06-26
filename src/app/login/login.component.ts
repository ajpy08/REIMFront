import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Usuario } from '../models/usuarios.model';
import { UsuarioService } from '../services/usuario/usuario.service';


declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  // tslint:disable-next-line:no-inferrable-types
  recuerdame: boolean = false;

  constructor( public router: Router, public _usuarioService: UsuarioService ) { }

  ngOnInit() {
  init_plugins();
  this.email = localStorage.getItem('email') || '';
  if (this.email.length > 1) {
    this.recuerdame = true;
  }
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let usuario = new Usuario(null, forma.value.email, forma.value.password);
    this._usuarioService.login(usuario, forma.value.recuerdame)
    .subscribe(correcto => this.router.navigate(['/dashboard']));
    // this.router.navigate([ '/dashboard' ]);
  }
}
