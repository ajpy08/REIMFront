import { Naviera } from "./navieras.models";

export class Buque {
    constructor(
        public nombre?: string,
        public naviera?: Naviera,
        public usuarioAlta?: string,
        public fAlta?: string,
        public usuarioMod?: string,
        public fMod?: string,
        public _id?: string
    ) {}
}
