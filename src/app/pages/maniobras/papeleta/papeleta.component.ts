import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService } from '../maniobra.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import * as moment from 'moment';



@Component({
  selector: 'app-papeleta',
  templateUrl: './papeleta.component.html',
  styleUrls: ['./papeleta.component.css']
})
export class PapeletaComponent implements OnInit {
  regForm: FormGroup;
  maniobra = new Maniobra();
  id: string;
  propiedades: [];
  constructor(private activateRoute: ActivatedRoute,
    public router: Router,
    private maniobraService: ManiobraService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.cargarManiobra(this.id);

    if (this.maniobra == undefined) {
      this.router.navigate(['/solicitudes_transportista']);
    }

    this.createFormGroup();
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      folio: ['', [Validators.required]],
      fAsignacionPapeleta: ['', [Validators.required]],
      fExpiracionPapeleta: ['', [Validators.required, this.validaFechaExpiracion('fExpiracionPapeleta')]],
      //fExpiracionPapeleta: ['', [Validators.required]],
      cargaDescarga: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      grado: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      descripcion: [''],
      codigoISO: [''],
      contenedor: ['', [Validators.required]],
      buque: ['', [Validators.required]],
      viaje: ['', [Validators.required]],
      BL: [''],
      cliente: ['', [Validators.required]],
      agencia: ['', [Validators.required]],
      transportista: ['', [Validators.required]],
      operador: ['', [Validators.required]],
      placa: ['', [Validators.required]],
      licencia: ['', [Validators.required]],
      noEconomico: ['', [Validators.required]],
    });
  }


  validaFechaExpiracion(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      // control.parent es el FormGroup
      if (this.regForm) { // en las primeras llamadas control.parent es undefined     
        if (control.value != undefined) {
          var CurrentDate = moment().startOf('day').toISOString();
          var fecha = moment(control.value).endOf('day').toISOString();
          if (fecha <= CurrentDate) {            
            return {
              fechaInvalida: true              
            };
          }
        }
      }
      return {};
    };
  }

  cargarManiobra(id: string) {
    this.maniobraService.getManiobraConIncludes(id).subscribe((maniobra) => {
      this.regForm.controls['_id'].setValue(maniobra.maniobra._id);
      this.regForm.controls['folio'].setValue(maniobra.maniobra.folio);
      this.regForm.controls['fAsignacionPapeleta'].setValue(maniobra.maniobra.fAsignacionPapeleta);
      this.regForm.controls['fExpiracionPapeleta'].setValue(maniobra.maniobra.fExpiracionPapeleta);
      this.regForm.controls['cargaDescarga'].setValue(maniobra.maniobra.cargaDescarga);
      this.regForm.controls['peso'].setValue(maniobra.maniobra.peso);
      this.regForm.controls['grado'].setValue(maniobra.maniobra.grado);
      this.regForm.controls['tipo'].setValue(maniobra.maniobra.tipo);
      this.regForm.controls['descripcion'].setValue(maniobra.maniobra.descripcion);
      this.regForm.controls['codigoISO'].setValue(maniobra.maniobra.codigoISO);
      this.regForm.controls['contenedor'].setValue(maniobra.maniobra.contenedor);
      this.regForm.controls['buque'].setValue(maniobra.maniobra.viaje.buque.nombre);
      this.regForm.controls['viaje'].setValue(maniobra.maniobra.viaje.viaje);
      this.regForm.controls['BL'].setValue(maniobra.maniobra.BL);
      this.regForm.controls['cliente'].setValue(maniobra.maniobra.cliente.nombreComercial);
      this.regForm.controls['agencia'].setValue(maniobra.maniobra.agencia.nombreComercial);
      this.regForm.controls['transportista'].setValue(maniobra.maniobra.transportista.nombreComercial);
      this.regForm.controls['operador'].setValue(maniobra.maniobra.operador.nombre);
      this.regForm.controls['placa'].setValue(maniobra.maniobra.camion.placa);
      this.regForm.controls['licencia'].setValue(maniobra.maniobra.operador.licencia);
      this.regForm.controls['noEconomico'].setValue(maniobra.maniobra.camion.noEconomico);

      if (maniobra.maniobra.cargaDescarga === 'C') {
        this.regForm.controls['contenedor'].clearValidators();
        this.regForm.controls['contenedor'].updateValueAndValidity();
        this.regForm.controls['buque'].clearValidators();
        this.regForm.controls['buque'].updateValueAndValidity();
        this.regForm.controls['viaje'].clearValidators();
        this.regForm.controls['viaje'].updateValueAndValidity();
      } else {
        this.regForm.controls['grado'].clearValidators();
        this.regForm.controls['grado'].updateValueAndValidity();
      }
      this.regForm.controls['fExpiracionPapeleta'].updateValueAndValidity();
    });
  }

  asignaFecha() {
    this.maniobraService.asignaFecha({ _id: this.id }).subscribe(() => {
      this.cargarManiobra(this.id);
    });
  }

  prueba() {
    console.log(this.regForm)
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get folio() {
    return this.regForm.get('folio');
  }
  get fAsignacionPapeleta() {
    return this.regForm.get('fAsignacionPapeleta');
  }
  get fExpiracionPapeleta() {
    return this.regForm.get('fExpiracionPapeleta');
  }
  get cargaDescarga() {
    return this.regForm.get('cargaDescarga');
  }
  get peso() {
    return this.regForm.get('peso');
  }
  get grado() {
    return this.regForm.get('grado');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get descripcion() {
    return this.regForm.get('descripcion');
  }
  get codigoISO() {
    return this.regForm.get('codigoISO');
  }
  get contenedor() {
    return this.regForm.get('contenedor');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get viaje() {
    return this.regForm.get('viaje');
  }
  get BL() {
    return this.regForm.get('BL');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get transportista() {
    return this.regForm.get('transportista');
  }
  get operador() {
    return this.regForm.get('operador');
  }
  get placa() {
    return this.regForm.get('placa');
  }
  get licencia() {
    return this.regForm.get('licencia');
  }
  get noEconomico() {
    return this.regForm.get('noEconomico');
  }
}
