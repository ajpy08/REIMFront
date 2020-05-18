import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Maniobra } from 'src/app/models/maniobra.models';
import { ManiobraService } from '../../pages/maniobras/maniobra.service';
import swal from 'sweetalert';

import {
  MAT_DIALOG_DATA
} from '@angular/material/dialog';


@Component({
  selector: 'app-asignar-factura',
  templateUrl: './asignar-factura.component.html',
  styleUrls: ['./asignar-factura.component.css'],
})

export class AsignarFacturaComponent implements OnInit {

  facturaVacios: string;
  ok = false;
  // facturaLavadoVacios: string;
  // facturaReparacionVacios: string;
  selectionVacios = new SelectionModel<Maniobra>(true, []);
  constructor(public dialogRef: MatDialogRef<AsignarFacturaComponent>,
   private maniobraService: ManiobraService,
   @Inject(MAT_DIALOG_DATA) public maniobrasSeleccionadas: any) { }

  ngOnInit() {
    this.selectionVacios = this.maniobrasSeleccionadas;
  }

  close(result: string) {
    this.dialogRef.close(result);
  }

  asignarFacturaVacios() {
    if (this.selectionVacios) {
      if (this.facturaVacios) {
        this.selectionVacios.selected.forEach(maniobra => {
          this.maniobraService.asignaFacturaManiobra(maniobra._id, this.facturaVacios).subscribe((maniobra2) => {
            maniobra.facturaManiobra = this.facturaVacios;
          });
        });
        // this.facturaVacios = "";
        this.close(this.facturaVacios);
      } else {
        swal('No puedes asignar una factura vacía', '', 'error');
      }
    } else {
      swal('Debes seleccionar por lo menos un elemento para asignar una factura', '', 'error');
    }
  }

}
