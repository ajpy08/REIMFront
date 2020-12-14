export class Movimiento {
    constructor(
        public fFactura?: number,
        public noFactura?: string,
        public cantidad?: number,
        public material?: string,
        public costo?: number,
        public proveedor?: string,
    ) {}
}