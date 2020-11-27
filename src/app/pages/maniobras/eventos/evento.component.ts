import { Component, OnInit, Inject } from '@angular/core';
import { TIPOS_LAVADO_ARRAY, TIPOS_EVENTO_ARRAY } from '../../../config/config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  cargarRegistro(evento: Evento) {
    this._maniobraService.getEvento(evento._idManiobra,evento._id).subscribe(res => {
      this.evento = res.evento;
      this.evento._idManiobra=evento._idManiobra;
     for (const propiedad in this.evento) 
        for (const control in this.regForm.controls) 
          if (propiedad === control.toString()) 
          {
            
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
  get fIni() {
    return this.regForm.get('fIni');
  }
  get hIni() {
    return this.regForm.get('hIni');
  }
  get fFin() {
    return this.regForm.get('fFin');
  }
  get hFin() {
    return this.regForm.get('hFin');
  }
  get _id() {
    return this.regForm.get('_id');
  }
  get _idManiobra() {
    return this.regForm.get('_idManiobra');
  }
  createFormGroup() {
    this.regForm = this.fb.group({
      tipoEvento: ['',[Validators.required]],
      tipoLavado: ['',[Validators.required]],
      observaciones: [''],
      fIni: [''],
      hIni: [''],
      fFin: [''],
      hFin: [''],
      _id: [''],
      _idManiobra: ['']
    });
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

  ponHoraIni() {
    if (this.hIni.value === undefined || this.hIni.value === '') {
      this.hIni.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }
  ponHoraFin() {
    if (this.hFin.value === undefined || this.hFin.value === '') {
      this.hFin.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }

  close(result) {
    this.dialogRef.close(result);
  }
  
}
