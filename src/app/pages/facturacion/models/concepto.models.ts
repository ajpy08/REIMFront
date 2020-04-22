import { Maniobra } from '../../../models/maniobra.models';
import { ProductoServicio } from './producto-servicio.models';

export class Concepto {
    constructor(
        // public consecutivo?: string,
        public descripcion?: string,
        public unidad?: string,
        public cantidad?: number,
        public valorUnitario?: number,
        public impuestosRetenidos?: number,
        public impuestosTrasladados?: number,
        public descuento?: number,
        public importe?: number,
        public maniobras?: any[],
        public _id?: string
    ) {}
}
