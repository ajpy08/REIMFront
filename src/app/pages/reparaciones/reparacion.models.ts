export class Reparacion {
    constructor(
        public descripcion?: string,
        public costo?: number,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}