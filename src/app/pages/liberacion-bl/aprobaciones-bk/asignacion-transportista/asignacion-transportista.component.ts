import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Liberacion } from '../../liberacion.models';
import { Usuario } from 'src/app/pages/usuarios/usuario.model';
import { UsuarioService, ManiobraService, TransportistaService } from 'src/app/services/service.index';
import { LiberacionBLService } from '../../liberacion-bl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Transportista } from 'src/app/pages/transportistas/transportista.models';
import { ROLES, STATUS_SOLICITUD } from 'src/app/config/config';
import { element } from 'protractor';
import swal from 'sweetalert';

@Component({
  selector: 'app-asignacion-transportista',
  templateUrl: './asignacion-transportista.component.html',
  styleUrls: ['./asignacion-transportista.component.css']
})
export class AsignacionTransportistaComponent implements OnInit {

  regForm: FormGroup;
  liberacion: Liberacion;
  usuario: Usuario;
  url: string;
  transportistas: Transportista[] = [];
  usuarioLogueado: any;
  transportistaSelect;


  constructor(public usuarioService: UsuarioService,
    public liberacionService: LiberacionBLService,
    private maniobraService: ManiobraService,
    public activateRoute: ActivatedRoute,
    private _transportistaService: TransportistaService,
    public router: Router,
    private fb: FormBuilder,
    private location: Location
  ) { this.usuario = this.usuarioService.usuario; }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    const id = this.activateRoute.snapshot.paramMap.get('id');
    this._transportistaService.getTransportistas(true).subscribe(transportistas => this.transportistas = transportistas.transportistas);
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
      naviera: [{ value: '', disabled: true }],
      idnaviera: [{ value: '', disabled: false }],
      estatus: [{ value: '', disabled: false }],
      tipo: [{ value: '', disabled: false }],
      blBooking: [{ value: '', disabled: true }],
      idcliente: [{ value: '', disabled: false }],
      cliente: [{ value: '', disabled: true }],
      rutaBL: [{ value: '', disabled: true }],
      rutaComprobante: [{ value: '', disabled: true }],
      idTransportista: [{ value: '', disabled: true }],
      transportista: [''],
      contenedores: this.fb.array([this.creaContenedor('', '', '', '', '', '', '', '')], { validators: Validators.required }),
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
  get transportista() {
    return this.regForm.get('transportista');
  }

  get idcliente() {
    return this.regForm.get('idcliente');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }

  get rutaBL() {
    return this.regForm.get('rutaBL');
  }
  get rutaComprobante() {
    return this.regForm.get('rutaComprobante');
  }

  get maniobraTemp() {
    return this.regForm.get('maniobraTemp');
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

  creaContenedor(cont: string, tipo: string, peso: string, grado: string, transportista: string, transportista2: string, patio: string, maniobra: string): FormGroup {
    return this.fb.group({
      contenedor: [cont],
      tipo: [tipo],
      peso: [peso],
      grado: [grado],
      transportista: [transportista],
      transportista2: [transportista2],
      patio: [patio],
      maniobra: [maniobra]
    });
  }
  addContenedor(cont: string, tipo: string, peso: string, grado: string, transportista: string, transportista2: string, patio: string, maniobra: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, peso, grado, transportista, transportista2, patio, maniobra));
  }


  cargarSolicitud(id: string) {
    this.liberacionService.getLiberacionIncludes(id).subscribe(liberacion => {
      this.regForm.controls['_id'].setValue(liberacion._id);
      this.regForm.controls['tipo'].setValue(liberacion.tipo);
      this.regForm.controls['estatus'].setValue(liberacion.estatus);
      this.regForm.controls['naviera'].setValue(liberacion.naviera.nombreComercial);
      this.regForm.controls['idnaviera'].setValue(liberacion.naviera._id);
      this.regForm.controls['blBooking'].setValue(liberacion.blBooking);
      this.regForm.controls['cliente'].setValue(liberacion.cliente.nombreComercial);
      this.regForm.controls['idcliente'].setValue(liberacion.cliente._id);
      this.regForm.controls['rutaComprobante'].setValue(liberacion.rutaComprobante);
      while (this.contenedores.length !== 0) {
        this.contenedores.removeAt(0)
      }
      liberacion.contenedores.forEach(element => {



        if (element.transportista == null) {
          this.addContenedor(element.contenedor, element.tipo, element.peso, element.grado,
            '', '', element.patio, element.maniobra);

        } else {
          this.addContenedor(element.contenedor, element.tipo, element.peso, element.grado,
            element.transportista._id, element.transportista.nombreComercial, element.patio, element.maniobra);

        }
      });
    });
  }
  asignaTransportista(id: string, posicion) {
    // console.log(posicion)
    this.contenedores.value[posicion].transportista = id;

    // console.log(this.contenedores.value[posicion]);
  }



  actualizarSolicitud() {

      this.liberacionService.actualizarSolicitud(this.regForm.value).subscribe(res => {
        this.liberacionService.enviaCorreoAprobacionLiberacion(this.regForm.value).subscribe((resp) => {
          this.cargarSolicitud(this._id.value);
        });
      });
    



    //   setTimeout(() => {
    //     this.router.navigate([this.url]);
    // }, 1500);

  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
    // this.location.back();
  }


}
