
import { Component, OnInit, Inject } from '@angular/core';
import { GRADOS_CONTENEDOR_ARRAY } from '../../config/config';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuarios/usuario.model';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ManiobraService, UsuarioService } from "../../services/service.index";
import { Maniobra } from '../../models/maniobra.models';
import { ROLES } from 'src/app/config/config';
declare var swal: any;


@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html'
})
export class GradoComponent implements OnInit {

  usuarioLogueado = new Usuario;
  url: string;
  maniobra: Maniobra = new Maniobra();
  grados = GRADOS_CONTENEDOR_ARRAY;

  constructor(
    public dialogRef: MatDialogRef<GradoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuarioService,
    private _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    
  ) {   
  }

  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;
    // if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) this.mostrarInfoAdmin = true;
    console.log(this.data);
    this.maniobra._id = this.data;
    this.cargarRegistro(this.maniobra._id);
   }

  

  cargarRegistro(idManiobra: string) {
    this._maniobraService.getManiobra(idManiobra).subscribe(res => {
      this.maniobra = res.maniobra;
      
    });
  }




  saveMaterial(i: number) {
    // const material: any = {
    //   _id: this.materiales.controls[i].get("_id").value,
    //   material: this.materiales.controls[i].get("material").value,
    //   descripcion: this.materiales.controls[i].get("descripcion").value,
    //   costo: this.materiales.controls[i].get("costo").value,
    //   precio: this.materiales.controls[i].get("precio").value,
    //   cantidad: this.materiales.controls[i].get("cantidad").value,
    //   unidadMedida: this.materiales.controls[i].get("unidadMedida").value,
    // };
    // this._mantenimientoService.guardaMaterial(this.mantenimiento._id, material).subscribe(res => {
    //   console.log(res);
      
    // });

  }

  

  salir() {
    this.close(undefined);
    

  }
  close(result: any) {
    this.dialogRef.close(result);
  }






  

}
