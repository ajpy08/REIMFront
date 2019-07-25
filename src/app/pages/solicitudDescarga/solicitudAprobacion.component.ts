import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { ManiobraService } from '../../services/maniobra/maniobra.service';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { triggerAsyncId } from 'async_hooks';
import { Contenedor } from '../../models/contenedores.models';
import { Buque } from '../../models/buques.models';



@Component({
  selector: 'app-solicitudAprobacion',
  templateUrl: './solicitudAprobacion.component.html',
  styles: []
})
export class SolicitudAprobacionComponent implements OnInit {
  regForm: FormGroup;
  solicitud : Solicitud;
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
    this.solicitud = new Solicitud('','','','','','','','','',false,'','','',null,'','','','','','','','','');
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
      maniobra: [maniobra]
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
        console.log(cont.value.contenedor);
      this._ManiobraService.getManiobraXContenedorViajeBuque(cont.value.contenedor, this.solicitud.viaje, this.buque.value)
      .subscribe( maniobra => {
        cont.value.contenedor.setValue(maniobra[0]._id);
      });
       
      // console.log(this.solicitud.viaje);
      // console.log(this.idbuque)
    });
  }

  // updateSolicitud( f: NgForm ) {
  //   if ( f.invalid ) {
  //     return;
  //     }
  //   this.solicitud.contenedores = this.contenedores;
  //   console.log(this.solicitud);
  //  this._SolicitudDService.guardarSolicitudManiobra(this.solicitud)
  //  .subscribe(solicitud => {
  //   // console.log(solicitud);
  //  });

  // }

  // cambioEstado(SolicitudD: Solicitud) {
  //   this._SolicitudDService.cambioEstado(SolicitudD)
  //   .subscribe(resp => {
  //    // this.cargarSolicitudes();
  //   });
  // }




}
