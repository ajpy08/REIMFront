import { Impuesto } from './impuesto.models';

export class ProductoServicio {
    constructor(
        public codigo?: string,
        public unidad?: number,
        public descripcion?: string,
        public valorUnitario?: number,
        public claveSAT?: string,
        public unidadSAT?: string,
        public impuestos?: Impuesto[],
        // public impuestos?: string[],
        public fAlta?: string,
        public _id?: string
    ) {}
}
