import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Lavado } from '../../../models/lavado.models';
import { ManiobraService } from '../../../services/service.index';
import { Reparacion } from '../../reparaciones/reparacion.models';
import { ReparacionService } from '../../reparaciones/reparacion.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ETAPAS_MANIOBRA, GRADOS_CONTENEDOR_ARRAY } from '../../../config/config';
import { Location } from '@angular/common';
import swal from 'sweetalert';
import { Coordenada } from 'src/app/models/coordenada.models';
import { CoordenadaService } from '../coordenada.service';
import { Maniobra } from 'src/app/models/maniobra.models';

@Component({
  selector: 'app-revisar',
  templateUrl: './revisar.component.html',
  providers: [DatePipe]
})

export class RevisarComponent implements OnInit {
  regForm: FormGroup;
  tiposLavado: Lavado[] = [new Lavado('B', 'Basico'), new Lavado('E', 'Especial')];
  grados = GRADOS_CONTENEDOR_ARRAY;
  tiposReparaciones: Reparacion[] = [];
  coordenadasDisponibles;
  bahias = [];
  posiciones = [];
  mensajeError = '';
  url: string;
  maniobraGuardadaEnCoordenada;

  constructor(
    public _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _reparacionService: ReparacionService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private coordenadaService: CoordenadaService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarTiposReparaciones();
    this.createFormGroup();
    this.cargarManiobra(id);
    this.reparaciones.removeAt(0);
    this.historial.removeAt(0);
    this.ObtenCoordenadasDisponibles(id);

    this.url = '/maniobras';
  }
  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      contenedor: [{ value: '', disabled: true }],
      tipo: [{ value: '', disabled: true }],
      peso: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      agencia: [{ value: '', disabled: true }],
      transportista: [{ value: '', disabled: true }],
      camion: [{ value: '', disabled: true }],
      operador: [{ value: '', disabled: true }],
      fLlegada: [{ value: '', disabled: true }],
      hLlegada: [{ value: '', disabled: true }],
      hEntrada: [{ value: '', disabled: true }],
      estatus: [{ value: '', disabled: true }],
      sello:[{value: '', disable: true}],
      hSalida: [''],
      hDescarga: [''],
      descargaAutorizada: [{ value: '', disabled: true }],
      grado: [''],
      lavado: [''],
      lavadoObservacion: [''],
      reparaciones: this.fb.array([this.creaReparacion('', '', 0)]),
      reparacionesObservacion: [''],
      bahia: [''],
      posicion: [''],
      // historial: this.fb.array([]),
      historial: this.fb.array([this.agregarArray(new Coordenada)], { validators: Validators.required })
    });
  }

  /* #region  Propiedades */
  get _id() {
    return this.regForm.get('_id');
  }
  get contenedor() {
    return this.regForm.get('contenedor');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get peso() {
    return this.regForm.get('peso');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get transportista() {
    return this.regForm.get('transportista');
  }
  get camion() {
    return this.regForm.get('camion');
  }
  get operador() {
    return this.regForm.get('operador');
  }
  get fLlegada() {
    return this.regForm.get('fLlegada');
  }
  get hLlegada() {
    return this.regForm.get('hLlegada');
  }
  get hEntrada() {
    return this.regForm.get('hEntrada');
  }
  get estatus() {
    return this.regForm.get('estatus');
  }
  get descargaAutorizada() {
    return this.regForm.get('descargaAutorizada');
  }
  get hDescarga() {
    return this.regForm.get('hDescarga');
  }
  get hSalida() {
    return this.regForm.get('hSalida');
  }
  get grado() {
    return this.regForm.get('grado');
  }
  get lavado() {
    return this.regForm.get('lavado');
  }
  get lavadoOperacion() {
    return this.regForm.get('lavadoOperacion');
  }
  get reparaciones() {
    return this.regForm.get('reparaciones') as FormArray;
  }
  get reparacionesObservacion() {
    return this.regForm.get('reparacionesObservacion');
  }
  get bahia() {
    return this.regForm.get('bahia');
  }
  get posicion() {
    return this.regForm.get('posicion');
  }
  get historial() {
    return this.regForm.get('historial') as FormArray;
  }
  /* #endregion */

  creaReparacion(id: string, desc: string, costo: number): FormGroup {
    return this.fb.group({
      id: [id, [Validators.required]],
      reparacion: [desc, [Validators.required]],
      costo: [costo, [Validators.required]]
    });
  }

  addReparacion(item): void {
    const rep = this.tiposReparaciones.find(x => x._id === item);
    this.reparaciones.push(this.creaReparacion(rep._id, rep.descripcion, rep.costo));
  }

  removeReparacion(index: number) {
    this.reparaciones.removeAt(index);
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobraConIncludes(id).subscribe(maniob => {
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      if (maniob.maniobra.agencia) {
        this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia.nombreComercial);
      }
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      this.regForm.controls['peso'].setValue(maniob.maniobra.peso);
      if (maniob.maniobra.cliente) {
        this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente.nombreComercial);
      }
      if (maniob.maniobra.transportista) {
        this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista.nombreComercial);
      }
      if (maniob.maniobra.camion) {
        this.regForm.controls['camion'].setValue(maniob.maniobra.camion.placa);
      }
      if (maniob.maniobra.operador) {
        this.regForm.controls['operador'].setValue(maniob.maniobra.operador.nombre);
      }


      this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      this.regForm.controls['estatus'].setValue(maniob.maniobra.estatus);

      if (maniob.maniobra.lavado) {
        this.regForm.controls['lavado'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavado'].setValue(undefined);
      }
      if (maniob.maniobra.lavadoObservacion) {
        this.regForm.controls['lavadoObservacion'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavadoObservacion'].setValue(undefined);
      }
      if (maniob.maniobra.reparaciones) {
        maniob.maniobra.reparaciones.forEach(element => {
          this.reparaciones.push(this.creaReparacion(element.id, element.reparacion, element.costo));
        });
      } else {
        this.regForm.controls['reparaciones'].setValue(undefined);
      }
      if (maniob.maniobra.reparacionesObservacion) {
        this.regForm.controls['reparacionesObservacion'].setValue(maniob.maniobra.reparacionesObservacion);
      } else {
        this.regForm.controls['reparacionesObservacion'].setValue(undefined);
      }
      this.regForm.controls['grado'].setValue(maniob.maniobra.grado);
      this.regForm.controls['hDescarga'].setValue(maniob.maniobra.hDescarga);
      this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);
      this.regForm.controls['descargaAutorizada'].setValue(maniob.maniobra.descargaAutorizada);

      if (maniob.maniobra.historial) {
        maniob.maniobra.historial.forEach(element => {
          this.historial.push(this.agregarArray(new Coordenada(element.bahia, element.posicion)));
        });
        this.maniobraGuardadaEnCoordenada = this.historial.value[this.historial.value.length - 1]
      } else {
        this.regForm.controls['historial'].setValue(undefined);
      }
      // if (this.descargaAutorizada.value === false) {
      //   this.hDescarga.disable();
      //   this.hSalida.disable();
      // }

    });
  }

  cargarTiposReparaciones() {
    this._reparacionService.getReparaciones().subscribe((reparaciones) => {
      this.tiposReparaciones = reparaciones.reparaciones;
    });
  }

  ponHoraDescarga() {
    if (this.hDescarga.value === undefined || this.hDescarga.value === '') {
      this.hDescarga.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }
  ponHoraSalida() {
    if (this.hSalida.value === undefined || this.hSalida.value === '') {
      this.hSalida.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }

  guardaCambios() {
    if (this.regForm.valid) {
      //Elimino la maniobra que tenia guardada mi coordenada para despues agregar la maniobra actual
      //a la ultima coordenada del array.

      if (this.maniobraGuardadaEnCoordenada) {
        this.coordenadaService.getCoordenada(this.maniobraGuardadaEnCoordenada.bahia,
          this.maniobraGuardadaEnCoordenada.posicion).subscribe(c => {
            if (c.maniobras) {
              c.maniobras.forEach(m => {
                if (m.maniobra == this.regForm.get('_id').value) {
                  var indice = c.maniobras.indexOf(m); // obtenemos el indice
                  c.maniobras.splice(indice, 1);
                }
              });
            }

            this.coordenadaService.actualizaCoordenadaManiobras(c).subscribe(x => {
            }, error => {
              this.mensajeError = error.error.mensaje;
            });
          });
      }

      var ultima = this.historial.value[this.historial.value.length - 1]
      if (ultima) {
        this.coordenadaService.getCoordenada(ultima.bahia, ultima.posicion).subscribe(c => {

          var maniobra = new Maniobra()._id = this.regForm.get('_id').value;
          if (c.maniobras) {
            c.maniobras.push({ maniobra });
          } else {
            c.maniobras = [];
            c.maniobras.push({ maniobra })
          }

          this.coordenadaService.actualizaCoordenadaManiobras(c).subscribe(x => {
          }, error => {
            this.mensajeError = error.error.mensaje;
          });
        });
      }

      this.maniobraGuardadaEnCoordenada = ultima;

      this._maniobraService.registraLavRepDescarga(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
        if (res.estatus !== ETAPAS_MANIOBRA.REVISION) {
          this.router.navigate([this.url]);
        }
        this.estatus.setValue(res.estatus);
      }, error => {
        this.mensajeError = error.error.mensaje;
      });
    }
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
    // this.location.back();
  }

  agregarArray(coordenada: Coordenada): FormGroup {
    return this.fb.group({
      bahia: [coordenada.bahia],
      posicion: [coordenada.posicion]
    })
  }

  addCoordenada(bahia: string, posicion: string): void {
    var coordenada = new Coordenada(bahia, posicion);

    var tmp = this.historial.value.filter(c => c.bahia == bahia && c.posicion == posicion);

    if (tmp && tmp.length > 0) {
      swal('Ya se encuentra en esta coordenada', '', 'error');
    } else {
      this.historial.push(this.agregarArray(coordenada));
      this.bahia.setValue('');
      this.posicion.setValue('');
    }
  }

  quit(control: AbstractControl) {
    if (!control.valid) {
      control.setValue('');
    }
  }

  quitar(indice: number) {
    this.historial.removeAt(indice);
  }

  /* #region  Array de Arrays Javi */
  ////////////////////////////////////////////////////////
  //https://stackblitz.com/edit/angular-dffny7?file=app%2Fapp.component.ts

  // addNewHistorial() {
  //   let control = <FormArray>this.regForm.controls.historial;
  //   control.push(
  //     this.fb.group({
  //       // nested form array, you could also add a form group initially
  //       coordenadas: this.fb.array([])
  //     })
  //   )
  // }

  // deleteHistorial(index) {
  //   let control = <FormArray>this.regForm.controls.historial;
  //   control.removeAt(index)
  // }

  // addNewCoordenada(control) {
  //   control.push(
  //     this.fb.group({
  //       coordenada: ['']
  //     }))
  // }

  // deleteCoordenada(control, index) {
  //   control.removeAt(index)
  // }

  //////////////////////////////////////////////////////
  /* #endregion */

  ObtenCoordenadasDisponibles(maniobra?: string) {
    this.coordenadaService.getCoordenadasDisponibles(maniobra).subscribe(coordenadas => {
      this.coordenadasDisponibles = coordenadas.coordenadas;
      for (var g in this.coordenadasDisponibles) {
        this.bahias.push(g);
      }
    });
  }

  obtenPosicionesXBahia(bahia) {
    this.posiciones = this.coordenadasDisponibles[bahia];
    var tipoManiobra = this.tipo.value.toString().substring(0, 2)
    this.posiciones = this.posiciones.filter(p => p.tipo >= tipoManiobra)
  }
}
