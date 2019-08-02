import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from 'src/app/services/service.index';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from '../../services/service.index';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
import { Viaje } from '../viajes/viaje.models';
import { ViajeService } from '../../services/service.index';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import swal from 'sweetalert';
import { AgenciaComponent } from '../agencias/agencia.component';


@Component({
  selector: 'app-solicitude-descarga',
  templateUrl: './solicitudDescarga.component.html',
  styleUrls: ['solicitudDescarga.component.css']
})

export class SolicitudDescargaComponent implements OnInit {

  regForm: FormGroup;
  fileBL: File = null;
  temporalBL = false;
  fileComprobante: File = null;
  temporalComprobante = false;
  edicion = false;

  agencias: Agencia[] = [];
  navieras: Naviera[] = [];
  buques: Buque[] = [];
  viajes: Viaje[] = [];
  transportistas: Transportista[] = [];
  clientes: Cliente[] = [];



   facturarA: string[] = ['Agencia Aduanal', 'Otro'];
   tiposContenedor: string[] = ['20\' DC', '20\' HC', '40\' DC', '40\' HC'];
   estadosContenedor: string[] = ['VACIO', 'LLENO'];
   formasPago: string [] = ['', ''];



  constructor(
    public _usuarioService: UsuarioService,
    public _agenciaService: AgenciaService,
    public _navieraService: NavieraService,
    public _transportistaService: TransportistaService,
    public _clienteService: ClienteService,
    public _SolicitudDService: SolicitudService,
    public _buqueService: BuqueService,
    public _viajeService: ViajeService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService) { }

    ngOnInit() {
      this._agenciaService.getAgencias().subscribe(ag => {this.agencias = ag.agencias; });
      this._navieraService.getNavieras().subscribe( navieras => { this.navieras = navieras.navieras; });
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
      naviera: ['', [Validators.required]],
      viaje: ['', [Validators.required]],
      buque: ['', [Validators.required]],
      transportista: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      credito: ['', [Validators.required]],
      observaciones: [''],
      rutaBL: [''],
      rutaComprobante: [''],
      correo: [''],
      correoFac: [''],
      contenedores: this.fb.array([ this.creaContenedor('', '' , '') ]),
      _id: ['']
    });
  }

  creaContenedor(cont: string, tipo: string, estado: string): FormGroup {
    return this.fb.group({
      contenedor: [cont, [Validators.required, Validators.maxLength(12)]],
      tipo: [tipo],
      estado: [estado]
    });
  }

  addContenedor(cont: string, tipo: string, estado: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, estado));
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
  get naviera() {
    return this.regForm.get('naviera');
  }
  get viaje() {
    return this.regForm.get('viaje');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get transportista() {
    return this.regForm.get('transportista');
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
  get correoFac() {
    return this.regForm.get('correoFac');
  }
  get contenedores() {
    return this.regForm.get('contenedores') as FormArray;
  }

  cargarSolicitud( id: string ) {
    this._SolicitudDService.cargarSolicitud( id ).subscribe( solicitud => {
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['agencia'].setValue(solicitud.agencia);
      this.cargaClientes({value: solicitud.agencia});
      this.regForm.controls['naviera'].setValue(solicitud.naviera);
      this.cargarBuques({value : solicitud.naviera});
      this.regForm.controls['viaje'].setValue(solicitud.viaje);
      this.regForm.controls['buque'].setValue(solicitud.buque);
      this.regForm.controls['transportista'].setValue(solicitud.transportista);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente);
      this.regForm.controls['observaciones'].setValue(solicitud.observaciones);
      this.regForm.controls['rutaBL'].setValue(solicitud.rutaBL);
      this.regForm.controls['rutaComprobante'].setValue(solicitud.rutaComprobante);
      this.regForm.controls['correo'].setValue(solicitud.correo);
      this.regForm.controls['correoFac'].setValue(solicitud.correoFacturacion);
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.contenedor, element.tipo, element.estado);
      });
    });
  }

  cargarBuques(event) {
    this._buqueService.getBuqueXNaviera( event.value )
    .subscribe( buques => this.buques = buques.buques);
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
      this._SolicitudDService.guardarSolicitud(this.regForm.value).subscribe(res => {
        this.fileBL = null;
        this.fileComprobante = null;
        this.temporalComprobante = false;
        this.temporalBL = false;
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value ===  undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.edicion = true;
          this.router.navigate(['/solicitud_descarga', this.regForm.get('_id').value]);
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

  onFilePDFBLSelected(event) {
    this.fileBL = <File> event.target.files[0];
    this.subirBL();
  }

  subirBL() {
    this._subirArchivoService.subirArchivoTemporal(this.fileBL, '').subscribe(nombreArchivo => {
      this.regForm.get('rutaBL').setValue(nombreArchivo);
      this.regForm.get('rutaBL').markAsDirty();
      this.temporalBL = true;
      this.guardarSolicitud();
    });
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



//   addContenedor(contenedor: string) {
//        // console.log(value);
//     // // tslint:disable-next-line:prefer-const
//     // // tslint:disable-next-line:triple-equals
//     // let index = this.contenedores.find( dato => dato.Contenedor == contenedor);

//     // // tslint:disable-next-line:triple-equals
//     // if (contenedor == '') {
//     //   swal( 'Error esta vacio', 'No fue posible insertar', 'error' );
//     //   // console.log('Error esta vacio');
//     //   return;
//     //  }
//     //  if (index != null) {
//     //   swal( 'Error Contenedor Duplicado', 'No fue posible insertar: ' + index.Contenedor, 'error' );
//     //   // console.log('Contenedor duplicado ' + index.contenedor);
//     //  } else {
//     //   // tslint:disable-next-line:max-line-length
//     //   this.contenedores.push({Contenedor: contenedor, Tipo: this.selectedTipo, Estado: this.selectedEstado});
//     // }

// }

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
