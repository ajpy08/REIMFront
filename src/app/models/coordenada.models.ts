import { Maniobra } from "./maniobra.models";

export class Coordenada {
    constructor(
        public bahia?: string,
        public posicion?: string,
        public tipo?: number,
        public activo?: boolean,
        public maniobra?: Maniobra,
        public _id?: string
    ) {} 
}