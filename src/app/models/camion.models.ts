export class Camion {
    constructor(
        public transportista? : string,
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
