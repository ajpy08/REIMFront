import { Component, OnInit } from '@angular/core';
import { ManiobraService } from '../../../services/service.index';
import {ETAPAS_MANIOBRA} from '../../../config/config';

@Component({
  selector: 'app-lavado_reparacion',
  templateUrl: './lavado_reparacion.component.html',
  styles: [],
  providers: []
})
export class LavadoReparacionComponent implements OnInit {
  maniobras: any[] = [];
  cargando = true;
  totalRegistros = 0;
  constructor(public _maniobraService: ManiobraService) { }
  ngOnInit() {
    this.cargarManiobras();
  }
  cargarManiobras() {
    this.cargando = true;
    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.LAVADO_REPARACION)
    .subscribe(maniobras => {
          this.totalRegistros = maniobras.total;
          this.maniobras = maniobras.maniobras;
          this.cargando = false;
      });
  }
}



