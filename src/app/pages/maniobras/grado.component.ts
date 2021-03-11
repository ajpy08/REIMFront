
import { Component, OnInit, Inject } from '@angular/core';
import { GRADOS_CONTENEDOR_ARRAY } from '../../config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuarios/usuario.model';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ManiobraService, UsuarioService } from "../../services/service.index";
import { Maniobra } from '../../models/maniobra.models';
import { ROLES } from 'src/app/config/config';
@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html'
})

export class GradoComponent implements OnInit {
  usuarioLogueado = new Usuario;
  maniobra: Maniobra = new Maniobra();
  grados = GRADOS_CONTENEDOR_ARRAY;
  grado : string;
  constructor(
    public dialogRef: MatDialogRef<GradoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuarioService,
    private _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {  }
  ngOnInit() {
     this.usuarioLogueado = this._usuarioService.usuario;
    // // if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) this.mostrarInfoAdmin = true;
     this.cargarRegistro(this.data._id);
   }

   cargarRegistro(idManiobra: string) {
    this._maniobraService.getManiobra(idManiobra).subscribe(res => {
      this.maniobra = res.maniobra;
      this.grado = this.maniobra.grado;
    });
  }

  guardarGrado() {
    this._maniobraService.cambiaGrado(this.maniobra._id, this.grado).subscribe(res => {
      this.maniobra.grado = this.grado;
      this.salir();
    });
  }
  salir() {
    this.dialogRef.close(this.maniobra.grado);
  }
  

}
