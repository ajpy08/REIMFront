export class Pago {
    constructor(
        public fecha?: string,
        public formaPago?: string,
        public moneda?: string,
        public numeroOperacion?: string,
        public doctosRelacionados?: any[],
        // Ordenante
        public numeroCuentaOrd?: string,
        public rfcEntidadEmisoraOrd?: string,
        public bancoOrd?: string,

        // Beneficiario
        public numeroCuentaBen?: string,
        public rfcEntidadEmisoraBen?: string,

        // Informacion Digital
        public tipoCadenaPago?: string,
        public cadenaOriginal?: string,
        public certificado?: string,
        public sello?: string,

        public _id?: string
    ) { }
}
