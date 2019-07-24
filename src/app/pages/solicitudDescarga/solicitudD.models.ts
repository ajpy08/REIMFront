export class SolicitudD {

    constructor (
        public agencia?: string,
        public naviera?: string,
        public transportista?: string,
        public cliente?: string,
        public facturarA?: string,
        public buque?: string,
        public viaje?: string,
        public observaciones?: string,
        public rutaBL?: string,
        public credito?: boolean,
        public rutaComprobante?: string,
        public correo?: string,
        public correoFac?: string,
        public contenedores?: Array<any>,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}

}
