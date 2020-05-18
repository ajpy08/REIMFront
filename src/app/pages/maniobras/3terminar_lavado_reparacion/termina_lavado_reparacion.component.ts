import { TIPOS_LAVADO_ARRAY } from './../../../config/config';
import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Lavado } from '../../../models/lavado.models';
import { ManiobraService } from '../../../services/service.index';
import { Reparacion } from '../../reparaciones/reparacion.models';
import { ReparacionService } from '../../reparaciones/reparacion.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { Location } from '@angular/common';
import * as _moment from 'moment';
import {
  ETAPAS_MANIOBRA,
  GRADOS_CONTENEDOR_ARRAY
} from '../../../config/config';
import { CoordenadaService } from '../coordenada.service';
import { Coordenada } from 'src/app/models/coordenada.models';
import swal from 'sweetalert';
import { Maniobra } from 'src/app/models/maniobra.models';
import { renderComponent } from '@angular/core/src/render3';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
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
  selector: "app-termina_lavado_reparacion",
  templateUrl: './termina_lavado_reparacion.component.html',
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
export class TerminaLavadoReparacionComponent implements OnInit {
  regForm: FormGroup;
  tiposLavado = TIPOS_LAVADO_ARRAY;
  grados = GRADOS_CONTENEDOR_ARRAY;
  tiposReparaciones: Reparacion[] = [];
  coordenadasDisponibles;
  bahias = [];
  posiciones = [];
  mensajeError = '';
  url: string;
  maniobraGuardadaEnCoordenada;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(
    public _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _reparacionService: ReparacionService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private location: Location,
    private coordenadaService: CoordenadaService
  ) {}

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
      cliente: [{ value: '', disabled: true }],
      agencia: [{ value: '', disabled: true }],
      transportista: [{ value: '', disabled: true }],
      blBooking: [{ value: '', disabled: true }],
      camion: [{ value: '', disabled: true }],
      operador: [{ value: '', disabled: true }],
      fLlegada: [{ value: '', disabled: true }],
      hLlegada: [{ value: '', disabled: true }],
      estatus: [{ value: '', disabled: true }],
      hEntrada: [{ value: '', disabled: true }],
      hSalida: [{ value: '', disabled: true }],
      lavado: [''],
      sello: [''],
      lavadoObservacion: [''],
      reparaciones: this.fb.array([this.creaReparacion('', '', 0)]),
      reparacionesObservacion: [''],
      fIniLavado: [''],
      hIniLavado: [''],
      hFinLavado: [''],
      fIniReparacion: [''],
      hIniReparacion: [''],
      fFinReparacion: [''],
      hFinReparacion: [''],
      grado: [''],
      bahia: [''],
      posicion: [''],
      // historial: this.fb.array([]),
      historial: this.fb.array([this.agregarArray(new Coordenada())])
    });
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get contenedor() {
    return this.regForm.get('contenedor');
  }

  get peso() {
    return this.regForm.get('peso');
  }

  get tipo() {
    return this.regForm.get('tipo');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get sello() {
    return this.regForm.get('sello');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get blBooking() {
    return this.regForm.get('blBooking');
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
  get hSalida() {
    return this.regForm.get('hSalida');
  }
  get lavado() {
    return this.regForm.get('lavado');
  }
  get lavadoObservacion() {
    return this.regForm.get('lavadoObservacion');
  }
  get fIniLavado() {
    return this.regForm.get('fIniLavado');
  }
  get hIniLavado() {
    return this.regForm.get('hIniLavado');
  }
  get hFinLavado() {
    return this.regForm.get('hFinLavado');
  }
  get fIniReparacion() {
    return this.regForm.get('fIniReparacion');
  }
  get hIniReparacion() {
    return this.regForm.get('hIniReparacion');
  }
  get fFinReparacion() {
    return this.regForm.get('fFinReparacion');
  }
  get hFinReparacion() {
    return this.regForm.get('hFinReparacion');
  }
  get grado() {
    return this.regForm.get('grado');
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

  creaReparacion(id: string, desc: string, costo: number): FormGroup {
    return this.fb.group({
      id: [id, [Validators.required]],
      reparacion: [desc, [Validators.required]],
      costo: [costo, [Validators.required]]
    });
  }

  addReparacion(item): void {
    const rep = this.tiposReparaciones.find(x => x._id === item);
    this.reparaciones.push(
      this.creaReparacion(rep._id, rep.reparacion, rep.costo)
    );
  }

  removeReparacion(index: number) {
    this.reparaciones.removeAt(index);
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobraConIncludes(id).subscribe(maniob => {
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      if (maniob.maniobra.agencia) {
        this.regForm.controls['agencia'].setValue(
          maniob.maniobra.agencia.nombreComercial
        );
      }
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      const blBooking =
        maniob.maniobra.solicitud !== undefined
          ? maniob.maniobra.solicitud.blBooking
          : '';
      this.regForm.controls['blBooking'].setValue(blBooking);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      if (maniob.maniobra.cliente) {
        this.regForm.controls['cliente'].setValue(
          maniob.maniobra.cliente.nombreComercial
        );
      }
      if (maniob.maniobra.transportista) {
        this.regForm.controls['transportista'].setValue(
          maniob.maniobra.transportista.nombreComercial
        );
      }
      if (maniob.maniobra.camion) {
        this.regForm.controls['camion'].setValue(maniob.maniobra.camion.placa);
      }
      if (maniob.maniobra.operador) {
        this.regForm.controls['operador'].setValue(
          maniob.maniobra.operador.nombre
        );
      }
      this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);

      if (maniob.maniobra.lavado) {
        this.regForm.controls['lavado'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavado'].setValue(undefined);
      }

      if (maniob.maniobra.sello) {
        this.regForm.controls['sello'].setValue(maniob.maniobra.sello);
      } else {
        this.regForm.controls['sello'].setValue(undefined);
      }

      if (maniob.maniobra.lavadoObservacion) {
        this.regForm.controls['lavadoObservacion'].setValue(
          maniob.maniobra.lavadoObservacion
        );
      } else {
        this.regForm.controls['lavadoObservacion'].setValue(undefined);
      }
      if (maniob.maniobra.fIniLavado) {
        this.regForm.controls['fIniLavado'].setValue(
          maniob.maniobra.fIniLavado
        );
      } else {
        this.regForm.controls['fIniLavado'].setValue(undefined);
      }
      if (maniob.maniobra.hIniLavado) {
        this.regForm.controls['hIniLavado'].setValue(
          maniob.maniobra.hIniLavado
        );
      } else {
        this.regForm.controls['hIniLavado'].setValue(undefined);
      }
      if (maniob.maniobra.hFinLavado) {
        this.regForm.controls['hFinLavado'].setValue(
          maniob.maniobra.hFinLavado
        );
      } else {
        this.regForm.controls['hFinLavado'].setValue(undefined);
      }

      if (maniob.maniobra.reparaciones) {
        maniob.maniobra.reparaciones.forEach(element => {
          this.reparaciones.push(
            this.creaReparacion(element.id, element.reparacion, element.costo)
          );
        });
      } else {
        this.regForm.controls['reparaciones'].setValue(undefined);
      }

      if (maniob.maniobra.reparacionesObservacion) {
        this.regForm.controls['reparacionesObservacion'].setValue(
          maniob.maniobra.reparacionesObservacion
        );
      } else {
        this.regForm.controls['reparacionesObservacion'].setValue(undefined);
      }

      if (maniob.maniobra.fIniReparacion) {
        this.regForm.controls['fIniReparacion'].setValue(
          maniob.maniobra.fIniReparacion
        );
      } else {
        this.regForm.controls['fIniReparacion'].setValue(undefined);
      }
      if (maniob.maniobra.hIniReparacion) {
        this.regForm.controls['hIniReparacion'].setValue(
          maniob.maniobra.hIniReparacion
        );
      } else {
        this.regForm.controls['hIniReparacion'].setValue(undefined);
      }
      if (maniob.maniobra.fFinReparacion) {
        this.regForm.controls['fFinReparacion'].setValue(
          maniob.maniobra.fFinReparacion
        );
      } else {
        this.regForm.controls['fFinReparacion'].setValue(undefined);
      }
      if (maniob.maniobra.hFinReparacion) {
        this.regForm.controls['hFinReparacion'].setValue(
          maniob.maniobra.hFinReparacion
        );
      } else {
        this.regForm.controls['hFinReparacion'].setValue(undefined);
      }
      this.regForm.controls['estatus'].setValue(maniob.maniobra.estatus);

      if (maniob.maniobra.grado) {
        this.regForm.controls['grado'].setValue(maniob.maniobra.grado);
      } else {
        this.regForm.controls['grado'].setValue(undefined);
      }

      if (maniob.maniobra.historial) {
        maniob.maniobra.historial.forEach(element => {
          this.historial.push(
            this.agregarArray(new Coordenada(element.bahia, element.posicion))
          );
        });
        this.maniobraGuardadaEnCoordenada = this.historial.value[
          this.historial.value.length - 1
        ];
      } else {
        this.regForm.controls['historial'].setValue(undefined);
      }
    });
  }

  cargarTiposReparaciones() {
    this._reparacionService.getReparaciones().subscribe(reparaciones => {
      this.tiposReparaciones = reparaciones.reparaciones;
    });
  }

  ponHoraIniLavado() {
    if (this.hIniLavado.value === undefined || this.hIniLavado.value === '') {
      this.hIniLavado.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }
  ponHoraFinLavado() {
    if (this.hFinLavado.value === undefined || this.hFinLavado.value === '') {
      this.hFinLavado.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }
  ponHoraIniReparacion() {
    if (
      this.hIniReparacion.value === undefined ||
      this.hIniReparacion.value === ''
    ) {
      this.hIniReparacion.setValue(
        this.datePipe.transform(new Date(), 'HH:mm')
      );
    }
  }
  ponHoraFinReparacion() {
    if (
      this.hFinReparacion.value === undefined ||
      this.hFinReparacion.value === ''
    ) {
      this.hFinReparacion.setValue(
        this.datePipe.transform(new Date(), 'HH:mm')
      );
    }
  }

  guardaCambios() {
    // if (this.regForm.valid) {
    //   this._maniobraService.registraFinLavRep(this.regForm.value).subscribe(res => {
    //     this.regForm.markAsPristine();
    //   });
    // }

    if (this.regForm.valid) {
      // Elimino la maniobra que tenia guardada mi coordenada para despues
      // agregar la maniobra actual
      // a la ultima coordenada del array.

      if (this.maniobraGuardadaEnCoordenada) {
        this.coordenadaService
          .getCoordenada(
            this.maniobraGuardadaEnCoordenada.bahia,
            this.maniobraGuardadaEnCoordenada.posicion
          )
          .subscribe(c => {
            if (c && c.maniobras && c.maniobras.length > 0) {
              c.maniobras.forEach(m => {
                if (m.maniobra._id === this.regForm.get('_id').value) {
                  const indice = c.maniobras.indexOf(m); // obtenemos el indice
                  c.maniobras.splice(indice, 1);
                }
              });

              this.coordenadaService.actualizaCoordenadaManiobras(c).subscribe(
                x => {},
                error => {
                  this.mensajeError = error.error.mensaje;
                }
              );
            }

            // tslint:disable-next-line: no-shadowed-variable
            const ultima = this.historial.value[this.historial.value.length - 1];
            if (ultima) {
              this.coordenadaService
                .getCoordenada(ultima.bahia, ultima.posicion)
                .subscribe(c => {
                  if (c) {
                    const maniobra = (new Maniobra()._id = this.regForm.get(
                      '_id'
                    ).value);
                    if (c.maniobras) {
                      c.maniobras.push({ maniobra });
                    } else {
                      c.maniobras = [];
                      c.maniobras.push({ maniobra });
                    }

                    this.coordenadaService
                      .actualizaCoordenadaManiobras(c)
                      .subscribe(
                        x => {},
                        error => {
                          this.mensajeError = error.error.mensaje;
                        }
                      );
                  }
                });
            }
          });
      } else {
        // tslint:disable-next-line: prefer-const
        var ultima = this.historial.value[this.historial.value.length - 1];
        if (ultima) {
          this.coordenadaService
            .getCoordenada(ultima.bahia, ultima.posicion)
            .subscribe(c => {
              if (c) {
                var maniobra = (new Maniobra()._id = this.regForm.get(
                  '_id'
                ).value);
                if (c.maniobras) {
                  c.maniobras.push({ maniobra });
                } else {
                  c.maniobras = [];
                  c.maniobras.push({ maniobra });
                }

                this.coordenadaService
                  .actualizaCoordenadaManiobras(c)
                  .subscribe(
                    x => {},
                    error => {
                      this.mensajeError = error.error.mensaje;
                    }
                  );
              }
            });
        }
      }
      this.maniobraGuardadaEnCoordenada = ultima;

      this._maniobraService
        .registraFinLavRep(this.regForm.value)
        .subscribe(
          res => {
            this.regForm.markAsPristine();
            if (res.estatus !== ETAPAS_MANIOBRA.LAVADO_REPARACION) {
              this.router.navigate([this.url]);
            }
            this.socket.emit('cambiomaniobra', res);
            this.estatus.setValue(res.estatus);
            this.ObtenCoordenadasDisponibles(this.regForm.get('_id').value);
          },
          error => {
            this.mensajeError = error.error.mensaje;
          }
        );
    }
  }

  // back() {
  //   if (localStorage.getItem('history')) {
  //     this.url = localStorage.getItem('history')
  //   }
  //   this.router.navigate([this.url]);
  //   localStorage.removeItem('history')
  //   // this.location.back();
  // }

  open(id: string, tipo: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { opcion: tipo }
    };

    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }
    }
    //Agrego mi nueva ruta a donde debo regresar al array
    array.push('/maniobras/maniobra/' + id + '/termina_lavado_reparacion');

    //sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    //Voy a pagina.
    this.router.navigate(['/fotos', id], navigationExtras);
  }

  back() {
    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }

      //Asigno a mi variable el valor del ultimo elemento del array para saber a donde regresare.
      //pop() elimina del array el ultimo elemento
      this.url = array.pop();

      //Asigno a localStorage (history) el nuevo JSON
      localStorage.setItem('historyArray', JSON.stringify(array));
    }
    localStorage.removeItem('historyArray');
    this.router.navigate([this.url]);
  }

  agregarArray(coordenada: Coordenada): FormGroup {
    return this.fb.group({
      bahia: [coordenada.bahia],
      posicion: [coordenada.posicion]
    });
  }

  addCoordenada(bahia: string, posicion: string): void {
    var coordenadaActual = this.historial.value[
      this.historial.value.length - 1
    ];
    var ocupadoActual = 0;
    if (coordenadaActual) {
      this.coordenadaService
        .getCoordenada(coordenadaActual.bahia, coordenadaActual.posicion)
        .subscribe(c => {
          if (c && c.maniobras && c.maniobras.length > 0) {
            c.maniobras.forEach(m => {
              ocupadoActual += parseInt(m.maniobra.tipo.substring(0, 2));
            });
          }
        });

      var tiene = false;
      var letraPosicion = coordenadaActual.posicion.substring(0, 1);
      var nivelPosicion = coordenadaActual.posicion.substring(
        1,
        coordenadaActual.posicion.length
      );

      var coordenadaSig = new Coordenada(
        coordenadaActual.bahia,
        letraPosicion + (parseInt(nivelPosicion) + 1)
      );
      this.coordenadaService
        .getCoordenada(coordenadaSig.bahia, coordenadaSig.posicion)
        .subscribe(c => {
          if (c && c.maniobras && c.maniobras.length > 0) {
            c.maniobras.forEach(m => {
              var restante = c.tipo - parseInt(m.maniobra.tipo.substring(0, 2));
              if (ocupadoActual <= restante) {
                tiene = true;
              }
            });
          }

          if (tiene) {
            swal(
              'No puedes agregar esta coordenada por que la posición (Bahía: ' +
                coordenadaActual.bahia +
                ' Posición: ' +
                coordenadaActual.posicion +
                ') contiene contenedores en sus niveles superiores',
              '',
              'error'
            );
          } else {
            var coordenada = new Coordenada(bahia, posicion);
            var tmp = this.historial.value.filter(
              c => c.bahia == bahia && c.posicion == posicion
            );

            if (
              coordenadaActual.bahia == bahia &&
              coordenadaActual.posicion == posicion
            ) {
              swal('Ya se encuentra en esta coordenada', '', 'error');
            } else {
              if (bahia === '' || posicion === '') {
                swal(
                  'Error al Agregar',
                  'No puede estar vacio ningun campo',
                  'error'
                );
              } else {
                this.historial.push(this.agregarArray(coordenada));
              }

              this.bahia.setValue('');
              this.posicion.setValue('');
            }
          }
        });
    } else {
      var coordenada = new Coordenada(bahia, posicion);
      if (bahia === '' || posicion === '') {
        swal('Error al Agregar', 'No puede estar vacio ningun campo', 'error');
      } else {
        this.historial.push(this.agregarArray(coordenada));
      }
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
    var coordenadaActual = this.historial.value[indice];
    var ocupadoActual = 0;
    this.coordenadaService
      .getCoordenada(coordenadaActual.bahia, coordenadaActual.posicion)
      .subscribe(c => {
        if (c && c.maniobras && c.maniobras.length > 0) {
          c.maniobras.forEach(m => {
            ocupadoActual += parseInt(m.maniobra.tipo.substring(0, 2));
          });
        }

        var tiene = false;
        var letraPosicion = coordenadaActual.posicion.substring(0, 1);
        var nivelPosicion = coordenadaActual.posicion.substring(
          1,
          coordenadaActual.posicion.length
        );

        var coordenadaSig = new Coordenada(
          coordenadaActual.bahia,
          letraPosicion + (parseInt(nivelPosicion) + 1)
        );
        this.coordenadaService
          .getCoordenada(coordenadaSig.bahia, coordenadaSig.posicion)
          .subscribe(c => {
            if (c && c.maniobras && c.maniobras.length > 0) {
              c.maniobras.forEach(m => {
                var restante =
                  c.tipo - parseInt(m.maniobra.tipo.substring(0, 2));
                if (ocupadoActual <= restante) {
                  tiene = true;
                }
              });
            }
            if (tiene) {
              swal(
                'No puedes eliminar esta coordenada por que tiene contenedores en sus niveles superiores',
                '',
                'error'
              );
            } else {
              this.historial.removeAt(indice);
            }
          });
      });
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
    this.coordenadaService
      .getCoordenadasDisponibles(maniobra)
      .subscribe(coordenadas => {
        this.coordenadasDisponibles = coordenadas.coordenadas;
        for (var g in this.coordenadasDisponibles) {
          this.bahias.push(g);
        }
      });
  }

  obtenPosicionesXBahia(bahia) {
    this.posiciones = this.coordenadasDisponibles[bahia];
    var tipoManiobra = this.tipo.value.toString().substring(0, 2);
    this.posiciones = this.posiciones.filter(p => p.tipo >= tipoManiobra);
  }
}
