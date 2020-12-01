import { Material } from './../materiales/material.models';
import { DetalleMaterial } from './detalleMaterial.models';
import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from 'src/app/pages/usuarios/usuario.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MAT_DIALOG_DATA, MatDialogConfig, MatDialog
} from '@angular/material/dialog';
import { MaterialService } from '../materiales/material.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  usuarioLogueado = new Usuario;
  // detalle: DetalleMaterial = new DetalleMaterial();
  regForm: FormGroup;
  url: string;
  act = true;
  // socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  formasPago = [];
  idSelect;
  indiceSelect;
  ObjetoSelect = [];
  infoAd = '';
  materiales: Material[] = [];

  detalle;
  // facturasAComplementar = new SelectionModel<CFDI>(true, []);
  constructor(
    public dialogRef: MatDialogRef<DetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public matDialog: MatDialog,
    public materialService: MaterialService
  ) { }

  ngOnInit() {
    if (this.data.selected.length > 0) {
      this.detalle = this.data.selected[0].detalle;
    }

    this.materialService.getMateriales().subscribe(materiales => {
      this.materiales = materiales.materiales;
    });

    this.createFormGroup();

    if (this.detalle) {
      this.cargarPago(this.detalle);
    }

    // this.socket.on('update-buque', function (data: any) {
    //   if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
    //     if (data.data._id) {
    //       this.createFormGroup();
    //       this.cargarBuque(data.data._id);
    //       if (data.data.usuarioMod !== this.usuarioLogueado._id) {
    //         swal({
    //           title: 'Actualizado',
    //           text: 'Otro usuario ha actualizado este buque',
    //           icon: 'info'
    //         });
    //       }
    //     }
    //     // } else {
    //     //   this.cargarBuque(id);
    //   }
    // }.bind(this));

    // this.socket.on('delete-buque', function (data: any) {
    //   if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
    //     this.router.navigate(['/pagos']);
    //     swal({
    //       title: 'Eliminado',
    //       text: 'Se elimino este buque por otro usuario',
    //       icon: 'warning'
    //     });
    //   }
    // }.bind(this));
  }

  cargarPago(detalle: DetalleMaterial) {
    // tslint:disable-next-line: forin
    for (const propiedad in this.detalle) {
      for (const control in this.regForm.controls) {
        if (propiedad === control.toString()) {
          this.regForm.controls[propiedad].setValue(detalle[propiedad]);
        }
      }
    }
    // this.material.setValue(detalle.material);
    // this.cantidad.setValue(detalle.cantidad);
    // this.costo.setValue(detalle.costo);
  }

  compareObjects(o1: any, o2: any) {
    if (o1.descripcion == o2.descripcion)
      return true;
    else return false
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      material: [new Material('test', 'test', 0, true, '', '', '', '', ''), [Validators.required]],
      cantidad: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      entrada: [''],
    });
  }

  agregarDetalle() {
    if (this.regForm.valid) {
      const detalle = new DetalleMaterial();
      detalle._id = this._id.value;
      detalle.material = this.material.value;
      detalle.cantidad = this.cantidad.value;
      detalle.costo = this.costo.value;
      detalle.entrada = this.entrada.value;
      this.save(detalle);
    }
  }

  save(result) {
    this.dialogRef.close(result);
    // if (this.detalle._id) {
      
    // } else {
    //   this.dialogRef.close(result);
    // }
  }

  close() {
    this.dialogRef.close();
  }

  /* #region  Properties */

  get _id() {
    return this.regForm.get('_id');
  }

  get material() {
    return this.regForm.get('material');
  }

  get cantidad() {
    return this.regForm.get('cantidad');
  }

  get costo() {
    return this.regForm.get('costo');
  }

  get entrada() {
    return this.regForm.get('entrada');
  }
  /* #endregion */

}
