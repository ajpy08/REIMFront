import { Naviera } from "./navieras.models";

export class Buque {
    constructor(
        public naviera?: Naviera,
        public nombre?: string,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}
