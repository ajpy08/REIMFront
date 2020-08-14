import { Concepto } from './concepto.models';
export class Complemento {
    constructor(
        public version?: string, // Ira fijo y sera 3.3
        public serie?: string,
        public folio?: number,
        public fecha?: string,
        public sello?: string, // FALTA
        // public formaPago?: string, // NO DEBE EXISTIR
        public noCertificado?: string, // FALTA
        public certificado?: string, // FALTA
        // public condicionesDePago?: string, // NO DEBE EXISTIR
        public subTotal?: number, // DEBE SER 0
        // public Descuento?: number, // NO DEBE EXISTIR
        public moneda?: string, // Se debe registrar el valor “XXX”.
        // public TipoCambio?: number, // NO DEBE EXISTIR
        public total?: number, // DEBE SER 0
        public tipoComprobante?: string, // Se debe registrar la clave "P" (Pago)
        // public metodoPago?: string, // NO DEBE EXISTIR
        public lugarExpedicion?: string, // Siempre CP del lugar de expedicion
        public confirmacion?: string,
        // Confirmación.- Se debe registrar la clave de confirmación única e irrepetible que entregue el Proveedor de Certificación
        // de CFDI o el SAT a los emisores (usuarios) para expedir el comprobante con importes o tipo de cambio
        // fuera del rango establecido o en ambos casos.

        // Nodo: CfdiRelacionados  PENDIENTE (Cuando un Complemento de Pago sustituye a otro
        // que por alguna razon estuvo mal, se relaciona el CP que sera sustituido, leer Guia_comple_pagos del SAT)
        // Tipo de Relacion (04)

        // Nodo: CfdiRelacionado (En este nodo se debe expresar la información del comprobante relacionado).
        // UUID

        public rfcEmisor?: string, // FALTA
        public nombreEmisor?: string, // FALTA
        public regimenFiscal?: string, // FALTA

        public rfcReceptor?: string,
        public nombreReceptor?: string,
        // public ResidenciaFiscal, // Si es extranjero
        // public NumRegIdTrib, // Si es extranjero
        public usoCFDI?: string, // Debe ser P01

        public concepto?: Concepto,

        public versionPago?: string, // Ira fijo y sera 1.0
        public fechaPago?: string,
        public formaDePagoP?: string, // 01 efectivo - 03 transferencia
        public monedaP?: string, // normalmente MXN puede ser USD
        public tipoCambio?: string, // Solo si es moneda es diferente de MXN
        public monto?: number,
        public numOperacion?: string,
        public rfcEmisorCtaOrd?: string,
        public nomBancoOrdExt?: string,
        public ctaOrdenante?: string,
        public rfcEmisorCtaBen?: string,
        public ctaBeneficiario?: string,
        public TipoCadPago?: string, // OPCIONAL c_TipoCadena 01 SPEI
        public CertPago?: string, // Es requerido en caso de que el campo TipoCadPago
        public CadPago?: string, // Es requerido en caso de que el campo TipoCadPago
        public selloPago?: string, // Es requerido en caso de que el campo TipoCadPago

        public doctosRelacionados?: any[],

        public usuarioAlta?: string,
        public fAlta?: Date,
        public usuarioMod?: string,
        public fMod?: Date,
        public informacionAdicional?: string,
        public _id?: string
    ) { }
}
