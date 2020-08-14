export class DoctoRelacionado {
    constructor(
        public idDocumento?: string,
        public rfc?: string,
        public serie?: string,
        public folio?: number,
        public monedaDR?: string,
        public metodoDePagoDR?: string,
        public numParcialidad?: number,
        public impSaldoAnt?: number,
        public impPagado?: number,
        public impSaldoInsoluto?: number,
    ) { }
}
