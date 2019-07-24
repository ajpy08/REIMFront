import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Viaje } from './viaje.models';
import { ViajeService } from '../../services/service.index';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import swal from 'sweetalert';

// datapiker
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Cliente } from '../../models/cliente.models';
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'app-viaje',
    templateUrl: './viaje.component.html',
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      {provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
    ],
  })

  export class ViajeComponent implements OnInit {
  regForm: FormGroup;
  fileTemporal: File = null;
  fileExcel: File = null;
  temporal = false;
  edicion = false;
  buques: Buque[] = [];
  navieras: Naviera[] = [];

    constructor(public _viajeService: ViajeService,
      public _buqueService: BuqueService,
      public _navieraService: NavieraService,
      public router: Router,
      public activatedRoute: ActivatedRoute,
      private fb: FormBuilder,
      public _subirArchivoService: SubirArchivoService,
      public _modalUploadService: ModalUploadService) {}

    ngOnInit() {
      this._buqueService.cargarBuques().subscribe( buques => this.buques = buques );
      this._navieraService.getNavieras().subscribe( navieras => this.navieras = navieras );
      this.createFormGroup();
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id !== 'nuevo') {
        this.edicion = true;
        this.cargarViaje ( id );
      }
      this.contenedores.removeAt(0);
    }

    createFormGroup() {
      this.regForm = this.fb.group({
        viaje: ['', [Validators.required]],
        buque: ['', [Validators.required]],
        fArribo: ['2019-07-18T05:00:00.000Z'],
        fVigenciaTemporal: ['2019-07-18T05:00:00.000Z'],
        noInterior: [''],
        pdfTemporal: [''],
        contenedores: this.fb.array([ this.creaContenedor('', '' , '', '', '') ]),
        _id: ['']
      });
    }

    creaContenedor(cont: string, tipo: string, estado: string, dest: string, estatus: string): FormGroup {
      return this.fb.group({
        contenedor: [cont, [Validators.required, Validators.maxLength(12)]],
        tipo: [tipo],
        estado: [estado],
        destinatario: [dest],
        estatus: [estatus] // DETERMINA EN QUE FASE SE ENCUENTRA LA MANIOBRA
      });
    }

    get _id() {
      return this.regForm.get('_id');
    }
    get viaje() {
      return this.regForm.get('viaje');
    }
    get buque() {
      return this.regForm.get('buque');
    }
    get fArribo() {
      return this.regForm.get('fArribo');
    }
    get fVigenciaTemporal() {
      return this.regForm.get('fVigenciaTemporal');
    }
    get pdfTemporal() {
      return this.regForm.get('pdfTemporal');
    }
    get contenedores() {
      return this.regForm.get('contenedores') as FormArray;
    }

    addContenedor(cont: string, tipo: string, estado: string, destinatario: string, estatus: string): void {
      this.contenedores.push(this.creaContenedor(cont, tipo, estado, destinatario, estatus));
    }

    addContenedor2(cont: string, tipo: string, estado: string, destinatario: string): void {
      if (this._id) {
        this._viajeService.addContenedor(this._id.value, cont, tipo, estado, destinatario)
        .subscribe(res => {
          if (res.ok) {
            this.contenedores.push(this.creaContenedor(cont, tipo, estado, destinatario, 'NUEVO' ));
            swal('Contenedor Agregado con exito', '', 'success');
          }
        });
      } else {this.contenedores.push(this.creaContenedor(cont, tipo, estado, destinatario, 'NUEVO' )); }
    }

    quitarContenedor(indice: number) {
      // console.log( this.contenedores.controls[indice].get('contenedor').value);
      this._viajeService.removerContenedor(this._id.value, this.contenedores.controls[indice].get('contenedor').value)
      .subscribe(res => {
        if (res.ok) {
          this.contenedores.removeAt(indice);
          swal('Contenedor Eliminado', '', 'success');
        }
      });
    }

    cargarViaje( id: string ) {
      this._viajeService.getViajeXID( id ).subscribe( viaje => {
        this.regForm.controls['_id'].setValue(viaje._id);
        this.regForm.controls['viaje'].setValue(viaje.viaje);
        this.regForm.controls['buque'].setValue(viaje.buque);
        this.regForm.controls['fArribo'].setValue(viaje.fArribo);
        this.regForm.controls['fVigenciaTemporal'].setValue(viaje.fVigenciaTemporal );
        this.regForm.controls['pdfTemporal'].setValue(viaje.pdfTemporal);
        viaje.contenedores.forEach(element => {
          this.addContenedor(element.contenedor, element.tipo, element.estado, element.destinatario, element.estatus);
        });
      });
    }

    guardarViaje( ) {
      if (this.regForm.valid) {
      this._viajeService.guardarViaje(this.regForm.value).subscribe(res => {
        this.fileTemporal = null;
        this.temporal = false;
        if (this.regForm.get('_id').value === '') {
          this.regForm.get('_id').setValue(res._id);
          this.edicion = true;
          this.router.navigate(['/viaje', this.regForm.get('_id').value]);
        }
        this.regForm.markAsPristine();
        });
      }
    }

    onFileExcelSelected(event) {
      this.fileExcel = <File> event.target.files[0];
      this.cargarExcel();
    }
    onFilePDFSelected(event) {
      this.fileTemporal = <File> event.target.files[0];
      this.subirFormato();
    }

   subirFormato() {
     this._subirArchivoService.subirArchivoTemporal(this.fileTemporal, '')
     .subscribe(nombreArchivo => {
      this.regForm.get('pdfTemporal').setValue(nombreArchivo);
      this.regForm.get('pdfTemporal').markAsDirty();
      this.temporal = true;
      this.guardarViaje();
    });
  }

  cargarExcel() {
    this._viajeService.cargarExcel(this.fileExcel)
    .subscribe( excel => {
      excel.forEach(element => {
        this.addContenedor(element.Contenedor, element.Tipo, element.Estado, element.Cliente, 'NUEVO');
      });
      this.regForm.controls['viaje'].setValue(excel[0].Viaje);
      const index = this.buques.find( dato => dato.buque === excel[0].Buque);
      if (!index) {
        swal( 'El nombre del Buque', 'No fue encontrado en el catalogo', 'error' );
      } else {
        this.regForm.controls['buque'].setValue(index._id);
      }
    });
  }
}
