export class Cliente {
    constructor(
        public rfc?: string,
        public razonSocial?: string,
        public nombreComercial?: string,
        public calle?: string,
        public noExterior?: string,
        public noInterior?: string,
        public colonia?: string,
        public municipio?: string,
        public ciudad?: string,
        public estado?: string,
        public cp?: string,
        public formatoR1?: string,
        public correo?: string,
        public correoFac?: string,
        public credito?: string,
        public empresas?: Cliente[],
        public img?: string,
        public role?: string,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}
