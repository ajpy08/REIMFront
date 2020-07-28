import { Impuesto } from 'src/app/pages/facturacion/models/impuesto.models';
import { cfdisNotas } from 'src/app/pages/facturacion/models/cfdisNota.models';

export class NotasConcepto {
    constructor(
        public cantidad?: number,
        public claveProdServ?: string,
        public claveUnidad?: string,
        public descripcion?: string,
        public noIdentificacion?: string,
        public valorUnitario?: number,
        public importe?: number,
        public impuestos?: Impuesto[],
        public unidad?: string,
        public descuento?: number,
        public cfdis?: cfdisNotas[],
        public impuestosRetenidos?: number,
        public impuestosTrasladados?: number,
        public _id?: string
    ) {}
}
