import { Component, OnInit, ViewChild } from '@angular/core';
import { FileItem } from '../../models/file-item.models';
import { ManiobraService } from '../maniobras/maniobra.service';
import { SubirArchivoService, UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { Maniobra } from '../../models/maniobra.models';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryLayout, NgxGalleryImageSize, NgxGalleryOrder } from 'ngx-gallery';
import { FotosPipe } from 'src/app/pipes/fotos.pipe';
import { MatTabGroup, MatTabChangeEvent, MatTab } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { Location } from '@angular/common';
import { Ng2ImgMaxService } from 'ng2-img-max';
declare var swal: any;

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css']
})

export class FotosComponent implements OnInit {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  // maniobra: Maniobra;
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  imagenSubir: FileItem[] = [];
  maniobra: Maniobra = new Maniobra();
  foto: Maniobra = new Maniobra('');
  rutaFotoActual: string;
  selected = 'fotos_lavado';
  id: string;

  comprimiendo = false;

  uploadedImage: Blob;

  fotosLavado: any;
  fotosReparacion: any;

  galleryOptions: NgxGalleryOptions[];
  galleryImagesL: NgxGalleryImage[];
  galleryImagesR: NgxGalleryImage[];
  yaCargo = false;
  usuarioLogueado: Usuario;
  okCargar = false;
  url: string;


  constructor(public _maniobraService: ManiobraService,
    public _subirArchivoService: SubirArchivoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fotosPipe: FotosPipe,
    private usuarioService: UsuarioService,
    private ng2ImgMax: Ng2ImgMaxService,
    private location: Location) {
  }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIO_ROLE) {
      this.okCargar = true;
    } else {
      this.okCargar = false;
    }

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.selected = this.activatedRoute.snapshot.params.get('opcion');
    this.selected = this.activatedRoute.snapshot.queryParams['opcion'];
    // console.log(this.id);
    // console.log(this.selected);
    this.cargarManiobra(this.id);
    this.cargarFotos(this.id, 'L');
    this.cargarFotos(this.id, 'R');
    this.SeleccionaTab(this.selected);

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
    this.url = '/contenedoresLR'; 
  }

  onChange(data: any): void {
    this.rutaFotoActual = data.image.medium;
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobra(id)
      .subscribe(maniobra => {
        this.maniobra = maniobra.maniobra;
      });
  }

  cargarFotos(id: string, lavado_reparacion: string) {
    if (lavado_reparacion === 'L') {
      const images = [];
      this._maniobraService.getFotos(id, lavado_reparacion).subscribe((fotos) => {
        this.fotosLavado = fotos.fotos;
        this.fotosLavado.forEach(foto => {
          const data = this.fotosPipe.transform(foto.Key);
          const image = {
            small: data,
            medium: data,
            big: data
          };
          images.push(image);
        });
        this.galleryImagesL = images;

        // console.log(images)
        // console.log(this.galleryImagesL)
      });
    } else {
      if (lavado_reparacion === 'R') {
        const images = [];
        this._maniobraService.getFotos(id, lavado_reparacion).subscribe((fotos) => {
          this.fotosReparacion = fotos.fotos;
          this.fotosReparacion.forEach(foto => {
            const data = this.fotosPipe.transform(foto.Key);
            const image = {
              small: data,
              medium: data,
              big: data
            };
            images.push(image);
          });
          this.galleryImagesR = images;

          // console.log(images)
          // console.log(this.galleryImagesR)
        });
      }
    }
  }

  eliminaFoto(key: string, LR: string) {
    if (key == undefined && this.galleryImagesL.length > 0 && LR == 'L') {
      key = this.galleryImagesL[0].medium as string;
    } else if (key == undefined && this.galleryImagesR.length > 0 && LR == 'R') {
      key = this.galleryImagesR[0].medium as string;
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
    var ruta = key.substring(key.lastIndexOf("maniobras"), key.length);
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a la foto seleccionada \n ' + key.substring(key.lastIndexOf('/') + 1, key.length),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          
          const promesa = this._maniobraService.eliminaFoto(ruta);          
          promesa.then((value: boolean) => {
            if (value) {
              this.rutaFotoActual = undefined;
              if (LR === 'L') {
                this.cargarFotos(this.id, 'L');
              } else if (LR === 'R') {
                this.cargarFotos(this.id, 'R');
              }
            }
          });
        }
      });

  }

  SeleccionaTab(opcion) {
    if (opcion === 'fotos_lavado') {
      this.tabGroup.selectedIndex = 0;
    } else {
      if (opcion === 'fotos_reparacion') {
        this.tabGroup.selectedIndex = 1;
      } else {
        this.tabGroup.selectedIndex = 2;
      }
    }
  }

  cargarImagenes() {
    const promesa = this._subirArchivoService.cargarFotosLavadoReparacion(this.archivos, this.selected, this.maniobra._id);
    promesa.then((value: boolean) => {
      if (value) {
        this.yaCargo = value;
        this.actualizaFotosDespuesdeCargar(value);
      }
    });
  }

  actualizaFotosDespuesdeCargar(ok) {
    if (ok) {
      if (this.selected === 'fotos_lavado') {
        this.cargarFotos(this.id, 'L');
      } else {
        if (this.selected === 'fotos_reparacion') {
          this.cargarFotos(this.id, 'R');
        }
      }
    }
  }

  onLinkClick(event: MatTabChangeEvent) {
    if (event.tab.textLabel !== 'carga' && this.archivos.length > 0) {
      this.limpiarArchivos();
    }
  }

  cargarImgenesSelect() {
  }

  limpiarArchivos() {
    this.archivos = [];
    this.yaCargo = false;
  }

  borrarFotoLavado(id: string, foto: string) {
    this._maniobraService.removerFotosLavados(id, foto)
      .subscribe(maniobra => {
        this.maniobra._id = this.maniobra._id;
        this.cargarManiobra(this.maniobra._id);
      });

  }

  borrarFotoReparado(id: string, foto: string) {
    this._maniobraService.removerFotosReparados(id, foto)
      .subscribe(maniobra => {
        this.maniobra._id = this.maniobra._id;
        this.cargarManiobra(this.maniobra._id);
      });

  }

  seleccionImagen(archivosLista: File[]) {
    if (this.yaCargo) {
      this.limpiarArchivos();
    }
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
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    // this.location.back();
  }

  mostrarReparaciones(maniobra: Maniobra) {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIO_ROLE) {
      return true;
    } else {
      if (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE && maniobra.mostrarFotosRNaviera) {
        return true;
      } else if (this.usuarioLogueado.role === ROLES.AA_ROLE && maniobra.mostrarFotosRAA) {
        return true;
      } else {
        return false;
      }
    }
  }
}
