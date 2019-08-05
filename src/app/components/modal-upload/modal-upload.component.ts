import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';
import { ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;
  @ViewChild( 'inputFile' ) inputFile: any;

  constructor(public _subirArchivoService: SubirArchivoService,
  public _modalUplodaService: ModalUploadService) { }


  ngOnInit() {
  }

  clearForm() {
   // console.log('Aqui obtienes el elemento para atribuir algo vazio: ', this.inputFile.nativeElement);

    this.inputFile.nativeElement.value = '';
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUplodaService.ocultarModal();
  }

  subirImagen() {
    // this.clearForm();
    // this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUplodaService.tipo, this._modalUplodaService.id)
    // .then(resp => {
    //   // console.log(resp);
    //   this._modalUplodaService.notification.emit(resp);
    //   this.cerrarModal();

    // })
    // .catch(err => {
    //   // console.log('Error en la carga...');
    //   swal( err.error.mensaje, err.error.errores.message, 'error' );
    //   return throwError(err);
    // });

  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      swal('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;

    }
       this.imagenSubir = archivo;
       // tslint:disable-next-line:prefer-const
       let reader = new FileReader();
       // tslint:disable-next-line:prefer-const
       let urlImagenTemp = reader.readAsDataURL(archivo);
       reader.onloadend = () => this.imagenTemp = reader.result;
  }


}
