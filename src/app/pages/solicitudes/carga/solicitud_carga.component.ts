import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Agencia } from '../../../models/agencia.models';
import { AgenciaService } from 'src/app/services/service.index';
import { Usuario } from '../../../models/usuarios.model';
import { UsuarioService } from '../../../services/service.index';
import { Transportista } from '../../../models/transportista.models';
import { TransportistaService } from '../../../services/service.index';
import { Cliente } from '../../../models/cliente.models';
import { ClienteService } from '../../../services/service.index';
import { Solicitud } from '../solicitud.models';
import { SolicitudService } from '../../../services/service.index';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';
import { SubirArchivoService } from '../../../services/subirArchivo/subir-archivo.service';




@Component({
  selector: 'app-solicitud-carga',
  templateUrl: './solicitud_carga.component.html',
  styleUrls: []
})

export class SolicitudCargaComponent implements OnInit {

  regForm: FormGroup;
  grados: string[] = ['A', 'B', 'C'];
  fileComprobante: File = null;
  temporalComprobante = false;
  edicion = false;
  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];
  clientes: Cliente[] = [];

   facturarA: string[] = ['Agencia Aduanal', 'Otro'];
   tiposContenedor: string[] = ['20\' DC', '20\' HC', '40\' DC', '40\' HC'];
   estadosContenedor: string[] = ['VACIO', 'LLENO'];
   formasPago: string [] = ['', ''];

  constructor(
    public _usuarioService: UsuarioService,
    public _agenciaService: AgenciaService,
    public _transportistaService: TransportistaService,
    public _clienteService: ClienteService,
    public _SolicitudService: SolicitudService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService) { }

    ngOnInit() {
      this._agenciaService.getAgencias().subscribe(ag => {this.agencias = ag.agencias; });
      this._transportistaService.getTransportistas().subscribe( transportistas => this.transportistas = transportistas.transportistas );
      this.createFormGroup();
      const id = this.activatedRoute.snapshot.paramMap.get('id');

      if (id !== 'nuevo') {
        this.edicion = true;
        this.cargarSolicitud ( id );
      } else {
        this.credito.disable({onlySelf: true});
      }
      this.contenedores.removeAt(0);
    }

  createFormGroup() {
    this.regForm = this.fb.group({
      agencia: ['', [Validators.required]],
      transportista: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      blBooking: ['', [Validators.required]],
      credito: ['', [Validators.required]],
      observaciones: [''],
      rutaComprobante: [''],
      correo: [''],
      correoFac: [''],
      contenedores: this.fb.array([ this.creaContenedor('', '' , '') ]),
      _id: [''],
      tipo: ['C']
    });
  }

  creaContenedor(tipo: string, estado: string, grado: string): FormGroup {
    return this.fb.group({
      tipo: [tipo],
      estado: [estado],
      grado: [grado]
    });
  }

  addContenedor(tipo: string, estado: string, grado: string): void {
    this.contenedores.push(this.creaContenedor(tipo, estado, grado));
  }

  removeContenedor( index: number ) {
    this.contenedores.removeAt(index);
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get transportista() {
    return this.regForm.get('transportista');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get blBooking() {
    return this.regForm.get('blBooking');
  }
  get observaciones() {
    return this.regForm.get('observaciones');
  }
  get credito() {
    return this.regForm.get('credito');
  }

  get rutaComprobante() {
    return this.regForm.get('rutaComprobante');
  }
  get correo() {
    return this.regForm.get('correo');
  }
  get correoFac() {
    return this.regForm.get('correoFac');
  }
  get contenedores() {
    return this.regForm.get('contenedores') as FormArray;
  }

  cargarSolicitud( id: string ) {
    this._SolicitudService.cargarSolicitud( id ).subscribe( solicitud => {
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      this.regForm.controls['agencia'].setValue(solicitud.agencia);
      this.cargaClientes({value: solicitud.agencia});
      this.regForm.controls['transportista'].setValue(solicitud.transportista);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente);
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['observaciones'].setValue(solicitud.observaciones);
      this.regForm.controls['rutaComprobante'].setValue(solicitud.rutaComprobante);
      this.regForm.controls['correo'].setValue(solicitud.correo);
      this.regForm.controls['correoFac'].setValue(solicitud.correoFacturacion);
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.tipo, element.estado, element.grado);
      });
    });
  }

  cargaClientes(event) {
    this._clienteService.getClientesEmpresa(event.value)
    .subscribe( cliente => this.clientes = cliente.clientes);
  }
  cargaCliente(event) {
    let cliente = new Cliente();
    cliente = this.clientes.find(x => x._id === event.value);
    if (cliente.credito) {
      this.credito.enable({onlySelf : true});
      this.credito.setValue(true);
    } else {
      this.credito.disable({onlySelf : true});
      this.credito.setValue(false);
    }
    this.correo.setValue(cliente.correo);
    this.correoFac.setValue(cliente.correoFac);


  }
  guardarSolicitud( ) {
    if (this.regForm.valid) {
      this._SolicitudService.guardarSolicitud(this.regForm.value).subscribe(res => {
        this.fileComprobante = null;
        this.temporalComprobante = false;
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value ===  undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.edicion = true;
          this.router.navigate(['/solicitud_carga', this.regForm.get('_id').value]);
        }
        this.regForm.markAsPristine();
      });
    }
  }

  onChangeCredito( event ) {
    if (event.checked) {
      this.rutaComprobante.setValue(undefined);
      this.rutaComprobante.disable({ onlySelf : true});
    } else {
      this.rutaComprobante.enable({ onlySelf : true});
    }
  }


  onFilePDFComprobanteSelected(event) {
    this.fileComprobante = <File> event.target.files[0];
    this.subirComprobante();
  }

  subirComprobante() {
    this._subirArchivoService.subirArchivoTemporal(this.fileComprobante, '').subscribe(nombreArchivo => {
      this.regForm.get('rutaComprobante').setValue(nombreArchivo);
      this.regForm.get('rutaComprobante').markAsDirty();
      this.temporalComprobante = true;
      this.guardarSolicitud();
    });
  }


  remover(element: any) {
    // console.log(element);
    //  let index = this.contenedores.find( dato => dato.Contenedor == element);
    //   // tslint:disable-next-line: prefer-const
    //  let index2 = this.contenedores.indexOf(index);
    //    console.log(index2);
    //    if (index2 >= -1) {
    //   this.contenedores.splice(index2, 1);
    // }
  }
}
