import { Component, OnInit, Inject } from '@angular/core';
import { TIPOS_LAVADO_ARRAY, TIPOS_EVENTO_ARRAY } from '../../../config/config';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../usuarios/usuario.model';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Evento } from './evento.models';
import { ManiobraService } from "../maniobra.service";


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
  selector: 'app-evento',
  templateUrl: './evento.component.html',
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
export class EventoComponent implements OnInit {
  usuarioLogueado = new Usuario;
  regForm: FormGroup;
  url: string;
  act = true;
  evento: Evento = new Evento();
  tiposLavado = TIPOS_LAVADO_ARRAY;
  tiposEvento = TIPOS_EVENTO_ARRAY;
  
  eventoAgregar = new SelectionModel<Evento>(true, []);

  constructor(
    public dialogRef: MatDialogRef<EventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {

    this.evento = this.data;
    this.createFormGroup();
    if (this.evento._id !== 'nuevo') {
      this.cargarRegistro(this.evento);
    } else {
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      tipoEvento: ['',[Validators.required]],
      tipoLavado: ['',[Validators.required]],
      observaciones: [''],
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
      _idManiobra: ['']
    });
  }

  cargarRegistro(evento: Evento) {
    this._maniobraService.getEvento(evento._idManiobra,evento._id).subscribe(res => {
      this.evento = res.evento;
      this.evento._idManiobra=evento._idManiobra;
      console.log(this.evento);
     for (const propiedad in this.evento) 
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
    return this.regForm.get('tipoEvento');
  }

  get tipoLavado() {
    return this.regForm.get('tipoLavado');
  }
  get observaciones() {
    return this.regForm.get('observaciones');
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
  get _idManiobra() {
    return this.regForm.get('_idManiobra');
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
    this._idManiobra.setValue( this.evento._idManiobra);
    if (this.regForm.valid) {
      if ( this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined )
      this._maniobraService.addEvento(this.regForm.value).subscribe(res => {
          this.regForm.get('_id').setValue(res._id);
         
        this.regForm.markAsPristine();
      });
      else
      this._maniobraService.editaEvento(this.regForm.value).subscribe(res => {
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
