import { Component, OnInit, ViewChild } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalDropzoneService } from './modal-dropzone.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-modal-dropzone',
  templateUrl: './modal-dropzone.component.html',
  styles: []
})
export class ModalDropzoneComponent implements OnInit {

  imagenSubir: File;
  filesToUpload: Array<File> = [];
  imagenTemp: any;

  @ViewChild( 'inputFile' ) inputFile: any;

  constructor(public _subirArchivoService: SubirArchivoService,
  public _modalDropzoneService: ModalDropzoneService) {
  }


  ngOnInit() {
  }

  clearForm() {
    console.log('Aqui obtienes el elemento para atribuir algo vacio: ', this.inputFile.nativeElement);

    this.inputFile.nativeElement.value = '';
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalDropzoneService.ocultarModal();
  }

  subirImagen() {
    // this.clearForm();
    // this._subirArchivoService.subirArchivoMultiple(this.filesToUpload, this._modalDropzoneService.id)
    // .then(resp => {
    //   console.log(resp);
    //   this._modalDropzoneService.notification.emit(resp);
    //   this.cerrarModal();

    // })
    // .catch(err => {
    //   console.log('Error en la carga...');

    // });

  }


  seleccionImagen(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files[0];
    console.log(this.filesToUpload);
    // this.product.photo = fileInput.target.files[0]['name'];
  }


}
