import { Component, OnInit } from '@angular/core';
import { ManiobraService, UsuarioService } from '../../../services/service.index';

declare var jQuery: any;
@Component({
  selector: 'app-solicitudes.transportista',
  templateUrl: './solicitudes_transportista.component.html',
  styles: [],
  providers: [],
})

export class SolicitudesTransportistaComponent implements OnInit {
  maniobras: any[] = [];
  maniobrasCarga: any[] = [];
  data: any = { fechaCreado: '' };
  cargando = true;
  totalRegistros = 0;
  totalRegistrosCargas = 0;
  usuarioLogueado: any;
  constructor(public _maniobraService: ManiobraService, public _usuarioService: UsuarioService, ) { }
  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;

    this.cargarManiobras();
  }

  cargarManiobras() {
    this.cargando = true;
    if (this.usuarioLogueado.role === 'TRANSPORTISTA_ROLE') {
      this._maniobraService.getManiobras('D', 'TRANSITO', this.usuarioLogueado.empresas[0]._id)
        .subscribe(maniobras => {
          this.totalRegistros = maniobras.total;
          this.maniobras = maniobras.maniobras;
        });
      this._maniobraService.getManiobras('c', 'TRANSITO', this.usuarioLogueado.empresas[0]._id)
        .subscribe(maniobras => {
          this.totalRegistrosCargas = maniobras.total;
          this.maniobrasCarga = maniobras.maniobras;
        });
      this.cargando = false;
    }

    if (this.usuarioLogueado.role === 'ADMIN_ROLE') {
      this._maniobraService.getManiobras('D', 'TRANSITO')
        .subscribe(maniobras => {
          this.totalRegistros = maniobras.total;
          this.maniobras = maniobras.maniobras;
        });
      this._maniobraService.getManiobras('c', 'TRANSITO')
        .subscribe(maniobras => {
          this.totalRegistrosCargas = maniobras.total;
          this.maniobrasCarga = maniobras.maniobras;
        });
      this.cargando = false;
    }
  }
}
