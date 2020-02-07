import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Liberacion } from '../liberacion.models';
import { Usuario } from '../../usuarios/usuario.model';
import { UsuarioService } from '../../usuarios/usuario.service';
import { LiberacionBLService } from '../liberacion-bl.service';
import { ManiobraService } from '../../maniobras/maniobra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ROLES } from 'src/app/config/config';

@Component({
  selector: 'app-aprobaciones-bk',
  templateUrl: './aprobaciones-bk.component.html',
  styleUrls: ['./aprobaciones-bk.component.css']
})
export class AprobacionesBkComponent implements OnInit {

  regForm: FormGroup;
  liberacion: Liberacion;
  usuario: Usuario;
  url: string;
  usuarioLogueado: any;

  constructor(public usuarioService: UsuarioService,
    public liberacionService: LiberacionBLService,
    private maniobraService: ManiobraService,
    public activateRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private location: Location) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    const id = this.activateRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.contenedores.removeAt(0);
    this.cargarSolicitud(id);

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this.url = '/aprobacion_tbk';
    } else if (this.usuarioLogueado.role == ROLES.NAVIERA_ROLE) {
      this.url = '/liberaciones_bk';
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [{ value: '', disabled: false }],
      naviera: [{ value: '', disabled: false}],
      idnaviera: [{ value: '', disabled: false}],
      estatus: [{ value: '', disabled: false }],
      tipo: [{ value: '', disabled: false }],
      blBooking: [{ value: '', disabled: true }],
      idcliente: [{ value: '', disabled: false }],
      cliente: [{ value: '', disabled: true }],
      credito: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
      rutaBL: [{ value: '', disabled: true }],
      rutaComprobante: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      facturarA: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      calle: [{ value: '', disabled: true }],
      noExterior: [{ value: '', disabled: true }],
      noInterior: [{ value: '', disabled: true }],
      colonia: [{ value: '', disabled: true }],
      municipio: [{ value: '', disabled: true }],
      ciudad: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      correoFac: [{ value: '', disabled: true }],
      cp: [{ value: '', disabled: true }],
      contenedores: this.fb.array([this.creaContenedor('', '', '', '', '', '', '')], { validators: Validators.required }),
    });
  }

  get naviera() {
    return this.regForm.get('naviera');
  }
  get idnaviera() {
    return this.regForm.get('idnaviera');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get estatus() {
    return this.regForm.get('estatus');
  }
  get transportistaTemp() {
    return this.regForm.get('transportistaTemp');
  }

  get idcliente() {
    return this.regForm.get('idcliente');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }

  get observaciones() {
    return this.regForm.get('observaciones');
  }
  get credito() {
    return this.regForm.get('credito');
  }
  get rutaBL() {
    return this.regForm.get('rutaBL');
  }
  get rutaComprobante() {
    return this.regForm.get('rutaComprobante');
  }
  get correo() {
    return this.regForm.get('correo');
  }


  get maniobraTemp() {
    return this.regForm.get('maniobraTemp');
  }

  get estadoTemp() {
    return this.regForm.get('estadoTemp');
  }

  get facturarA() {
    return this.regForm.get('facturarA');
  }
  get rfc() {
    return this.regForm.get('rfc');
  }
  get razonSocial() {
    return this.regForm.get('razonSocial');
  }
  get calle() {
    return this.regForm.get('calle');
  }
  get noExterior() {
    return this.regForm.get('noExterior');
  }
  get noInterior() {
    return this.regForm.get('noInterior');
  }
  get colonia() {
    return this.regForm.get('colonia');
  }
  get municipio() {
    return this.regForm.get('municipio');
  }
  get ciudad() {
    return this.regForm.get('ciudad');
  }
  get estado() {
    return this.regForm.get('estado');
  }
  get cp() {
    return this.regForm.get('cp');
  }
  get correoFac() {
    return this.regForm.get('correoFac');
  }

  get blBooking() {
    return this.regForm.get('blBooking');
  }
  get _id() {
    return this.regForm.get('_id');
  }
  get contenedores() {
    return this.regForm.get('contenedores') as FormArray;
  }

  creaContenedor(cont: string, tipo: string, estado: string, grado: string, transportista: string, patio: string, maniobra: string): FormGroup {
    return this.fb.group({
      contenedor: [cont],
      tipo: [tipo],
      estado: [estado],
      grado: [grado],
      transportista: [transportista],
      patio: [patio],
      maniobra: [maniobra]
    });
  }
  addContenedor(cont: string, tipo: string, estado: string, grado: string, transportista: string, patio: string, maniobra: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, estado, grado, transportista, patio, maniobra));
  }


  cargarSolicitud(id: string) {
    this.liberacionService.getLiberacionIncludes(id).subscribe(liberacion => {
      this.regForm.controls['_id'].setValue(liberacion._id);
      this.regForm.controls['tipo'].setValue(liberacion.tipo);
      this.regForm.controls['estatus'].setValue(liberacion.estatus);
      this.regForm.controls['naviera'].setValue(liberacion.naviera.nombreComercial);
      this.regForm.controls['idnaviera'].setValue(liberacion.naviera._id);
      this.regForm.controls['blBooking'].setValue(liberacion.blBooking);
      this.regForm.controls['credito'].setValue(liberacion.credito);
      this.regForm.controls['cliente'].setValue(liberacion.cliente.nombreComercial);
      this.regForm.controls['idcliente'].setValue(liberacion.cliente._id);
      this.regForm.controls['observaciones'].setValue(liberacion.observaciones);
      this.regForm.controls['rutaComprobante'].setValue(liberacion.rutaComprobante);
      this.regForm.controls['correo'].setValue(liberacion.correo);
      this.regForm.controls['facturarA'].setValue(liberacion.facturarA);
      this.regForm.controls['rfc'].setValue(liberacion.rfc);
      this.regForm.controls['razonSocial'].setValue(liberacion.razonSocial);
      this.regForm.controls['calle'].setValue(liberacion.calle);
      this.regForm.controls['noExterior'].setValue(liberacion.noExterior);
      this.regForm.controls['noInterior'].setValue(liberacion.noInterior);
      this.regForm.controls['colonia'].setValue(liberacion.colonia);
      this.regForm.controls['municipio'].setValue(liberacion.municipio);
      this.regForm.controls['ciudad'].setValue(liberacion.ciudad);
      this.regForm.controls['estado'].setValue(liberacion.estado);
      this.regForm.controls['cp'].setValue(liberacion.cp);
      this.regForm.controls['correoFac'].setValue(liberacion.correoFac);
      while (this.contenedores.length !== 0) {
        this.contenedores.removeAt(0)
      }
      liberacion.contenedores.forEach(element => {
        this.addContenedor(element.contenedor, element.tipo, element.peso, element.grado, element.transportista.nombreComercial, element.patio, element.maniobra);
      });
    });
  }

  apruebaLiberacion() {
    this.liberacionService.apruebaLiberacionCarga(this.regForm.value).subscribe(res => {
      this.liberacionService.enviaCorreoAprobacionLiberacion(this.regForm.value).subscribe((resp) => {
        this.cargarSolicitud(this._id.value);
      });
    });
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
    // this.location.back();
  }

  enviacorreo(maniobra) {
    this.maniobraService.enviaCorreo(maniobra).subscribe(() => { });
  }

}


