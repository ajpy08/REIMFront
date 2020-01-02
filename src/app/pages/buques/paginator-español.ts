import { MatPaginatorIntl } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()

export class PaginatorEspañol extends MatPaginatorIntl {
    itemsPerPageLabel = 'Items por Página';
    nextPageLabel = 'Siguiente';
    previousPageLabel = 'Previa';
    firstPageLabel = "Primera Página";
    lastPageLabel = "Última Página"

    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 de ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        //Si el índice de inicio excede la longitud de la lista, no intente 
        //arreglar el índice final hasta el final
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
} 