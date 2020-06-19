export class CFDI {
  constructor(
    public fecha?: string,
    public folio?: number,
    public formaPago?: string,
    // public lugarExpedicion?: string,
    public metodoPago?: string,
    public moneda?: string,
    public serie?: string,
    public subTotal?: number,
    public tipoComprobante?: string,
    public total?: number,
    public uuid?: string,
    public NoSerieSat?: string,
    public fechaCer?: Date,
    public cadenaOriginal?: string,
    public selloSat?: string,
    public rfcProvCer?: string,
    public selloEmisro?: string,
    
    // public version?: string, // FALTA
    // public noCertificado?: string, // FALTA
    // public sello?: string, // FALTA
    // public certificado?: string, // FALTA

    // nombreEmisor?: string, // FALTA
    // regimenFiscal?: string, // FALTA
    // rfcEmisor?: string, // FALTA

    public nombre?: string,
    public rfc?: string,
    public usoCFDI?: string,
    public direccion?: string,
    public correo?: string,

    public conceptos?: any[],

    public totalImpuestosRetenidos?: number,
    public totalImpuestosTrasladados?: number,

    public sucursal?: string,
    public usuarioAlta?: string,
    public fAlta?: Date,
    public usuarioMod?: string,
    public fMod?: Date,
    public informacionAdicional?: string,
    public _id?: string
  ) { }
}
