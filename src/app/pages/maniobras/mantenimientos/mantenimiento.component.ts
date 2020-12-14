
import { Component, OnInit, Inject } from '@angular/core';
import { TIPOS_LAVADO_ARRAY, TIPOS_MANTENIMIENTO_ARRAY } from '../../../config/config';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../usuarios/usuario.model';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { Mantenimiento } from './mantenimiento.models';
import { MantenimientoService,MaterialService } from "../../../services/service.index";
import { Material } from '../../materiales/material.models';
import * as _moment from 'moment';


const moment = _moment;

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
  listaMateriales: Material[];

  mantenimientoAgregar = new SelectionModel<Mantenimiento>(true, []);

  constructor(
    public dialogRef: MatDialogRef<MantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _mantenimientoService: MantenimientoService,
    public _materialService: MaterialService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {

    this.mantenimiento = this.data;
    this._materialService.getMateriales(null, true).subscribe(materiales => {
      this.listaMateriales = materiales.materiales;
    });

    this.createFormGroup();
    if (this.mantenimiento._id !== 'nuevo') {
      this.cargarRegistro(this.mantenimiento);
    } else {
      for (const control in this.regForm.controls) {
        if (control.toString()!== "fechas" && control.toString()!=="materiales")
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }

  }

  createFormGroup() {
    this.regForm = this.fb.group({
      tipoMantenimiento: ['',[Validators.required]],
      tipoLavado: [{value:'B',disabled: true}, [Validators.required]],
      cambioGrado: [{value:false,disabled: true}],
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
      finalizado: [false],
      _id: [''],
      maniobra: ['']
    });
  }

  cargarRegistro(mantenimiento: Mantenimiento) {
    this._mantenimientoService.getMantenimiento(mantenimiento._id).subscribe(res => {
      this.mantenimiento = res.mantenimiento;
      this.mantenimiento.maniobra=mantenimiento.maniobra;
     for (const propiedad in this.mantenimiento) 
        for (const control in this.regForm.controls) 
          if (propiedad === control.toString()) {         
            if (propiedad=="fechas")
            res.mantenimiento[propiedad].forEach((x: { fIni: _moment.Moment; hIni: string; fFin: string; hFin: string; })=> this.addFecha(x.fIni,x.hIni,x.fFin,x.hFin));
            else{
              if (propiedad=="materiales"){
                res.mantenimiento[propiedad].forEach((x: any) => {this.addMaterial(x.material,x.descripcion,x.costo.$numberDecimal,x.precio.$numberDecimal,x.cantidad)});
              }
              else{
              this.regForm.controls[propiedad].enable({ onlySelf: true });
              this.regForm.controls[propiedad].setValue(res.mantenimiento[propiedad]);
              }
            }
              

          }
    });
  }


  get tipoMantenimiento() {
    return this.regForm.get('tipoMantenimiento');
  }

  get tipoLavado() {
    return this.regForm.get('tipoLavado');
  }

  get cambioGrado() {
    return this.regForm.get('cambioGrado');
  }  
  get observacionesGenerales() {
    return this.regForm.get('observacionesGenerales');
  }
  get izquierdo() {
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
  get finalizado() {
    return this.regForm.get('finalizado');
  }
  get _id() {
    return this.regForm.get('_id');
  }
  get maniobra() {
    return this.regForm.get('maniobra');
  }
  
  newFecha(fIni=moment().startOf('day'),hIni='', fFin='', hFin=''): FormGroup {
    return this.fb.group({
      fIni: fIni,
      hIni: hIni,
      fFin: fFin,
      hFin: hFin
    })
  }
 
 addFecha(fIni=moment().startOf('day'),hIni='', fFin='', hFin='') {
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
    cantidad: [cantidad, [this.checaStock(material)]]
  })
}

checaStock(id) {
  return (control: AbstractControl): { [s: string]: any  | null} => {
    console.log(this.materiales);
    // control.parent es el FormGroup
    if (this.regForm) { // en las primeras llamadas control.parent es undefined
      this._materialService.getStockMaterial(id).subscribe(res=>{
        if (res>control.value) {
          console.log("si paso");
          return {
            checaStock: true
          };
        }
        else
          return null;
      });
    }
    return null;
  };
}




addMaterial(material='',descripcion='',costo=0, precio=0, cantidad=1) {
  this.materiales.push(this.newMaterial(material,descripcion,costo, precio, cantidad));
}

addMaterial2(id:String) {
  const rep = this.listaMateriales.find(x => x._id === id);
  console.log(rep);
  this.materiales.push(this.newMaterial(rep._id,rep.descripcion,rep.costo.$numberDecimal,rep.precio.$numberDecimal, 1));
}

removeMaterial(i:number) {
this.materiales.removeAt(i);
}

guardarRegistro() {
  this.regForm.controls["maniobra"].setValue( this.mantenimiento.maniobra);
  if (this.regForm.valid) {
    this._mantenimientoService.guardarMantenimiento(this.regForm.value).subscribe(res => {
        this.regForm.get('_id').setValue(res._id);
      this.regForm.markAsPristine();
    });
    this.close(this.regForm.value);
  };
}

  

  
onChangeTipoMantenimiento(event: { value: string; }) {
    if (event.value==='LAVADO') {
      if (this.tipoLavado.value==='' || this.tipoLavado.value===undefined)
        this.regForm.controls["tipoLavado"].setValue("B");
      this.tipoLavado.enable({ onlySelf: true });
      
    } else {
      this.tipoLavado.disable({ onlySelf: true });
    }
    if (event.value==="ACONDICIONAMIENTO") {

      if (this.cambioGrado.value===undefined)
        this.regForm.controls["cambioGrado"].setValue(false);
      this.cambioGrado.enable({ onlySelf: true });
    } else {
      this.cambioGrado.disable({ onlySelf: true });
    }
  }

  ponHora(event: any) {
    console.log(event);
    // if (this.hIni.value === undefined || this.hIni.value === '') {
    //   this.hIni.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    // }
  }
  // ponHoraFin() {
  //   if (this.hFin.value === undefined || this.hFin.value === '') {
  //     this.hFin.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
  //   }
  // }

  close(result: any) {
    this.dialogRef.close(result);
  }
  
}
