import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { FormGroup, FormBuilder,  Validators,AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-resetPass',
  templateUrl: './resetPass.component.html',
  styles: []
})
export class UsuarioResetPassComponent implements OnInit {
  regForm: FormGroup;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarUsuario( id );
  }
  
  createFormGroup() {
    this.regForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required]],
      passwordConfirm: ['',[Validators.required,this.match('password')]],
      role: ['', [Validators.required]],
      empresas: [''],
      img: [''],
      _id: ['']
    })
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


  
cargarUsuario( id: string ){
  this._usuarioService.getUsuarioxID(id).subscribe(usuario => {
    this.regForm.controls["nombre"].setValue(usuario.nombre);
    this.regForm.controls["email"].setValue(usuario.email);
    this.regForm.controls["role"].setValue(usuario.role);
    this.regForm.controls["img"].setValue(usuario.img);
    this.regForm.controls["_id"].setValue(usuario._id);
  });
}


resetPass() {
  if (this.regForm.valid)
  {
    this._usuarioService.resetPass( this.regForm.value )
              .subscribe( usuario => {
                if (this.regForm.get('_id').value==="")
                {
                  this.regForm.get('_id').setValue(usuario._id);
                  this.router.navigate(['/usuarios',this.regForm.get('_id').value ]);
                }
                this.regForm.markAsPristine();
              });
  }
}
}