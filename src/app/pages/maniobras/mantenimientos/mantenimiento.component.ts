
import { Component, OnInit, Inject } from '@angular/core';
import { TIPOS_LAVADO_ARRAY, TIPOS_MANTENIMIENTO_ARRAY } from '../../../config/config';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../usuarios/usuario.model';
import { DatePipe } from '@angular/common';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Mantenimiento } from './mantenimiento.models';
import { MantenimientoService, MaterialService, ManiobraService, UsuarioService } from "../../../services/service.index";
import { Material } from '../../almacen/materiales/material.models';
import * as _moment from 'moment';
import { Maniobra } from '../../../models/maniobra.models';
import { ROLES } from 'src/app/config/config';
declare var swal: any;
import { URL_SERVICIOS } from '../../../../environments/environment';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L']
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styles: [],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }
  ]
})
export class MantenimientoComponent implements OnInit {

  usuarioLogueado = new Usuario;
  regForm: FormGroup;
  url: string;
  regresar_cerrar = "";
  act = true;
  mantenimiento: Mantenimiento = new Mantenimiento();
  maniobraAsociada: Maniobra = new Maniobra();
  tiposLavado = TIPOS_LAVADO_ARRAY;
  tiposMantenimiento = TIPOS_MANTENIMIENTO_ARRAY;
  listaMateriales: Material[];
  mantenimientoAgregar = new SelectionModel<Mantenimiento>(true, []);
  dialogR = false;
  mensajeError: string = '';
  mensajeExito: string = '';
  mostrarInfoAdmin: boolean;
  selectedMaterial : any;
  filePDFFolio: File = null;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _usuarioService: UsuarioService,
    private _mantenimientoService: MantenimientoService,
    private _materialService: MaterialService,
    private _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) { 
    this.mostrarInfoAdmin = false;
    
  }

  ngOnInit() {

    this.url = '/mantenimientos';
    this.usuarioLogueado = this._usuarioService.usuario;
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) this.mostrarInfoAdmin = true;

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.mantenimiento._id = id;
      this.dialogR = false;
      this.regresar_cerrar = "Regresar";
    }
    else {
      this.mantenimiento = this.data;
      this.dialogR = true;
      this.regresar_cerrar = "Cerrar";
    }

    this._materialService.getMateriales(null, true).subscribe(materiales => {
      this.listaMateriales = materiales.materiales;
      this.selectedMaterial = this.listaMateriales[0]._id;
    });

    this.createFormGroup();
    if (this.mantenimiento._id !== 'nuevo') {
      this.cargarRegistro(this.mantenimiento._id);
    } else {
      for (const control in this.regForm.controls) {
        if (control.toString() !== "fechas" && control.toString() !== "materiales")
          this.regForm.controls[control.toString()].setValue(undefined);
      }
    }

  }

  createFormGroup() {
    this.regForm = this.fb.group({
      tipoMantenimiento: ['', [Validators.required]],
      tipoLavado: [{ value: 'B', disabled: true }, [Validators.required]],
      cambioGrado: [{ value: false, disabled: true }],
      folio: [''],
      fileFolio: [''],
      observacionesGenerales: [''],
      izquierdo: [''],
      derecho: [''],
      frente: [''],
      puerta: [''],      
      techo: [''],
      piso: [''],
      interior: [''],
      fechas: this.fb.array([]),
      materiales: this.fb.array([]),
      finalizado: [{value: false, disabled:true}],
      _id: [''],
      maniobra: ['']
    });
  }

  habilitaControles() {
    for (const control in this.regForm.controls) {
      if (control.toString() !== "finalizado" && control.toString() !== "_id" && control.toString() !== "tipoLavado" && control.toString() !== "cambioGrado") {
        if (control.toString() !== "fechas" && control.toString() !== "fechas") {
          if (this.finalizado.value) this.regForm.controls[control.toString()].disable({ onlySelf: true });
          else this.regForm.controls[control.toString()].enable({ onlySelf: true });
        }
        else {
          if (this.finalizado.value) (<FormArray>this.regForm.get(control.toString())).controls.forEach(control2 => { control2.disable({ onlySelf: true }) });
          else (<FormArray>this.regForm.get(control.toString())).controls.forEach(control2 => { control2.enable({ onlySelf: true }) });
        }

      }
    }

  }

  cargarRegistro(idMantenimiento: string) {
    this._mantenimientoService.getMantenimiento(idMantenimiento).subscribe(res => {

      this.mantenimiento = res.mantenimiento;
      this._maniobraService.getManiobra(this.mantenimiento.maniobra).subscribe(res => { this.maniobraAsociada = res.maniobra; });
      for (const propiedad in this.mantenimiento)
        for (const control in this.regForm.controls)
          if (propiedad === control.toString()) {
            if (propiedad == "fechas")
              res.mantenimiento[propiedad].forEach((x: { fIni: _moment.Moment; hIni: string; fFin: string; hFin: string; }) => this.addFecha(x.fIni, x.hIni, x.fFin, x.hFin));
            else {
              if (propiedad == "materiales") {
                res.mantenimiento[propiedad].forEach((x: any) => { this.addMaterial(x._id, x.material, x.descripcion, x.costo.$numberDecimal, x.precio.$numberDecimal, x.cantidad,x.unidadMedida) });
              }
              else {
                this.regForm.controls[propiedad].enable({ onlySelf: true });
                this.regForm.controls[propiedad].setValue(res.mantenimiento[propiedad]);
              }
            }
          }
      this.habilitaControles();
    });


  }


  get tipoMantenimiento() {
    return this.regForm.get('tipoMantenimiento');
  }

  get tipoLavado() {
    return this.regForm.get('tipoLavado');
  }

  get cambioGrado() {
    return this.regForm.get('cambioGrado');
  }
  get folio() {
    return this.regForm.get('folio');
  }
  get fileFolio() {
    return this.regForm.get('fileFolio');
  }  
  get observacionesGenerales() {
    return this.regForm.get('observacionesGenerales');
  }
  get izquierdo() {
    return this.regForm.get('izquierdo');
  }
  get derecho() {
    return this.regForm.get('derecho');
  }
  get frente() {
    return this.regForm.get('frente');
  }
  get puerta() {
    return this.regForm.get('puerta');
  }  
  
  get piso() {
    return this.regForm.get('piso');
  }
  get techo() {
    return this.regForm.get('techo');
  }

  get interior() {
    return this.regForm.get('interior');
  }


  get fechas(): FormArray {
    return this.regForm.get("fechas") as FormArray
  }

  get materiales(): FormArray {
    return this.regForm.get("materiales") as FormArray
  }
  get finalizado() {
    return this.regForm.get('finalizado');
  }
  get _id() {
    return this.regForm.get('_id');
  }
  get maniobra() {
    return this.regForm.get('maniobra');
  }

  newFecha(fIni = moment().startOf('day'), hIni = '', fFin = '', hFin = ''): FormGroup {
    return this.fb.group({
      fIni: fIni,
      hIni: hIni,
      fFin: fFin,
      hFin: hFin
    })
  }

  addFecha(fIni = moment().startOf('day'), hIni = '', fFin = '', hFin = '') {
    this.fechas.push(this.newFecha(fIni, hIni, fFin, hFin));
  }

  removeFecha(i: number) {
    this.fechas.removeAt(i);
  }

  newMaterial(id = '', material = '', descripcion = '', costo = 0, precio = 0, cantidad = 1,unidadMedida = ''): FormGroup {
    return this.fb.group({
      material: material,
      descripcion: [{value:descripcion,disabled: true}],
      costo: costo,
      precio: precio,
      //cantidad: [cantidad, [this.checaStock(material)]]
      cantidad: cantidad,
      unidadMedida:  [{value:unidadMedida,disabled: true}],
      _id: id
    }, { Validators: this.checaStock2 })
  }


  checaStock(id) {
    return (control: AbstractControl): { [s: string]: any | null } => {
      // control.parent es el FormGroup
      if (this.regForm) { // en las primeras llamadas control.parent es undefined
        this._materialService.getStockMaterial(id).subscribe(res => {
          if (res.stock >= control.value) {
            console.log("si paso");
            return null;
          }
          else {
            console.log("NO HAY SUFICIENTE STOCK");

            return {
              checaStock: false
            };
          }
        });
      }
      return null;
    };
  }

  checaStock2: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    const cantidad = control.get("cantidad")
    const material = control.get("material")

    this._materialService.getStockMaterial(material.value).subscribe(res => {
      if (res.stock >= cantidad.value) {
        console.log("si paso");
        return null;
      }
      else {
        console.log("NO HAY SUFICIENTE STOCK");
        return {
          checaStock2: true
        };
      }
    });
    return null;
  }


  addMaterial(id = '', material = '', descripcion = '', costo = 0, precio = 0, cantidad = 1,unidadMedida = '') {
    this.materiales.push(this.newMaterial(id, material, descripcion, costo, precio, cantidad,unidadMedida));
  }

  addMaterial2(id: String) {
    const rep = this.listaMateriales.find(x => x._id === id);
    console.log(rep);
    this.materiales.push(this.newMaterial('', rep._id, rep.descripcion, rep.costo.$numberDecimal, rep.precio.$numberDecimal, 1, rep.unidadMedida.descripcion));
  }

  removeMaterial(i: number) {
    //
    const _id = this.materiales.controls[i].get("_id").value;
    if (_id !== "" && _id !== undefined) {
      this._mantenimientoService.eliminaMaterial(this.mantenimiento._id, _id).subscribe(res => {
        if (res.ok) this.materiales.removeAt(i);
      });
    }
    else this.materiales.removeAt(i);

  }

  saveMaterial(i: number) {
    const material: any = {
      _id: this.materiales.controls[i].get("_id").value,
      material: this.materiales.controls[i].get("material").value,
      descripcion: this.materiales.controls[i].get("descripcion").value,
      costo: this.materiales.controls[i].get("costo").value,
      precio: this.materiales.controls[i].get("precio").value,
      cantidad: this.materiales.controls[i].get("cantidad").value,
      unidadMedida: this.materiales.controls[i].get("unidadMedida").value,
    };
    this._mantenimientoService.guardaMaterial(this.mantenimiento._id, material).subscribe(res => {

    });

  }

  guardarRegistro() {
    this.regForm.controls["maniobra"].setValue(this.mantenimiento.maniobra);
    if (this.regForm.valid) {
      this._mantenimientoService.guardarMantenimiento(this.regForm.getRawValue()).subscribe(res => {
        this.regForm.get('_id').setValue(res.mantenimiento._id);
        this.regForm.markAsPristine();
        this.mensajeExito = res.mensaje;
        this.mensajeError = '';
      }, error => {
        this.mensajeExito = '';
        this.mensajeError = error.error.mensaje;
      });
      if (this.dialogR) this.close(this.regForm.value);
    };
  }



  onChangeTipoMantenimiento(event: { value: string; }) {
    if (event.value === 'LAVADO') {
      if (this.tipoLavado.value === '' || this.tipoLavado.value === undefined)
        this.regForm.controls["tipoLavado"].setValue("B");
      this.tipoLavado.enable({ onlySelf: true });

    } else {
      this.tipoLavado.disable({ onlySelf: true });
    }
    if (event.value === "ACONDICIONAMIENTO") {

      if (this.cambioGrado.value === undefined)
        this.regForm.controls["cambioGrado"].setValue(false);
      this.cambioGrado.enable({ onlySelf: true });
    } else {
      this.cambioGrado.disable({ onlySelf: true });
    }
  }

  onChangeFinaliza(event) {

    swal({
      title: '¿Esta seguro de esta acción?',
      text: event.checked ? 'El mantenimiento sera finalizado y el contenedor estara disponible ' : 'El mantenimiento quedara de nuevo en proceso y el contenedor ya no estará disponible',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(ok => {
      if (ok) {
        this._mantenimientoService
          .finalizaMantenimiento(this.mantenimiento._id, event.checked).subscribe(res => {
            this.finalizado.setValue(event.checked);
            this.mensajeExito = res.mensaje;
            this.mensajeError = '';
            this.habilitaControles();
          }, error => {
            this.mensajeError = error.error.mensaje;
            this.mensajeExito = '';
            event.source.checked = !event.checked;
            this.finalizado.setValue(!event.checked);
          });
      }
      else {
        event.source.checked = !event.checked;
        this.finalizado.setValue(!event.checked);
      }
    });
  }


  ponHora(event: any) {
    console.log(event);
    // if (this.hIni.value === undefined || this.hIni.value === '') {
    //   this.hIni.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    // }
  }
  // ponHoraFin() {
  //   if (this.hFin.value === undefined || this.hFin.value === '') {
  //     this.hFin.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
  //   }
  // }

  salir() {
    if (this.dialogR) this.close(undefined);
    else this.back()

  }
  close(result: any) {
    this.dialogRef.close(result);
  }


  back() {
    let history;
    const array = [];
    if (localStorage.getItem('historyArray')) {
      history = JSON.parse(localStorage.getItem('historyArray'));
      for (const i in history) 
        array.push(history[i]);
      this.url = array.pop();
      localStorage.setItem('historyArray', JSON.stringify(array));
    }
    this.router.navigate([this.url]);
  }



  onFileSelected(event) {
    this.filePDFFolio = <File>event.target.files[0];
    
    this._mantenimientoService.subirPDFFolio(this.mantenimiento._id,this.filePDFFolio)
      .subscribe(nombreArchivo => {
        this.fileFolio.setValue(nombreArchivo);
      });
  }

  abrePDF()
  {
    return URL_SERVICIOS + '/mantenimientos/mantenimiento/'+ this._id.value + "/descarga_pdf_folio/" + this.fileFolio.value;
  }

}
