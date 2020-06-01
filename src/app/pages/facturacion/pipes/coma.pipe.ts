import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coma'
})
export class ComaPipe implements PipeTransform {

  transform(value: number): string {
    let entero = '';
    let punto = 0;
    let decimal = [];
    if (value !== undefined && value !== null) {
      if (value >= 10000) {
        entero = value.toString();
        punto = entero.indexOf('.');
        if (punto !== -1) {
          decimal = entero.split('.');
          entero = decimal[0].substr(0, 2);
          return entero + ',' + decimal[0].substr(2) + '.' + decimal[1].padStart(2, '0');
        } else {
          entero = entero.substr(0, 2);
          return entero + ',' + value.toString().substr(2) + '.' + '00';
        }
      }
      if (value >= 1000 && value < 9999) {
        entero = value.toString();
        punto = entero.indexOf('.');
        if (punto !== -1) {
          decimal = entero.split('.');
          if (decimal[1].length >= 2) {
            entero = decimal[0].substr(0, 1);
            return entero + ',' + decimal[0].substr(1) + '.' + decimal[1].padStart(2);
          } else {
            entero = decimal[0].substr(0, 1);
            entero = entero + ',' + decimal[0].substr(1) + '.' + decimal[1].padStart(2, '0');
            return entero;
          }
        } else {
          entero = entero.substr(0, 1);
          return entero + ',' + value.toString().substr(1);
        }
      } else {
        entero = value.toString();
        punto = entero.indexOf('.');
        if (punto !== -1) {
          decimal = entero.split('.');
          entero = decimal[0] + '.' + decimal[1].padStart(2, '0');
          return entero;
        } else {
          return value.toString();
        }
      }
    }
  }
}
