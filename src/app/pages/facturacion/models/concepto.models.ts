import { Maniobra } from '../../../models/maniobra.models';
import { ProductoServicio } from './producto-servicio.models';

export class Concepto {
    constructor(
        public cantidad?: number,
        public claveProdServ?: string,
        public claveUnidad?: string,
        public descripcion?: string,
        public noIdentificacion?: string,
        public valorUnitario?: number,
        public importe?: number,
        public impuestos?: [],
        public unidad?: string,
        public descuento?: number,
        public maniobras?: any[],
        public _id?: string
    ) {}
}
