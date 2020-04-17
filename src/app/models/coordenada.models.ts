import { Maniobra } from './maniobra.models';

export class Coordenada {
    constructor(
        public bahia?: string,
        public posicion?: string,
        public tipo?: number,
        public activo?: boolean,
        public maniobras?: Maniobra[],
        public _id?: string
    ) {}
}
