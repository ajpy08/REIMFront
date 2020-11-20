export class Material {
    constructor(
        public descripcion?: string,
        public unidadMedida?: string,
        public costo?: number,
        public activo?: Boolean,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}