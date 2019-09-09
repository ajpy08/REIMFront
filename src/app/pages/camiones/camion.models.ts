import { Transportista } from "../transportistas/transportista.models";
import { Operador } from "../operadores/operador.models";

export class Camion {
    constructor(
        public transportista? : Transportista,
        public operador? : Operador,
        public placa?: string,
        public noEconomico?: string,
        public vigenciaSeguro?: Date,
        public pdfSeguro?: string,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}
