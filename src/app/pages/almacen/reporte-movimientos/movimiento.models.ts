export class Movimiento {
    constructor(
        public IO?: string,
        public tipo?: string,
        public fEntrada?: Date,
        public noFactura?: string,
        public fFactura?: Date,
        public cantidad?: number,
        public idMaterial?: string,
        public material?: string,
        public costo?: number,
        public proveedor?: string,
    ) {}
}