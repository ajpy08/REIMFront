import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';


@Pipe({
  name: 'fotos'
})
export class FotosPipe implements PipeTransform {
  transform(ruta: string): any {
    // console.log(params)
    let url = URL_SERVICIOS + '/documentos/maniobra/lavado_reparacion';
    if (!ruta) {
      return url;
    }
    // if (img.indexOf('https') >= 0) {
    //   return img;
    // }
    url += '?ruta=' + ruta;
    return url;
  }

}
