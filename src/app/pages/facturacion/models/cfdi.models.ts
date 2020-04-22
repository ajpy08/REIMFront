export class CFDI {
    constructor(
        public serie?: string,
        public folio?: string,
        public sucursal?: string,
        public formaPago?: string,
        public metodoPago?: string,
        public moneda?: string,
        public tipoComprobante?: string,
        public fecha?: string,
        public rfc?: string,
        public nombre?: string,
        public usoCFDI?: string,
        public direccion?: string,
        public correo?: string,
        public conceptos?: any[],
        public usuarioAlta?: string,
        public fAlta?: Date,
        public usuarioMod?: string,
        public fMod?: Date,
        public _id?: string
    ) {}
}
