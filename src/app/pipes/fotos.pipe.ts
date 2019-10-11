import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';


@Pipe({
  name: 'fotos'
})
export class FotosPipe implements PipeTransform {
  // id - LR - img
  transform(img: string, params: string[]): any {
    // console.log(params)
    let url = URL_SERVICIOS + '/img/maniobra';
    
    if (!img) {
      console.log('Enteo aqui');
      return url + '/no-img.jpg';
    }
    if (img.indexOf('https') >= 0) {
      return img;
    }
    
    url+='?ruta='+img;
    

     console.log(url)
    return url;
  }

}
