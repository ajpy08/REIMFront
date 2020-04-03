import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iva'
})
export class IvaPipe implements PipeTransform {

  transform(value: number): string {
    const iva = (value * 0.1600).toString();

    // Para el caso de IVA, la versión pasada no redondea los decimales
    // El pipe de number redondea por default y causa inconsitencia
    return iva.slice(0, (iva.indexOf('.')) + 3);
  }
}
