import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService, SubirArchivoService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente.models';
import swal from 'sweetalert';
import { CropperSettings } from 'ng2-img-cropper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  regForm: FormGroup;
  fileFoto: File = null;
  fotoTemporal = false;
  listaEmpresas: Cliente[] = [];
  data: any;
  cropperSettings: CropperSettings;

  constructor(public _usuarioService: UsuarioService, private _subirArchivoService: SubirArchivoService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.createFormGroup();
    this.cargarUsuario(this._usuarioService.usuario._id);

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;

    this.data = {};
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      img: [''],
      _id: ['']
    });
  }

  get nombre() {
    return this.regForm.get('nombre');
  }
  get email() {
    return this.regForm.get('email');
  }
  get img() {
    return this.regForm.get('img');
  }



  get _id() {
    return this.regForm.get('_id');
  }

  cargarUsuario(id: string) {
    this._usuarioService.getUsuarioConIncludes(id).subscribe(usuario => {
      this.nombre.setValue(usuario.nombre);
      this.email.setValue(usuario.email);
      this.img.setValue(usuario.img);
      this.listaEmpresas = usuario.empresas;
      this._id.setValue(usuario._id);
    });
  }

  onFileSelected(event) {
    this.fileFoto = <File>event.target.files[0];
    // this.fileFoto = this.data.image;
    this.subirFoto();
  }

  // subirFoto() {
  //   this._subirArchivoService.subirArchivoBucketTemporal(this.fileFoto)
  //     .subscribe(nombreArchivo => {
  //       this.regForm.get('img').setValue(nombreArchivo);
  //       this.regForm.get('img').markAsDirty();
  //       this.fotoTemporal = true;
  //       this.guardarUsuario();
  //     });
  // }

  subirFoto() {

    if (!this.data) {
      this.data = {};
    } else {
      const file = this.base64ImageToBlob(this.data.image);
      const b: any = file;
      // A Blob() is almost a File() - it's just missing the two properties below which we will add
      b.lastModifiedDate = new Date();
      b.name = `image.${file.type.substring(file.type.lastIndexOf('/') + 1, file.type.length)}`;

      this._subirArchivoService.subirArchivoBucketTemporal(<File>b)
        .subscribe(nombreArchivo => {
          this.regForm.get('img').setValue(nombreArchivo);
          this.regForm.get('img').markAsDirty();
          this.fotoTemporal = true;
          // this.data = {};
          this.guardarUsuario();
        });
    }
  }

  base64ImageToBlob(str) {
    // extract content type and base64 payload from original string
    const pos = str.indexOf(';base64,');
    const type = str.substring(5, pos);
    const b64 = str.substr(pos + 8);

    // decode base64
    const imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    const blob = new Blob([buffer], { type: type });

    return blob;
  }

  guardarUsuario() {
    if (this.regForm.valid) {
      this._usuarioService.actualizaPerfil(this.regForm.value)
        .subscribe(usuario => {
          // this.fileFoto = null;
          this.data = null;
          this.fotoTemporal = false;
          this.regForm.markAsPristine();
        });
    }
  }

  verClientes(usuario: Usuario) {
    // console.log(usuario);
  }
}
