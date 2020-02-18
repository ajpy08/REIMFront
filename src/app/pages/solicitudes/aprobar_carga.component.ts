import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var swal: any;

@Component({
  selector: 'app-aprobar-carga',
  templateUrl: './aprobar_carga.component.html',
  styles: []
})
export class AprobarCargaComponent implements OnInit {
  regForm: FormGroup;
  solicitud: Solicitud;
  usuario: Usuario;
  url: string;

  constructor(public _usuarioService: UsuarioService,
    public _SolicitudService: SolicitudService,
    private _ManiobraService: ManiobraService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private location: Location) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.contenedores.removeAt(0);
    this.cargarSolicitud(id);

    this.url = '/solicitudes/aprobaciones';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [{ value: '', disabled: false }],
      estatus: [{ value: '', disabled: false }],
      tipo: [{ value: '', disabled: false }],
      idagencia: [{ value: '', disabled: false }],
      agencia: [{ value: '', disabled: true }],
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


  get tipo() {
    return this.regForm.get('tipo');
  }
  get estatus() {
    return this.regForm.get('estatus');
  }
  get idagencia() {
    return this.regForm.get('idagencia');
  }
  get agencia() {
    return this.regForm.get('agencia');
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
    this._SolicitudService.getSolicitudIncludes(id).subscribe(solicitud => {
      
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      this.regForm.controls['estatus'].setValue(solicitud.estatus);

      if (solicitud.idagencia) {
        this.regForm.controls['idagencia'].setValue(solicitud.agencia._id);
      } else {
        this.regForm.controls['idagencia'].setValue(undefined);
      }

      if(solicitud.agencia){
        this.regForm.controls['agencia'].setValue(solicitud.agencia.nombreComercial);
      } else {
        this.regForm.controls['agencia'].setValue(undefined);
      }
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente.nombreComercial);
      this.regForm.controls['idcliente'].setValue(solicitud.cliente._id);
      this.regForm.controls['observaciones'].setValue(solicitud.observaciones);
      this.regForm.controls['rutaComprobante'].setValue(solicitud.rutaComprobante);
      this.regForm.controls['correo'].setValue(solicitud.correo);
      this.regForm.controls['facturarA'].setValue(solicitud.facturarA);
      this.regForm.controls['rfc'].setValue(solicitud.rfc);
      this.regForm.controls['razonSocial'].setValue(solicitud.razonSocial);
      this.regForm.controls['calle'].setValue(solicitud.calle);
      this.regForm.controls['noExterior'].setValue(solicitud.noExterior);
      this.regForm.controls['noInterior'].setValue(solicitud.noInterior);
      this.regForm.controls['colonia'].setValue(solicitud.colonia);
      this.regForm.controls['municipio'].setValue(solicitud.municipio);
      this.regForm.controls['ciudad'].setValue(solicitud.ciudad);
      this.regForm.controls['estado'].setValue(solicitud.estado);
      this.regForm.controls['cp'].setValue(solicitud.cp);
      this.regForm.controls['correoFac'].setValue(solicitud.correoFac);
      while (this.contenedores.length !== 0) {
        this.contenedores.removeAt(0)
      }
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.contenedor, element.tipo, element.peso, element.grado, element.transportista.nombreComercial, element.patio, element.maniobra);
      });
    });
  }

  apruebaSolicitud() {
    this._SolicitudService.apruebaSolicitudCarga(this.regForm.value).subscribe(res => {
      this._SolicitudService.enviaCorreoAprobacionSolicitud(this.regForm.value).subscribe((resp) => {
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
    this._ManiobraService.enviaCorreo(maniobra).subscribe(() => { });
  }

  removeContenedor(index: number) {
    this.contenedores.removeAt(index);
    this.regForm.markAsDirty();
  }

  borrarContenedor(indice: number) {
    if (this.contenedores.controls.length > 1) {
      swal({
        title: '¿Esta seguro?',
        text: 'Esta apunto de borrar el contenedor ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(borrar => {
        if (borrar) {
        const idManiobra = this.contenedores.controls[indice].value.maniobra._id;
        if (idManiobra) {
          this._SolicitudService.borrarManiobra(idManiobra)
            .subscribe(res => {
              if (res) {
                this.contenedores.controls[idManiobra].get("contenedor").value
                this.contenedores.removeAt(indice);
                this.regForm.markAsDirty();
                
              }

            });
          this._SolicitudService.removeConte(this._id.value, idManiobra).subscribe(res => {
            this.contenedores.removeAt(indice);
            this.regForm.markAsDirty();
          })
        }
      }
      });
    
      } else {
        swal ({
          title: 'ADVERTENCIA',
          text: ' Al borrar este contenedor se eliminara la solicitud',
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        }).then(borrar => {
          if (borrar) {
            this._SolicitudService.boorarSolicitudes(this._id.value).subscribe(res => {

              swal({
                title: "ELIMINADO",
                text: "Borrado",
                icon: "success",
              }).then(ok => {
                if(ok) {
                  this.router.navigate(["/solicitudes/aprobaciones"]);
                }
              })
            })
          }
        })
      }

    }

}
