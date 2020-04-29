import { Naviera } from '../navieras/navieras.models';

export class Buque {
    constructor(
        public nombre?: string,
        public naviera?: Naviera,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public activo?: boolean,
        public _id?: string
    ) {}
}
