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
  data: any = {fechaCreado: ''};
  cargando = true;
  totalRegistros = 0;
  usuarioLogueado : any;
  constructor(public _maniobraService: ManiobraService, public _usuarioService: UsuarioService,) { }
  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;

    this.cargarManiobras();
  }

  cargarManiobras() {
    this.cargando = true;
    console.log(this.usuarioLogueado.empresas[0]._id);
    if (this.usuarioLogueado.role==='TRANSPORTISTA_ROLE'){
      this._maniobraService.getManiobras('D', 'TRANSITO', this.usuarioLogueado.empresas[0]._id)
      .subscribe(maniobras => {
        if (maniobras.code !== 200) {
          this.totalRegistros = maniobras.total;
          this.maniobras = maniobras.maniobras;
          this.cargando = false;
        }
      },
      error => {
          console.log(<any>error);
      }
    );
    }
  }


}



