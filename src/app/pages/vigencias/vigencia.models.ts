export class Vigencia {
    constructor(
        public contenedor?: string,
        public fManufactura?: string,
        public fVencimiento?: string,
        public observaciones?: string,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public activo?: boolean,
        public _id?: string
    ) {}
}
