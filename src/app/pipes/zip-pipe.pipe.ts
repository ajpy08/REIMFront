import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from 'src/environments/environment';

@Pipe({
  name: 'zipPipe'
})
export class ZipPipePipe implements PipeTransform {
  transform(ruta: string, id: string, LR: string): any {
    let url = URL_SERVICIOS + "/documentos/maniobra/" + id;
    url += "/zipLR/" + LR;
    if (!ruta) {
      return url;
    }
  url += '?ruta=' + ruta;
  return url;
  }

}
