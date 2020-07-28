export class DoctoRelacionado {
    constructor(
        public idDocumento?: string,
        public serie?: string,
        public folio?: number,
        public monedaDR?: string,
        public metodoDePagoDR?: string,
        public numParcialidad?: number,
        public impSaldoAnt?: string,
        public impPagado?: string,
        public impSaldoInsoluto?: string,
    ) { }
}
