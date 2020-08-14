export class Pago {
    constructor(
        public fecha?: string,
        public formaPago?: string,
        public moneda?: string,
        // public tipoCambioP?: number, // cuando la moneda sea diferente a MXN
        public monto?: number,
        public numeroOperacion?: string,

        // Ordenante
        public numeroCuentaOrd?: string,
        public rfcEntidadEmisoraOrd?: string,
        public bancoOrd?: string,

        // Beneficiario
        public numeroCuentaBen?: string,
        public rfcEntidadEmisoraBen?: string,

        // Informacion Digital
        // public tipoCadenaPago?: string, // Si existe este campo es obligatorio registrar los campos CertificadoPago,
        // CadenaPago y SelloPago, en otro caso estos campos no deben existir
        // public certPago?: string,
        // public cadPago?: string,
        // public selloPago?: string,

        public doctosRelacionados?: any[],

        // public _id?: string
    ) { }
}
