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
        public lugarExpedicion?: string, // Siempre CP del lugar de expedicion
        public confirmacion?: string,

        // Nodo: CfdiRelacionados  PENDIENTE (Cuando un Complemento de Pago sustituye a otro
        // que por alguna razon estuvo mal, se relaciona el CP que sera sustituido, leer Guia_comple_pagos del SAT)
        // Tipo de Relacion (04)

        // Nodo: CfdiRelacionado (En este nodo se debe expresar la información del comprobante relacionado).
        // UUID

        public uuid?: string,
        public NoSerieSat?: string,
        public fechaCer?: Date,
        public cadenaOriginal?: string,
        public selloSat?: string,
        public rfcProvCer?: string,
        public selloEmisro?: string,


        public rfcEmisor?: string, // FALTA
        public nombreEmisor?: string, // FALTA
        public regimenFiscal?: string, // FALTA

        public rfcReceptor?: string,
        public nombreReceptor?: string,
        // public ResidenciaFiscal, // Si es extranjero
        // public NumRegIdTrib, // Si es extranjero
        public usoCFDI?: string, // Debe ser P01

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
