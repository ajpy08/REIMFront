import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariasService {

  constructor() { }

  static truncateDecimals(num, digits) {
    const numS = num.toString(),
      decPos = numS.indexOf('.'),
      substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
      trimmedResult = numS.substr(0, substrLength),
      finalResult = isNaN(trimmedResult) ? -1 : trimmedResult;

    return parseFloat(finalResult);
  }
}
