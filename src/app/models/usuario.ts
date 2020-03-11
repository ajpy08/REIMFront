import { Cliente } from './cliente.models';

export class Usuario {
    constructor(
        public nombre?: string,
        public email?: string,
        public role?: number,
        public img?: boolean,
        public empresas?: Cliente[],
        public status?: string,
        public _id?: string
    ) {}
}
