import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';


@Component({
  selector: 'app-solicitudd-aprobar',
  templateUrl: './solicitudD_aprobar.component.html',
  styles: []
})
export class SolicitudDAprobarComponent implements OnInit {
  regForm: FormGroup;
  solicitud: Solicitud;
  usuario: Usuario;

  constructor( public _usuarioService: UsuarioService,
    public _SolicitudService: SolicitudService,
    private _ManiobraService: ManiobraService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.solicitud = new Solicitud('', '', '', '', '', '', '', '', '', false, '', '', '', null, '', '', '', '', '', '', '', '', '');
    this.createFormGroup ();
    this.contenedores.removeAt(0);
    this.cargarSolicitud( id );
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      buque: [''],
      contenedores: this.fb.array([ this.creaContenedor('', '' , '','') ])
    });
  }

  creaContenedor(cont: string, tipo: string, estado: string, maniobra : string): FormGroup {
    return this.fb.group({
      contenedor: [cont, [Validators.required, Validators.maxLength(12)]],
      tipo: [tipo],
      estado: [estado],
      maniobra: [maniobra, [Validators.required]]
    });
  }
  addContenedor(cont: string, tipo: string, estado: string, maniobra: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, estado, maniobra));
  }
  get _id() {
    return this.regForm.get('_id');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get contenedores() {
    return this.regForm.get('contenedores') as FormArray;
  }

  cargarSolicitud( id: string ) {
    this._SolicitudService.getSolicitudIncludes( id ).subscribe( solicitud => {
      this.solicitud = solicitud;
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['buque'].setValue(solicitud.buque._id);
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.contenedor, element.tipo, element.estado,'');
      });
    });
  }

  validaSolicitud() {
      this.contenedores.controls.forEach( cont => {
      this._ManiobraService.getManiobraXContenedorViajeBuque(cont.get('contenedor').value, this.solicitud.viaje, this.buque.value)
      .subscribe( maniobra => {
        if (maniobra.length > 0) {
          console.log(maniobra[0]._id);
         cont.get('maniobra').setValue(maniobra[0]._id);
        }
      });
    });
  }

  apruebaSolicitud( ) {
    if ( this.regForm.valid ) {
     this._SolicitudService.apruebaSolicitudDescarga(this.regForm.value).subscribe(res => {
      this.regForm.markAsPristine();
      });
    }
  }

  // cambioEstado(SolicitudD: Solicitud) {
  //   this._SolicitudDService.cambioEstado(SolicitudD)
  //   .subscribe(resp => {
  //    // this.cargarSolicitudes();
  //   });
  // }




}
