import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../../environments/environment';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {
    let url = URL_SERVICIOS + '/documentos/documentoxtipo';
    if (!img) {
      return url + '/usuarios/xxx';
    }
    if (img.indexOf('https') >= 0) {
      return img;
    }
    switch (tipo) {
      case 'usuario':
      url += '/usuarios/' + img;
      break;
      case 'cliente':
      url += '/clientes/' + img;
      break;
      case 'operador':
      url += '/operadores/' + img;
      break;
      case 'camion':
      url += '/camiones/' + img;
      break;
      case 'viaje':
        url += '/viajes/' + img;
        break;
      case 'solicitud':
        url += '/solicitudes/' + img;
        break;
      case 'temp':
        url += '/temp/' + img;
        break;
      default:
        url += '/usuarios/xxx';
    }
    return url;
  }

}
