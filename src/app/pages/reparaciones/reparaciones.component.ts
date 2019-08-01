import { Component, OnInit } from '@angular/core';
import { Reparacion } from 'src/app/models/reparacion.models';
import { ReparacionService } from 'src/app/services/reparacion/reparacion.service';
declare var swal: any;
@Component({
  selector: 'app-reparaciones',
  templateUrl: './reparaciones.component.html',
  styleUrls: []
})
export class ReparacionesComponent implements OnInit {
  reparaciones: Reparacion[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;

  constructor(public reparacionService: ReparacionService) { }

  ngOnInit() {
    this.cargarReparaciones();
  }

  cargarReparaciones() {
    this.cargando = true;
    this.reparacionService.getReparaciones(this.desde).subscribe((reparaciones) => {
      this.totalRegistros = reparaciones.total,
        this.reparaciones = reparaciones.reparaciones,
        this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarReparaciones();
  }

  buscarReparacion(termino: string) {
    if (termino.length <= 0) {
      this.cargarReparaciones();
      return;
    }
    this.cargando = true;
    this.reparacionService.buscarReparacion(termino).subscribe((reparaciones: Reparacion[]) => {
      this.reparaciones = reparaciones;
      this.cargando = false;
    });
  }

  borrarReparacion(reparacion: Reparacion) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + reparacion.descripcion,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((borrar) => {
      if (borrar) {
        this.reparacionService.borrarReparacion(reparacion._id).subscribe(() => {
          this.cargarReparaciones();
        });
      }
    });
  }
}
