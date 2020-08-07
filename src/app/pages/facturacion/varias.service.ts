import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariasService {

  constructor() { }

  /* #region  MATH */
  static truncateDecimals(num, digits) {
    const numS = num.toString(),
      decPos = numS.indexOf('.'),
      substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
      trimmedResult = numS.substr(0, substrLength),
      finalResult = isNaN(trimmedResult) ? -1 : trimmedResult;

    return parseFloat(finalResult);
  }

  static round(number: number, digits) {
    const n = parseFloat((Math.round(number * 100) / 100).toFixed(digits));
    return n;
  }
  /* #endregion */

  /* #region  ARRAYS */
  static groupArray(dataSource, field) {
    return dataSource.reduce(function (groups, x) {
      (groups[x[field]] = groups[x[field]] || []).push(x);
      return groups;
    }, {});
  }

  static async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
      // await callback(array[index], index, array);
    }
  }
  /* #endregion */
}
