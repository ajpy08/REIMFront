import { SubirArchivoService } from "../services/service.index";

export class FileItem {
    public archivo: File;
    public nombreArchivo: string;
    public size: number;
    public url: string;
    public estaSubiendo: boolean;
    public progreso: number;

    constructor(archivo: File) {
        this.archivo = archivo;
        this.nombreArchivo = archivo.name;
        this.size = archivo.size;
        this.estaSubiendo = false;
        this.progreso = 0;
    }
}
