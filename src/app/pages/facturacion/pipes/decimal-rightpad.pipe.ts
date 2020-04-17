import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalrightpad'
})
export class DecimalRightPadPipe implements PipeTransform {

  transform(value: number, length: number = 0): string {
    let entero = '';
    let decimales = '';

    if (value !== undefined && value !== null) {
      entero = (value.toString() + '').split('.')[0];
      if (value.toString().indexOf('.') > 0) {
        decimales = (value.toString() + '').split('.')[1];
      }

      if (decimales.length > length) {
        decimales = decimales.substr(0, length);
      } else {
        decimales = decimales.padEnd(length, '0');
      }

      return entero + '.' + decimales;
    } else {
      return '--';
    }

  }
}
