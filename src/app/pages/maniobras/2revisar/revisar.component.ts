import { TIPOS_LAVADO_ARRAY, TIPOS_MANTENIMIENTO_ARRAY } from '../../../config/config';
import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ManiobraService } from '../../../services/service.index';
import { Reparacion } from '../../reparaciones/reparacion.models';
import { ReparacionService } from '../../reparaciones/reparacion.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ETAPAS_MANIOBRA, GRADOS_CONTENEDOR_ARRAY } from '../../../config/config';
import swal from 'sweetalert';
import { Coordenada } from 'src/app/models/coordenada.models';
import { CoordenadaService } from '../coordenada.service';
import { Maniobra } from 'src/app/models/maniobra.models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { MantenimientoComponent } from '../mantenimientos/mantenimiento.component';
import {MantenimientoService} from '../../../services/service.index'
@Component({
  selector: 'app-revisar',
  templateUrl: './revisar.component.html',
  providers: [DatePipe]
})

export class RevisarComponent implements OnInit {
  regForm: FormGroup;
  tiposLavado = TIPOS_LAVADO_ARRAY;
  tiposMantenimento = TIPOS_MANTENIMIENTO_ARRAY;
  listaMantenimientos;
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
    public _mantenimientoService: MantenimientoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _reparacionService: ReparacionService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private coordenadaService: CoordenadaService, 
    public matDialog: MatDialog
    ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    this.createFormGroup();
    this.cargarManiobra(id);
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
      sello: [{ value: '', disable: true }],
      hSalida: [''],
      hDescarga: [''],
      descargaAutorizada: [{ value: '', disabled: true }],
      grado: [''],
      bahia: [''],
      posicion: [''],
      // historial: this.fb.array([this.agregarArray(new Coordenada)], { validators: Validators.required })
      historial: this.fb.array([this.agregarArray(new Coordenada)])
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
  get sello() {
    return this.regForm.get('sello');
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
      this.regForm.controls['sello'].setValue(maniob.maniobra.sello);
      this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      this.regForm.controls['estatus'].setValue(maniob.maniobra.estatus);
      this.regForm.controls['grado'].setValue(maniob.maniobra.grado);
      this.regForm.controls['hDescarga'].setValue(maniob.maniobra.hDescarga);
      this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);
      this.regForm.controls['descargaAutorizada'].setValue(maniob.maniobra.descargaAutorizada);
      if (maniob.maniobra.historial) {
        maniob.maniobra.historial.forEach(element => {
          this.historial.push(this.agregarArray(new Coordenada(element.bahia, element.posicion)));
        });
        this.maniobraGuardadaEnCoordenada = this.historial.value[this.historial.value.length - 1];
      } else {
        this.regForm.controls['historial'].setValue(undefined);
      }
      this.cargaMantenimientos(maniob.maniobra._id);
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
      // Elimino la maniobra que tenia guardada mi coordenada para despues agregar la maniobra actual
      // a la ultima coordenada del array.

      if (this.maniobraGuardadaEnCoordenada) {
        this.coordenadaService.getCoordenada(this.maniobraGuardadaEnCoordenada.bahia,
          this.maniobraGuardadaEnCoordenada.posicion).subscribe(c => {
            if (c && c.maniobras && c.maniobras.length > 0) {
              c.maniobras.forEach(m => {
                if (m.maniobra._id === this.regForm.get('_id').value) {
                  const indice = c.maniobras.indexOf(m); // obtenemos el indice
                  c.maniobras.splice(indice, 1);
                }
              });

              this.coordenadaService.actualizaCoordenadaManiobras(c).subscribe(x => {
              }, error => {
                this.mensajeError = error.error.mensaje;
              });
            }

            var ultima = this.historial.value[this.historial.value.length - 1];
            if (ultima) {
              this.coordenadaService.getCoordenada(ultima.bahia, ultima.posicion).subscribe(cor => {

                if (cor) {
                  const maniobra = new Maniobra()._id = this.regForm.get('_id').value;
                  if (cor.maniobras) {
                    cor.maniobras.push({ maniobra });
                  } else {
                    cor.maniobras = [];
                    cor.maniobras.push({ maniobra });
                  }

                  this.coordenadaService.actualizaCoordenadaManiobras(cor).subscribe(x => {
                  }, error => {
                    this.mensajeError = error.error.mensaje;
                  });
                }
              });
            }
          });
      } else {
        var ultima = this.historial.value[this.historial.value.length - 1];
        if (ultima) {
          this.coordenadaService.getCoordenada(ultima.bahia, ultima.posicion).subscribe(c => {
            if (c) {
              const maniobra = new Maniobra()._id = this.regForm.get('_id').value;
              if (c.maniobras) {
                c.maniobras.push({ maniobra });
              } else {
                c.maniobras = [];
                c.maniobras.push({ maniobra });
              }

              this.coordenadaService.actualizaCoordenadaManiobras(c).subscribe(x => {
              }, error => {
                this.mensajeError = error.error.mensaje;
              });
            }
          });
        }
      }

      this.maniobraGuardadaEnCoordenada = ultima;

      this._maniobraService.registraLavRepDescarga(this.regForm.value).subscribe(res => {
        this.socket.emit('cambiomaniobra', res);
        this.regForm.markAsPristine();
        if (res.estatus !== ETAPAS_MANIOBRA.REVISION) {
          this.router.navigate([this.url]);
        }
        this.estatus.setValue(res.estatus);

        this.ObtenCoordenadasDisponibles(this.regForm.get('_id').value);
      }, error => {
        this.mensajeError = error.error.mensaje;
      });
    }
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('historyArray');
    localStorage.removeItem('history');
    // this.location.back();
  }

  agregarArray(coordenada: Coordenada): FormGroup {
    return this.fb.group({
      bahia: [coordenada.bahia],
      posicion: [coordenada.posicion]
    });
  }

  addCoordenada(bahia: string, posicion: string): void {
    const coordenadaActual = this.historial.value[this.historial.value.length - 1];
    let ocupadoActual = 0;
    if (coordenadaActual) {
      this.coordenadaService.getCoordenada(coordenadaActual.bahia, coordenadaActual.posicion).subscribe(c => {
        if (c && c.maniobras && c.maniobras.length > 0) {
          c.maniobras.forEach(m => {
            // tslint:disable-next-line: radix
            ocupadoActual += parseInt(m.maniobra.tipo.substring(0, 2));
          });
        }
      });

      let tiene = false;
      const letraPosicion = coordenadaActual.posicion.substring(0, 1);
      const nivelPosicion = coordenadaActual.posicion.substring(1, coordenadaActual.posicion.length);

      // tslint:disable-next-line: radix
      const coordenadaSig = new Coordenada(coordenadaActual.bahia, letraPosicion + (parseInt(nivelPosicion) + 1));
      this.coordenadaService.getCoordenada(coordenadaSig.bahia, coordenadaSig.posicion).subscribe(c => {
        if (c && c.maniobras && c.maniobras.length > 0) {
          c.maniobras.forEach(m => {
            // tslint:disable-next-line: radix
            const restante = c.tipo - parseInt(m.maniobra.tipo.substring(0, 2));
            if (ocupadoActual <= restante) {
              tiene = true;
            }
          });
        }

        if (tiene) {
          swal('No puedes agregar esta coordenada por que la posición (Bahía: ' +
            coordenadaActual.bahia + ' Posición: ' + coordenadaActual.posicion + ') contiene contenedores en sus niveles superiores', '', 'error');
        } else {
          const coordenada = new Coordenada(bahia, posicion);
          const tmp = this.historial.value.filter(cor => cor.bahia === bahia && cor.posicion === posicion);


          if (coordenadaActual.bahia === bahia && coordenadaActual.posicion === posicion) {
            swal('Ya se encuentra en esta coordenada', '', 'error');
          } else {
            if (bahia === '' || posicion === '') {
              swal('Error al Agregar', 'No puede estar vacio ningun campo', 'error');
            } else {

              this.historial.push(this.agregarArray(coordenada));
            }

            this.bahia.setValue('');
            this.posicion.setValue('');
          }
        }
      });
    } else {
      const coordenada = new Coordenada(bahia, posicion);
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
    const coordenadaActual = this.historial.value[indice];
    let ocupadoActual = 0;
    this.coordenadaService.getCoordenada(coordenadaActual.bahia, coordenadaActual.posicion).subscribe(c => {
      if (c && c.maniobras && c.maniobras.length > 0) {
        c.maniobras.forEach(m => {
          // tslint:disable-next-line: radix
          ocupadoActual += parseInt(m.maniobra.tipo.substring(0, 2));
        });
      }


      let tiene = false;
      const letraPosicion = coordenadaActual.posicion.substring(0, 1);
      const nivelPosicion = coordenadaActual.posicion.substring(1, coordenadaActual.posicion.length);

      // tslint:disable-next-line: radix
      const coordenadaSig = new Coordenada(coordenadaActual.bahia, letraPosicion + (parseInt(nivelPosicion) + 1));
      this.coordenadaService.getCoordenada(coordenadaSig.bahia, coordenadaSig.posicion).subscribe(cor => {
        if (cor && cor.maniobras && cor.maniobras.length > 0) {
          cor.maniobras.forEach(m => {
            // tslint:disable-next-line: radix
            const restante = cor.tipo - parseInt(m.maniobra.tipo.substring(0, 2));
            if (ocupadoActual <= restante) {
              tiene = true;
            }
          });
        }
        if (tiene) {
          swal('No puedes eliminar esta coordenada por que tiene contenedores en sus niveles superiores', '', 'error');
        } else {
          this.historial.removeAt(indice);
        }
      });
    });
  }



  ObtenCoordenadasDisponibles(maniobra?: string) {
    this.coordenadaService.getCoordenadasDisponibles(maniobra).subscribe(coordenadas => {
      this.coordenadasDisponibles = coordenadas.coordenadas;
      // tslint:disable-next-line: forin
      for (const g in this.coordenadasDisponibles) {
        this.bahias.push(g);
      }
    });
  }

  obtenPosicionesXBahia(bahia) {
    this.posiciones = this.coordenadasDisponibles[bahia];
    const tipoManiobra = this.tipo.value.toString().substring(0, 2);
    this.posiciones = this.posiciones.filter(p => p.tipo >= tipoManiobra);
  }

  open(id: string, tag: string) {
    let history;
    const array = [];
    // Si tengo algo en localStorage en la variable history lo obtengo
    if (localStorage.getItem('historyArray')) {
      // asigno a mi variable historyArray lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      // realizo este ciclo para asignar los valores del JSON al Array
      // tslint:disable-next-line: forin
      for (const i in history) {
        array.push(history[i]);
      }
    }
    // Agrego mi nueva ruta al array
    array.push('/maniobras/maniobra/' + id + '/' + tag);


    //// sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    // Voy a pagina.
    this.router.navigate(['/reparaciones/reparacion/nuevo']);

  }


  cargaMantenimientos(id:string): void {
    this._mantenimientoService.getMantenimientosxManiobra(id).subscribe(mantenimientos => {
      this.listaMantenimientos = mantenimientos.mantenimientos;
    });

  }
  openDialogMantenimiento(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {_id:id,maniobra:this.regForm.get('_id').value};
    const dialogRef = this.matDialog.open(MantenimientoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(detalle => {
      if (detalle) {
        this.cargaMantenimientos(this.regForm.get('_id').value);
      }
    });
  }

  removeMantenimiento(id: string) {
    this._mantenimientoService.eliminaMantenimiento(id).subscribe(mantenimientos => {
      this.cargaMantenimientos(this.regForm.get('_id').value);
    });
  }

}


