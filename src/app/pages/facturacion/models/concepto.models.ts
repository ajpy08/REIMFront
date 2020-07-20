import { Impuesto } from 'src/app/pages/facturacion/models/impuesto.models';
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
        public impuestos?: Impuesto[],
        public unidad?: string,
        public descuento?: number,
        public maniobras?: any[],
        public impuestosRetenidos?: number,
        public impuestosTrasladados?: number,
        public cfdis?: any[],
        public _id?: string
    ) {}
}
