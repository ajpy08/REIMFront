import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Maniobra } from '../../models/maniobra.models';
import { ManiobraService } from '../../services/service.index';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';
import { Camion } from '../../models/camion.models';
import { CamionService } from '../../services/service.index';

import { Viaje } from '../viajes/viaje.models';
import { ViajeService } from '../../services/service.index';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';

import { Router, ActivatedRoute } from '@angular/router';
import { ModalDropzoneService } from '../../components/modal-dropzone/modal-dropzone.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-llegada',
  templateUrl: './llegada.component.html',
})


export class LlegadaComponent implements OnInit {
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  regForm: FormGroup;
  maniobra: Maniobra;



  constructor(
    public _maniobraService: ManiobraService,
    public _operadorService: OperadorService,
    public _camionService: CamionService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }


  ngOnInit() {
    this._transportistaService.getTransportistas().subscribe( transportistas => this.transportistas = transportistas.transportistas );
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.maniobra = new Maniobra('', '', '', '', '', '', '', '', '', '' , '', '', '', null, '', '', '', null, null, '', null, '');
    this.createFormGroup();
    this.cargarManiobra( id );
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      transportista: [''],
      camion: [''],
      operador: [''],
      fLlegada: [''],
      hLlegada: [''],
    });
  }

  cargarManiobra( id: string) {
    this._maniobraService.getManiobra( id ).subscribe( maniob => {
      this.maniobra = maniob;
      this.regForm.controls['_id'].setValue(maniob._id);
      this.regForm.controls['transportista'].setValue(maniob.transportista);
      this.regForm.controls['camion'].setValue(maniob.camion);
      this.regForm.controls['operador'].setValue(maniob.operador);
    });
  }


}
