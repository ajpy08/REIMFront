import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class ModalDropzoneService {
  public id: string;

  // tslint:disable-next-line:no-inferrable-types
  public oculto: string = 'oculto';

  public notification = new EventEmitter<any>();

  constructor() { }

  ocultarModal() {
    this.oculto = 'oculto';
    this.id = null;
   }
  mostrarModal(id: string) {
    this.oculto = '';
    this.id = id;
   }
}
