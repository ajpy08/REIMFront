import { Viaje } from "../viajes/viaje.models";
import { Operador } from "src/app/models/operador.models";
import { Cliente } from "src/app/models/cliente.models";
import { Camion } from "src/app/models/camion.models";
import { Agencia } from "src/app/models/agencia.models";
import { Solicitud } from '../solicitudes/solicitud.models';

export class Maniobra {
    constructor(
        public cargaDescarga?: string,
        public viaje?: string,
        public agencia?: string,
        public transportista?: string,
        public camion?: string,
        public operador?: string,
        public contenedor?: string,
        public tipo?: string,
        public grado?: string,
        public peso?: string,
        public estado?: string,
        public estatus?: string,
        public fLlegada?: string,
        public hLlegada?: string,
        public hEntrada?: string,
        public hSalida?: string,
        public lavado?: string,
        public lavadoObservacion?: string,
        public reparaciones?: string,
        public reparacionesObservacion?: string,
        public solicitud?: string,
        public cliente?: string,
        public usuarioAlta?: string,
        public fAlta?: Date,
        public usuarioMod?: string,
        public fMod?: Date,
        public _id?: string,
    ) {}
}
