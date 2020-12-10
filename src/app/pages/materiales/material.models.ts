export class Material {
    constructor(
        public descripcion?: string,
        public unidadMedida?: string,
        public costo?: any,
        public precio?: any,
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