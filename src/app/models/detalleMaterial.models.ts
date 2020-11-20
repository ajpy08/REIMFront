import { Material } from './../pages/materiales/material.models';
export class DetalleMaterial {
    constructor(
        public material?: Material,
        public cantidad?: number,
        public costo?: number,
        // public usuarioAlta?: string,
        // public fAlta?: Date,
        // public usuarioMod?: string,
        // public fMod?: Date,
        public _id?: string
    ) {}
  }