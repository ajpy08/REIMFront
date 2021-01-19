import { Component, OnInit, ViewChild } from '@angular/core';
import { FileItem } from '../../../models/file-item.models';

import { SubirArchivoService, UsuarioService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryLayout, NgxGalleryImageSize, NgxGalleryOrder } from 'ngx-gallery';
import { Fotos2Pipe } from 'src/app/pipes/fotos2.pipe';
import { MatTabGroup, MatTabChangeEvent, MatRadioChange } from '@angular/material';
import { Usuario } from '../../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { Location } from '@angular/common';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Mantenimiento } from './mantenimiento.models';
import  {MantenimientoService} from './mantenimiento.service'
declare var swal: any;

@Component({
  selector: 'app-fotos2',
  templateUrl: './fotos2.component.html',
  styleUrls: ['./fotos2.component.css']
})

export class Fotos2Component implements OnInit {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  
  estaSobreElemento = false;

  archivos: FileItem[] = [];
  imagenSubir: FileItem[] = [];
  mantenimiento: Mantenimiento = new Mantenimiento();
  rutaFotoActual: string;
  id: string;
  comprimiendo = false;
  uploadedImage: Blob;

  fotosAntes: any;
  fotosDespues: any;

  galleryOptions: NgxGalleryOptions[];
  galleryImgAntes: NgxGalleryImage[];
  galleryImgDespues: NgxGalleryImage[];
  
  yaCargo = false;
  usuarioLogueado: Usuario;
  okCargar = false;
  url: string;
  AD: string;

  constructor(public _mantenimientoService: MantenimientoService,
    public _subirArchivoService: SubirArchivoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fotosPipe: Fotos2Pipe,
    private usuarioService: UsuarioService,
    private ng2ImgMax: Ng2ImgMaxService,
    private location: Location) {
  }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIO_ROLE) {
      this.okCargar = true;
    } else {
      this.okCargar = false;
    }

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.cargarMantenimiento(this.id);
    this.cargarFotos(this.id, 'ANTES');
    this.cargarFotos(this.id, 'DESPUES');

    this.galleryOptions = [
      {
        width: '600px',
        height: '600px',
        thumbnailsColumns: 4,
        thumbnailsRows: 2,
        thumbnailsOrder: NgxGalleryOrder.Page,
        //  thumbnailsRemainingCount: true,
        //  thumbnailSize: NgxGalleryImageSize.Contain,
        imageSize: NgxGalleryImageSize.Contain,
        //  previewFullscreen: true,
        //  previewForceFullscreen: true,
        previewCloseOnEsc: true,
        previewZoom: true,
        previewDownload: true,
        previewRotate: true,
        previewKeyboardNavigation: true,
        //  imageAutoPlay: true,
        //  imageAutoPlayInterval: 5000,
        imageAnimation: NgxGalleryAnimation.Slide,
        //  fullWidth: true
      },
      // max-width 800
      {
        breakpoint: 600,
        width: '100%',
        height: '100px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        thumbnailSize: NgxGalleryImageSize.Cover,
        thumbnailsMoveSize: 1
      },
      // max-width 400
      {
        breakpoint: 600,
        preview: false
      }
    ];
    
    this.url = '/mantenimientos';


    const indexTAB = localStorage.getItem('AntesDespues');
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
      this.AD = indexTAB.toString();
    }
    else {
      this.tabGroup.selectedIndex = 0;
      this.AD = "0";
    }
    
    
    
    

  }


  //#region  Metodos
  
  cargarMantenimiento(id: string) {
    this._mantenimientoService.getMantenimiento(id)
      .subscribe(mant => {
        this.mantenimiento = mant.mantenimiento;
      });
  }
  
  cargarFotos(id: string, antes_despues: string) {
    if (antes_despues === 'ANTES') {
      const images = [];
      this._mantenimientoService.getFotosAntes(id).subscribe((fotos) => {
        console.log(fotos);
        this.fotosAntes = fotos.fotos;
        this.fotosAntes.forEach(foto => {
          const data = this.fotosPipe.transform(foto.Key);
          const image = {
            small: data,
            medium: data,
            big: data
          };
          images.push(image);
        });
        this.galleryImgAntes = images;
      });
    } else {
      if (antes_despues === 'DESPUES') {
        const images = [];
        this._mantenimientoService.getFotosDespues(id).subscribe((fotos) => {
          this.fotosDespues = fotos.fotos;
          this.fotosDespues.forEach(foto => {
            const data = this.fotosPipe.transform(foto.Key);
            const image = {
              small: data,
              medium: data,
              big: data
            };
            images.push(image);
          });
          this.galleryImgDespues = images;
        });
      }
    }
  }

  subirFotos() {
    const AD = this.AD==="0"? "ANTES":"DESPUES";
    console.log(this.archivos);
    const promesa = this._mantenimientoService.subirFotos(this.archivos, AD, this.mantenimiento._id);
    promesa.then((value: boolean) => {
      if (value) {
        this.yaCargo = value;
        this.actualizaFotosDespuesdeCargar(value,AD);
      }
    });
  }

  seleccionImagen(archivosLista: File[]) {
    if (this.yaCargo) {
      this.limpiarArchivos();
    }
    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        this.comprimiendo = true;
        this.ng2ImgMax.resizeImage(archivoTemporal, 800, 600).subscribe(
          result => {
            const nuevoArchivo = new FileItem(new File([result], result.name));
            this.archivos.push(nuevoArchivo);
            this.comprimiendo = false;
          },
          error => {
            this.comprimiendo = false;
            console.log('😢 Oh no!', error);
          }
        );
      }
    }
  }

  limpiarArchivos() {
    this.archivos = [];
    this.yaCargo = false;
  }

  eliminaFoto(key: string, AD: string) {
    console.log(key);
    if (key === undefined && this.galleryImgAntes.length > 0 && AD === 'ANTES') {
      key = this.galleryImgAntes[0].medium as string;
    } else if (key === undefined && this.galleryImgDespues.length > 0 && AD === 'DESPUES') {
      key = this.galleryImgDespues[0].medium as string;
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
    const nameimg = key.substring(key.lastIndexOf('/') + 1, key.length);
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a la foto seleccionada \n ' + nameimg,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          const promesa = this._mantenimientoService.eliminaFoto(this.mantenimiento._id,AD,nameimg);
          promesa.then((value: boolean) => {
            if (value) {
              this.rutaFotoActual = undefined;
              this.cargarFotos(this.id, AD);
            }
          });
        }
      });

  }

  DescargarZip(AD:string) {
    this._mantenimientoService.getFotosZip(this.mantenimiento._id,AD).subscribe(mant => { });
  }

  //#endregion
  

  actualizaFotosDespuesdeCargar(ok,AD:string) {
    if (ok) this.cargarFotos(this.id, AD);
  }

  cargarImgenesSelect() {
  }

  // validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoYaFueronDroppeados(archivo.name) && this._esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
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

  back() {
    let history;
    const array = [];
    // Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      // asigno a mi variable history lo que obtengo de localStorage (history)
      history = JSON.parse(localStorage.getItem('historyArray'));

      // realizo este ciclo para asignar los valores del JSON al Array
      // tslint:disable-next-line: forin
      for (const i in history) {
        array.push(history[i]);
      }

      // Asigno a mi variable el valor del ultimo elemento del array para saber a donde regresare.
      // pop() elimina del array el ultimo elemento
      this.url = array.pop();

      // Asigno a localStorage (history) el nuevo JSON
      localStorage.setItem('historyArray', JSON.stringify(array));
    }

    this.router.navigate([this.url]);
  }

  //#region  Eventos

  onChange(data: any): void {
    this.rutaFotoActual = data.image.medium;
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.AD = event.index.toString();
    localStorage.setItem('AntesDespues', event.index.toString());
  }

  radioChange(event: MatRadioChange) {
    this.tabGroup.selectedIndex = event.value
}



  //#endregion




}
