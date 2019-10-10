import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'fotos'
})
export class FotosPipe implements PipeTransform {
  // id - LR - img
  transform(img: string, params: string[]): any {
    // console.log(params)
    let url = URL_SERVICIOS + '/img/' + params[0];
    if (!img) {
      return url + '/no-img.jpg';
    }
    if (img.indexOf('https') >= 0) {
      return img;
    }
    switch (params[1]) {
      case 'L':
        // console.log("Entre a Fotos Lavado")
        url += '/fotos_lavado/' + img;
        break;
      case 'R':
        // console.log("Entre a Fotos Reparacion")
        url += '/fotos_reparacion/' + img;
        break;
      default:
        console.log('tipo de imagen no existe');
        url += '/no-img.jpg';
    }
    // console.log(url)
    return url;
  }

}
