export class Complemento {
    constructor(
        // public version?: string, // FALTA
        public serie?: string,
        public folio?: number,
        public fecha?: string,
        // public sello?: string, // FALTA
        // public formaPago?: string, // NO DEBE EXISTIR
        // public noCertificado?: string, // FALTA
        // public certificado?: string, // FALTA
        // public condicionesDePago?: string, // NO DEBE EXISTIR
        public subTotal?: number, // DEBE SER 0
        // public Descuento?: number, // NO DEBE EXISTIR
        public moneda?: string,
        // public TipoCambio?: number, // NO DEBE EXISTIR
        public total?: number, // DEBE SER 0
        public tipoComprobante?: string,
        // public metodoPago?: string, // NO DEBE EXISTIR
        // public lugarExpedicion?: string,
        public confirmacion?: string,


        public uuid?: string,
        public NoSerieSat?: string,
        public fechaCer?: Date,
        public cadenaOriginal?: string,
        public selloSat?: string,
        public rfcProvCer?: string,
        public selloEmisro?: string,


        // rfcEmisor?: string, // FALTA
        // nombreEmisor?: string, // FALTA
        // regimenFiscal?: string, // FALTA

        public rfc?: string,
        public nombre?: string,
        public usoCFDI?: string,

        public concepto?: any,

        public doctosRelacionados?: any[],

        public fechaPago?: string,
        public formaDePagoP?: string,
        public monedaP?: string,
        public monto?: number,
        public numOperacion?: string,
        public rfcEmisorCtaOrd?: string,
        public nomBancoOrdExt?: string,
        public ctaOrdenante?: string,
        public rfcEmisorCtaBen?: string,
        public ctaBeneficiario?: string,

        public usuarioAlta?: string,
        public fAlta?: Date,
        public usuarioMod?: string,
        public fMod?: Date,
        public informacionAdicional?: string,
        public _id?: string
    ) { }
}
