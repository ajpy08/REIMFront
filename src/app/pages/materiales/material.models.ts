export class Material {
    constructor(
        public descripcion?: string,
        public unidadMedida?: string,
        public costo?: number,
        public precio?: number,
        public activo?: Boolean,
        public tipo?: string,
        public minimo?: number,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}