import { FacturacionService } from './../facturacion/facturacion.service';
import { Component, OnInit } from '@angular/core';
import { ClienteService, SubirArchivoService, UsuarioService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AgenciaService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Usuario } from '../usuarios/usuario.model';
import { Location } from '@angular/common';
import { ROLES } from 'src/app/config/config';
import swal from 'sweetalert';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styles: []
})
export class ClienteComponent implements OnInit {
  tipoFile = '';
  regForm: FormGroup;
  fileImg: File = null;
  fileImgTemporal = false;
  file: File = null;
  fileTemporal = false;
  usosCFDI = [];
  edicion = false;
  usuarioLogueado = new Usuario;
  url: string;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(public _clienteService: ClienteService,
    public facturacionService: FacturacionService,
    public _agenciaService: AgenciaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private usuarioService: UsuarioService,
    private location: Location) { }

  ngOnInit() {

    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.usuarioLogueado = this.usuarioService.usuario;

    this.facturacionService.getUsosCFDI().subscribe(usosCFDI => {
      this.usosCFDI = usosCFDI.usosCFDI;
    });

    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this._clienteService.getClientesRole().subscribe((empresas) => {
        this.usuarioLogueado.empresas = empresas;
      });
    }

    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarCliente(id);
    } else {
      this.regForm.controls['noInterior'].setValue(undefined);
      this.regForm.controls['noExterior'].setValue(undefined);
    }

    this.url = '/clientes';

    if (this.correoF) {
      this.correoF.removeAt(0);
    }

    this.socket.on('update-cliente', function (data: any) {
      if ((data.data.empresas[0] === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
        (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        if (data.data._id) {
          this.createFormGroup();
          this.cargarCliente(data.data._id);
          if (data.data.usuarioMod !== this.usuarioLogueado._id) {
            swal({
              title: 'Actualizado',
              text: 'Otro usuario ha actualizado este cliente',
              icon: 'info'
            });
          }
        }
      }
    }.bind(this));

    this.socket.on('delete-cliente', function (data: any) {
      if ((data.data.empresas[0] === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
        (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.router.navigate(['/clientes']);
        swal({
          title: 'Eliminado',
          text: 'Se elimino este cliente por otro usuario',
          icon: 'warning'
        });
      }
    }.bind(this));
  }

  ngOnDestroy() {
    this.socket.removeListener('delete-cliente');
    this.socket.removeListener('update-cliente');
  }

  role(role: string) {
    const result = role.substr(0, role.indexOf('_'));
    return result;
  }

  soyAdmin() {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      return true;
    } else {
      return false;
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      // rfc: ['', [Validators.required, Validators.minLength(12)]],
      rfc: [''],
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      nombreComercial: [''],
      calle: [''],
      noExterior: [''],
      noInterior: [''],
      colonia: [''],
      municipio: [''],
      ciudad: [''],
      estado: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      formatoR1: [''],
      activo:[true, [Validators.required]],
      correo: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      correotem: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correoF: this.fb.array([this.agregarArray('')], { validators: Validators.required, updateOn: 'blur' }),

      correoFac: ['', Validators.email],
      credito: [false, [Validators.required]],
      img: [''],
      empresas: [''],
      usoCFDI: ['', [Validators.required]],
      _id: ['']
    });
  }


  agregarArray(correoO: String): FormGroup {
    return this.fb.group({
      correoO: [correoO]
    });
  }

  addContenedor(correoO: string): void {
    let error = false;
    if (correoO === '') {
      this.correo.disable({ emitEvent: true });
      swal('Error al Agregar', 'El campo Correo Operativo no puede estar Vacio', 'error');
    } else if (this.correoF.controls.length === 0) {
      this.correoF.push(this.agregarArray(correoO));
    } else {
        if (this.correoF.controls) {
          this.correoF.controls.forEach(c => {
            if (this.correotem.value === c.value.correoO) {
              if (error === false) {
                swal('Error al agregar', 'El correo ' + this.correotem.value + ' ya se encuentra registrado en la lista', 'error');
                error = true;
                return false;
              }
            }
          });
          if (!error) {
            this.correoF.push(this.agregarArray(correoO));
          }
        }
    }
  }

  quitar(indice: number) {
    this.correoF.removeAt(indice);
  }

  get razonSocial() {
    return this.regForm.get('razonSocial');
  }
  get nombreComercial() {
    return this.regForm.get('nombreComercial');
  }
  get rfc() {
    return this.regForm.get('rfc');
  }
  get calle() {
    return this.regForm.get('calle');
  }
  get numeroExterior() {
    return this.regForm.get('noExterior');
  }
  get numeroInterior() {
    return this.regForm.get('noInterior');
  }
  get colonia() {
    return this.regForm.get('colonia');
  }
  get municipioDelegacion() {
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
  get formatoR1() {
    return this.regForm.get('formatoR1');
  }
  get correo() {
    return this.regForm.get('correo');
  }

  get correoF() {
    return this.regForm.get('correoF') as FormArray;
  }
  get correotem() {
    return this.regForm.get('correotem');
  }

  get correoFac() {
    return this.regForm.get('correoFac');
  }
  get credito() {
    return this.regForm.get('credito');
  }
  get img() {
    return this.regForm.get('img');
  }
  get empresas() {
    return this.regForm.get('empresas');
  }

  get usoCFDI() {
    return this.regForm.get('usoCFDI');
  }
  get activo() {
    return this.activo.get('activo');
  }
  get _id() {
    return this.regForm.get('_id');
  }

  cargarCliente(id: string) {
    this._clienteService.getCliente(id)
      .subscribe(res => {
        this.regForm.controls['razonSocial'].setValue(res.razonSocial);
        this.regForm.controls['nombreComercial'].setValue(res.nombreComercial);
        this.regForm.controls['rfc'].setValue(res.rfc);
        this.regForm.controls['calle'].setValue(res.calle);
        this.regForm.controls['noExterior'].setValue(res.noExterior);
        this.regForm.controls['noInterior'].setValue(res.noInterior);
        this.regForm.controls['colonia'].setValue(res.colonia);
        this.regForm.controls['municipio'].setValue(res.municipio);
        this.regForm.controls['ciudad'].setValue(res.ciudad);
        this.regForm.controls['estado'].setValue(res.estado);
        this.regForm.controls['cp'].setValue(res.cp);
        this.regForm.controls['formatoR1'].setValue(res.formatoR1);


        const correoArray = res.correo.split(',');
        correoArray.forEach(c => {
          this.addContenedor(c);
        });

        // this.regForm.controls['correo'].setValue(res.correo);
        this.regForm.controls['correoFac'].setValue(res.correoFac);
        this.regForm.controls['credito'].setValue(res.credito);
        this.regForm.controls['img'].setValue(res.img);
        this.regForm.controls['usoCFDI'].setValue(res.usoCFDI);
        this.regForm.controls['empresas'].setValue(res.empresas);
        this.regForm.controls['activo'].setValue(res.activo);
        this.regForm.controls['_id'].setValue(res._id);
      });
  }

  guardarCliente() {
    if (this.regForm.valid) {

      let correos = '';
      this.regForm.controls.correoF.value.forEach(correo => {
        correos += correo.correoO + ',';
      });
      correos = correos.slice(0, -1);

      this.correotem.setValue('');
      this.correo.setValue(correos);

      // console.log (this.regForm.value);
      this._clienteService.guardarCliente(this.regForm.value)
        .subscribe(res => {
          this.fileImg = null;
          this.fileImgTemporal = false;
          this.file = null;
          this.fileTemporal = false;
          // console.log (res);
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.socket.emit('newcliente', res);
            this.edicion = true;
            this.router.navigate(['/cliente', this.regForm.get('_id').value]);
          }
          // else {
          //   this.socket.emit('updatecliente', res);
          // }
          this.regForm.markAsPristine();
        });
    }
  }

  onFileSelected(event) {
    if (this.tipoFile === 'img') {
      // console.log('Fue Foto');
      if (event.target.files[0] !== undefined) {
        this.fileImg = <File>event.target.files[0];
        this.subirArchivo(this.tipoFile);
      }
    } else {
      if (this.tipoFile === 'formatoR1') {
        // console.log('Fue R1');
        if (event.target.files[0] !== undefined) {
          this.file = <File>event.target.files[0];
          this.subirArchivo(this.tipoFile);
        }
      } else {
        console.log('No conozco el tipo de archivo para subir');
      }
    }
  }

  subirArchivo(tipo: string) {
    let file: File;
    if (this.fileImg !== null && tipo === 'img') {
      file = this.fileImg;
      this.fileImgTemporal = true;
      // console.log('FileImgTemporal ' + this.fileImgTemporal)
    } else {
      if (this.file !== null && tipo === 'formatoR1') {
        file = this.file;
        this.fileTemporal = true;
        // console.log('FileTemporal ' + this.fileTemporal)
      }
    }
    this._subirArchivoService.subirArchivoBucketTemporal(file)
      .subscribe(nombreArchivo => {
        this.regForm.get(tipo).setValue(nombreArchivo);
        this.regForm.get(tipo).markAsDirty();
        this.guardarCliente();
      });
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
    // this.location.back();
  }
}
