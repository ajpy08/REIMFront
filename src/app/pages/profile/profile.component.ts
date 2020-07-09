import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService, SubirArchivoService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente.models';
import swal from 'sweetalert';
import { CropperSettings } from 'ng2-img-cropper';
import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';
import * as io from 'socket.io-client';

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
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  usuarioLogueado = new Usuario;

  constructor(public _usuarioService: UsuarioService, private _subirArchivoService: SubirArchivoService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.createFormGroup();
    this.usuarioLogueado = this._usuarioService.usuario;
    this.cargarUsuario(this._usuarioService.usuario._id);

    this.cropperSettings = new CropperSettings();
    // this.cropperSettings.width = 0.1;
    // this.cropperSettings.height = 0.1;
    // this.cropperSettings.croppedWidth = 0.1;
    // this.cropperSettings.croppedHeight = 0.1;
    // this.cropperSettings.canvasWidth = 400;
    // this.cropperSettings.canvasHeight = 300;

    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.width = 20;
    this.cropperSettings.height = 20;
    this.cropperSettings.minWidth = 2;
    this.cropperSettings.minHeight = 2;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.touchRadius = 20;
    this.cropperSettings.minWithRelativeToResolution = true;
    this.cropperSettings.noFileInput = false;
    // this.cropperSettings.cropperDrawSettings:CropperDrawSettings - rendering options
    // this.cropperSettings.strokeWidth:number - box/ellipsis stroke width
    // this.cropperSettings.strokeColor:string - box/ellipsis stroke color

    // this.cropperSettings.allowedFilesRegex:RegExp - (default: /.(jpe?g|png|gif)$/i) - Regex for allowed images
    this.cropperSettings.preserveSize = false;
    this.cropperSettings.fileType = 'image/jpeg';
    this.cropperSettings.compressRatio = 1.0;
    this.cropperSettings.dynamicSizing = false;
    // this.cropperSettings.cropperClass: string - set class on canvas element;
    // this.cropperSettings.croppingClass: string - appends class to cropper when image is set (#142);
    // this.cropperSettings.resampleFn: Function(canvas) - function used to resample the cropped image (#136); - see example #3 from runtime sample app
    this.cropperSettings.cropOnResize = true;

    this.data = {};
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('actualizar-perfil');
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
          // this.data = undefined;
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
          this.fotoTemporal = false;
          this.regForm.markAsPristine();
          this.socket.emit('actualizarperfil', this._usuarioService.usuario);
        });
    }
  }

  verClientes(usuario: Usuario) {
    // console.log(usuario);
  }
}
