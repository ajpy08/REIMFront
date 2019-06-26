import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class ModalUploadService {
  public tipo: string;
  public id: string;

  // tslint:disable-next-line:no-inferrable-types
  public oculto: string = 'oculto';

  public notification = new EventEmitter<any>();

  constructor() { console.log('modal upload listo'); }

  ocultarModal() {
    this.oculto = 'oculto';
    this.id = null;
    this.tipo = null;
   }
  mostrarModal(tipo: string, id: string) {
    this.oculto = '';
    this.id = id;
    this.tipo = tipo;
   }
}
