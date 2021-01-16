import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../../environments/environment';


@Pipe({
  name: 'fotos2'
})

export class Fotos2Pipe implements PipeTransform {
  transform(ruta: string): any {
    let url = URL_SERVICIOS + '/documentos/documento/imagen';
    if (!ruta) {
      return url;
    }
    url += '?ruta=' + ruta;
    return url;
  }

}