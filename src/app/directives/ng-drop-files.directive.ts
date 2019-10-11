import { FileItem } from '../models/file-item.models';
import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  @Output() comprimiendoImagen : EventEmitter<boolean> = new EventEmitter();
  @Input() yaCargo: boolean;
  
  constructor(private ng2ImgMax: Ng2ImgMaxService,) { }

  @HostListener('dragover', ['$event'])
  public onDrapEnter(event: any) {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDrapLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {

    const transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }

    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);


  }

  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTranfer;
  }

  private _extraerArchivos(archivosLista: FileList) {
    console.log(archivosLista);
    //console.log("yaCargo de ng-drop-files: " + this.yaCargo)
    if (this.yaCargo) {
      while (this.archivos.length > 0) {
        this.archivos.pop();
      }
    }

    // tslint:disable-next-line:forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];

      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        this.comprimiendoImagen.emit(true);
        this.ng2ImgMax.resizeImage(archivoTemporal, 800, 600).subscribe(
          result => {
            const nuevoArchivo = new FileItem(new File([result], result.name));
            this.archivos.push(nuevoArchivo);
            this.comprimiendoImagen.emit(false);
          },
          error => {
            console.log('😢 Oh no!', error);
            this.comprimiendoImagen.emit(false);
          }
        );

        // const nuevoArchivo = new FileItem(archivoTemporal);
        // this.archivos.push(nuevoArchivo);
      }
    }
    //console.log(this.archivos);
  }

  // validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoYaFueronDroppeados(archivo.name) && this._esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueronDroppeados(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya esta agregado');
        return true;
      }
    }



    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }

}
