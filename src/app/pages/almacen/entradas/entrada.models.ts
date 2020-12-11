export class Entrada {
    constructor(
        public noFactura?: string,
        public proveedor?: string,
        public fFactura?: number,
        public detalles?: any[],
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}