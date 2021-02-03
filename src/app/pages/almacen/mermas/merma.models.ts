export class Merma {
    constructor(
        public motivo?: string,
        public materiales?: any[],
        public usuarioAprobacion?: string,
        public fAprobacion?: string,
        public comentarioAprobacion?: string,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}