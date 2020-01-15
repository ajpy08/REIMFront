import { Coordenada } from "./coordenada.models";

export class Point_Coordenada {
    constructor(
        public point?: Uint32Array,
        public bahia?: number,
        public posicion?: string
    ) {} 
}