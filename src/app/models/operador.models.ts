import { Transportista } from "./transportista.models";

export class Operador {
    constructor(
        public transportista?: Transportista,
        public nombre?: string,
        public foto?: string,
        public vigenciaLicencia?: string,
        public licencia?: string,
        public fotoLicencia?: string,
        public activo?: Boolean,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}
