import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { injectViewContainerRef } from '@angular/core/src/render3/view_engine_compatibility';

@Injectable()
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };

  urlWithoutLogin: string;
  constructor(@Inject(DOCUMENT) private _document) {
    this.cargarAjustes();
    this.urlWithoutLogin = _document.location.href;
    if (this.urlWithoutLogin != undefined && this.urlWithoutLogin.includes('solicitud')) {
      localStorage.setItem('urlMain', this.urlWithoutLogin);
    }
  }

  guardarAjustes() {
    // console.log('Guardado en el localStorage');
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {

    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      // console.log( 'Cargando del localstorage' );

      this.aplicarTema(this.ajustes.tema);

    } else {
      // console.log( 'Usando valores por defecto' );
      this.aplicarTema(this.ajustes.tema);
    }

  }

  aplicarTema(tema: string) {


    // tslint:disable-next-line:prefer-const
    let url = `assets/css/colors/${tema}.css`;
    this._document.getElementById('tema').setAttribute('href', url);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;

    this.guardarAjustes();

  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
