
import { Component, OnInit, Inject } from '@angular/core';
import { TIPOS_LAVADO_ARRAY, TIPOS_MANTENIMIENTO_ARRAY } from '../../../config/config';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../usuarios/usuario.model';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { Mantenimiento } from './mantenimiento.models';
import { MantenimientoService } from "../../../services/service.index";



export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L']
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styles: [],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }
  ]
})
export class MantenimientoComponent implements OnInit {
  usuarioLogueado = new Usuario;
  regForm: FormGroup;
  url: string;
  act = true;
  mantenimiento: Mantenimiento = new Mantenimiento();
  tiposLavado = TIPOS_LAVADO_ARRAY;
  tiposMantenimiento = TIPOS_MANTENIMIENTO_ARRAY;
  
  mantenimientoAgregar = new SelectionModel<Mantenimiento>(true, []);

  constructor(
    public dialogRef: MatDialogRef<MantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _mantenimientoService: MantenimientoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {

    this.mantenimiento = this.data;
    this.createFormGroup();
    if (this.mantenimiento._id !== 'nuevo') {
      this.cargarRegistro(this.mantenimiento);
    } else {
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      tipoMantenimiento: ['',[Validators.required]],
      tipoLavado: ['',[Validators.required]],
      observacionesGenerales: [''],
      izquierdo: [''],
      derecho: [''],
      frente: [''],
      posterior: [''],
      techo: [''],
      piso: [''],
      interior: [''],
      puerta: [''],
      fechas: this.fb.array([]),
      materiales: this.fb.array([]),
      _id: [''],
      Maniobra: ['']
    });
  }

  cargarRegistro(mantenimiento: Mantenimiento) {
    this._mantenimientoService.getMantenimiento(mantenimiento._id).subscribe(res => {
      this.mantenimiento = res.mantenimiento;
      this.mantenimiento.maniobra=mantenimiento.maniobra;
      console.log(this.mantenimiento);
     for (const propiedad in this.mantenimiento) 
        for (const control in this.regForm.controls) 
          if (propiedad === control.toString()) 
          {
            if (propiedad=="fechas")
            res.evento[propiedad].forEach(x=> this.addFecha(x.fIni,x.hIni,x.fFin,x.hFin));
            else
              this.regForm.controls[propiedad].setValue(res.evento[propiedad]);
          }
    });
  }


  get tipoEvento() {
    return this.regForm.get('tipoMantenimiento');
  }

  get tipoLavado() {
    return this.regForm.get('tipoLavado');
  }
  get observaciones() {
    return this.regForm.get('observacionesGenerales');
  }
  get izquiero() {
    return this.regForm.get('izquierdo');
  }
  get derecho() {
    return this.regForm.get('derecho');
  }
  get frente() {
    return this.regForm.get('frente');
  }
  get posterior() {
    return this.regForm.get('posterior');
  }
  get piso() {
    return this.regForm.get('piso');
  }
  get techo() {
    return this.regForm.get('techo');
  }
  
  get interior() {
    return this.regForm.get('interior');
  }
  get puerta() {
    return this.regForm.get('puerta');
  }

  get fechas() : FormArray {
    return this.regForm.get("fechas") as FormArray
  }

  get materiales() : FormArray {
    return this.regForm.get("materiales") as FormArray
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get maniobra() {
    return this.regForm.get('maniobra');
  }
  
  newFecha(fIni='',hIni='', fFin='', hFin=''): FormGroup {
    return this.fb.group({
      fIni: fIni,
      hIni: hIni,
      fFin: fFin,
      hFin: hFin
    })
  }
 
 addFecha(fIni='',hIni='', fFin='', hFin='') {
  this.fechas.push(this.newFecha(fIni,hIni,fFin,hFin));
 }

 removeFecha(i:number) {
  this.fechas.removeAt(i);
 }

 newMaterial(material='',descripcion='',costo=0, precio=0, cantidad=1): FormGroup {
  return this.fb.group({
    material: material,
    descripcion: descripcion,
    costo: costo,
    precio: precio,
    cantidad: cantidad
  })
}

addMaterial(material='',descripcion='',costo=0, precio=0, cantidad=1) {
  this.materiales.push(this.newMaterial(material,descripcion,costo, precio, cantidad));
}

removeMaterial(i:number) {
this.materiales.removeAt(i);
}
  

  guardarRegistro() {
    this.maniobra.setValue( this.mantenimiento.maniobra);
    if (this.regForm.valid) {
      if ( this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined )
      this._mantenimientoService.agregarMantenimiento(this.regForm.value).subscribe(res => {
          this.regForm.get('_id').setValue(res._id);
         
        this.regForm.markAsPristine();
      });
      else
      this._mantenimientoService.modificaMantenimiento(this.regForm.value).subscribe(res => {
        console.log(res);
       
      this.regForm.markAsPristine();
    });
    }
    this.close(this.regForm.value);
  }

  // ponHoraIni() {
  //   if (this.hIni.value === undefined || this.hIni.value === '') {
  //     this.hIni.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
  //   }
  // }
  // ponHoraFin() {
  //   if (this.hFin.value === undefined || this.hFin.value === '') {
  //     this.hFin.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
  //   }
  // }

  close(result) {
    this.dialogRef.close(result);
  }
  
}
