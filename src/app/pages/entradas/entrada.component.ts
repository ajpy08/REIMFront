import { ProveedorService } from './../proveedores/proveedor.service';
import { DetalleComponent } from './detalle.component';
import { Material } from './../materiales/material.models';
import { DetalleMaterial } from './detalleMaterial.models';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Entrada } from './entrada.models';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { ROLES } from 'src/app/config/config';
import { Usuario } from '../usuarios/usuario.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
// import swal from 'sweetalert';
import * as _moment from 'moment';
import { EntradaService } from './entrada.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Proveedor } from '../proveedores/proveedor.models';
import { DetalleMaterialService } from './detalleMaterial.service';
const moment = _moment;
declare var swal: any;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L'],
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class EntradaComponent implements OnInit {
  regForm: FormGroup;
  entrada: Entrada = new Entrada();
  usuarioLogueado: Usuario;
  url: string;
  materiales: Material[] = [];
  proveedores: Proveedor[] = [];
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  id;
  idSelect;
  indiceSelect;
  ObjetoSelect = [];
  detallesSelect = new SelectionModel<DetalleMaterial>(true, []);

  constructor(
    public entradaService: EntradaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private usuarioService: UsuarioService,
    public matDialog: MatDialog,
    private proveedorService: ProveedorService,
    private detalleMaterialService: DetalleMaterialService
  ) { }

  ngOnInit() {
    this.createFormGroup();
    this.entrada = new Entrada();
    this.usuarioLogueado = this.usuarioService.usuario;

    this.proveedorService.getProveedores(true).subscribe(proveedores => {
      this.proveedores = proveedores.proveedores;
    });

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id !== 'nuevo') {
      this.cargarEntrada(this.id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        if (control.toString() !== 'detalles') {
          this.regForm.controls[control.toString()].setValue(undefined);
        }
      }

      const timeZone = moment().format('Z');
      const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
      this.fFactura.setValue(fecha);
    }

    this.url = '/entradas';

    /* #region  SOCKETS */
    this.socket.on('update-entrada', function (data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        if (data.data._id) {
          this.createFormGroup();
          this.cargarEntrada(data.data._id);
          if (data.data.usuarioMod !== undefined && data.data.usuarioMod !== this.usuarioLogueado._id) {
            swal({
              title: 'Actualizado',
              text: 'Otro usuario ha actualizado este entrada',
              icon: 'info'
            });
          }
        }
      }
    }.bind(this));

    this.socket.on('delete-entrada', function () {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.router.navigate(['/entradas']);
        swal({
          title: 'Eliminado',
          text: 'Se elimino este entrada por otro usuario',
          icon: 'warning'
        });

      }
    }.bind(this));
    /* #endregion */

    this.detalles.removeAt(0);
  }

  ngOnDestroy() {
    this.socket.removeListener('delete-entrada');
    this.socket.removeListener('update-entrada');
  }

  cargarEntrada(id: string) {
    let detalles;
    this.entradaService.getEntrada(id)
      .subscribe(res => {
        this.entrada = res;
        // tslint:disable-next-line: forin
        for (const propiedad in this.entrada) {
          for (const control in this.regForm.controls) {
            if (propiedad === control.toString() && propiedad != 'detalles') {
              this.regForm.controls[propiedad].setValue(res[propiedad]);
            } else {
              if (propiedad === control.toString() && propiedad === 'detalles') {
                this.detalles.removeAt(this.detalles.value.findIndex(d => d.material !== undefined));
                detalles = res[propiedad];

                if (detalles !== undefined) {

                  detalles.forEach(det => {
                    if (det.detalle !== null && det.detalle !== undefined) {
                      for (const prop in det.detalle) {
                        if (det.detalle[prop].$numberDecimal) {
                          det.detalle[prop] = parseFloat(det.detalle[prop].$numberDecimal);
                        }
                      }
                      this.detalles.push(this.agregarArray(det.detalle));
                    }
                  });
                }
              }
            }
          }
        }
      });
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      noFactura: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      fFactura: ['', [Validators.required]],
      detalles: this.fb.array([this.agregarArray(new DetalleMaterial)], { validators: Validators.required }),
      _id: [''],
      usuarioMod: ['']
    });
  }

  agregarArray(doc: DetalleMaterial): FormGroup {
    return this.fb.group({
      _id: [doc._id],
      material: [doc.material],
      cantidad: [doc.cantidad],
      costo: [doc.costo],
      entrada: [doc.entrada]
    });
  }

  guardarEntrada() {
    if (this.regForm.valid) {
      // console.log(this.regForm.value);
      this.entradaService.guardarEntrada(this.regForm.value)
        .subscribe(res => {
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.socket.emit('newentrada', res);
            this.router.navigate(['/entradas/entrada', this.regForm.get('_id').value]);
          } else {
            this.socket.emit('updateentrada', res);
          }
          this.regForm.markAsPristine();
        });
    }
  }

  onChange(objeto, indice, event) {
    let pos = 0;
    this.ObjetoSelect = [];
    if (event.checked === true) {
      this.idSelect = objeto;
      this.ObjetoSelect.push({ detalle: objeto, indice: indice });
    } else if (this.ObjetoSelect.length > 0) {
      pos = this.ObjetoSelect.findIndex(a => a.maniobra.maniobras[0] === objeto.maniobras[0] && a.maniobra._id === objeto._id);
      this.ObjetoSelect.splice(pos, 1);
      this.ObjetoSelect.length === 0 ? this.idSelect = undefined : this.idSelect = this.ObjetoSelect[0].maniobra;
    }
  }

  openDialogDetalle() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.detallesSelect;
    const dialogRef = this.matDialog.open(DetalleComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(detalle => {
      if (detalle) {
        if (this.id !== 'nuevo') {
          detalle.entrada = this.id;
          this.detalleMaterialService.guardarDetalleMaterial(detalle).subscribe(() => {
            this.socket.emit('updateentrada', this.entrada);
            this.regForm.markAsPristine();
          });
        } else {
          this.detalles.push(this.agregarArray(detalle));
          this.regForm.markAsDirty();
        }
      }
    });
  }
  quitar(element) {
    if (this.id !== 'nuevo') {
      const detalle = element[0].detalle;
      if (element.length > 1) {
        if (detalle._id !== '' && detalle._id !== undefined && detalle._id !== null) {
          swal({
            title: '¿Esta seguro?',
            text: 'Esta apunto de borrar a ' + detalle.material.descripcion,
            icon: 'warning',
            buttons: true,
            dangerMode: true
          }).then(borrar => {
            if (borrar) {
              this.detalleMaterialService.borrarDetalleMaterial(detalle).subscribe(detalleEliminado => {
                this.socket.emit('updateentrada', this.entrada);
              });
            }
          });
        }
        else {
          if (element !== undefined && element.length > 0) {
            element.forEach(i => {
              this.detalles.removeAt(i.indice);
              this.regForm.markAsDirty();
            });
          } else {
            swal('Error', 'Selecciona un detalle', 'error');
          }
        }
        this.ObjetoSelect = [];
      }
      else {
        swal('Error', 'La entrada debe contener por lo menos un detalle', 'error');
      }
    }
  }

  modifica(detalle) {
    if (detalle !== undefined && detalle.length > 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new SelectionModel<DetalleMaterial>(true, detalle);
      const dialogRef = this.matDialog.open(DetalleComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(detalleMod => {
        if (detalleMod) {
          this.detalleMaterialService.guardarDetalleMaterial(detalleMod).subscribe(() => {
            this.socket.emit('updateentrada', this.entrada);
            this.regForm.markAsPristine();
          });
        }
      });
    } else {
      swal('Error', 'Selecciona un detalle', 'error');
    }
    this.ObjetoSelect = [];
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }

  /* #region Properties */

  get _id() {
    return this.regForm.get('_id');
  }

  get noFactura() {
    return this.regForm.get('noFactura');
  }

  get proveedor() {
    return this.regForm.get('proveedor');
  }

  get fFactura() {
    return this.regForm.get('fFactura');
  }

  get detalles() {
    return this.regForm.get('detalles') as FormArray;
  }

  get usuarioMod() {
    return this.regForm.get('usuarioMod');
  }

  /* #endregion */

}
