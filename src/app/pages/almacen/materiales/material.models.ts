export class Material {
    constructor(
        public codigo?: string,
        public descripcion?: string,
        public unidadMedida?: any,
        public costo?: any,
        public precio?: any,
        public activo?: Boolean,
        public tipo?: string,
        public minimo?: number,
        public stock?: number,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}