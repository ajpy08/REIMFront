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
import {Location} from '@angular/common'; 

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
  selected = 'fotos_lavado';
  id: string;

  fotosLavado: any;
  fotosReparacion: any;

  galleryOptions: NgxGalleryOptions[];
  galleryImagesL: NgxGalleryImage[];
  galleryImagesR: NgxGalleryImage[];
  yaCargo: boolean = false;
  usuarioLogueado: Usuario;
  okCargar: boolean = false;


  constructor(public _maniobraService: ManiobraService,
    public _subirArchivoService: SubirArchivoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fotosPipe: FotosPipe,
    private usuarioService: UsuarioService,
    private location: Location) {

  }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIMADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIM_ROLE) {
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
    this.cargarFotos(this.id, "L");
    this.cargarFotos(this.id, "R");
    this.escojeTab(this.selected);

    this.galleryOptions = [
      {
        width: '600px',
        height: '600px',
        thumbnailsColumns: 4,
        thumbnailsRows: 2,
        thumbnailsOrder: NgxGalleryOrder.Page,
        //thumbnailsRemainingCount: true,
        //thumbnailSize: NgxGalleryImageSize.Contain,
        imageSize: NgxGalleryImageSize.Contain,
        //previewFullscreen: true,
        //previewForceFullscreen: true,
        previewCloseOnEsc: true,
        previewZoom: true,
        previewRotate: true,
        previewKeyboardNavigation: true,
        //imageAutoPlay: true,
        //imageAutoPlayInterval: 5000,
        imageAnimation: NgxGalleryAnimation.Slide,
        //fullWidth: true
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
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobra(id)
      .subscribe(maniobra => {
        this.maniobra = maniobra.maniobra;
      });      
  }

  cargarFotos(id: string, lavado_reparacion: string) {
    if (lavado_reparacion === "L") {
      const images = [];
      this._maniobraService.getFotos(id, lavado_reparacion).subscribe((fotos) => {
        this.fotosLavado = fotos.fotos;
        this.fotosLavado.forEach(foto => {
          let data = this.fotosPipe.transform(foto.Key, [id, 'L']);
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
      if (lavado_reparacion === "R") {
        const images = [];
        this._maniobraService.getFotos(id, lavado_reparacion).subscribe((fotos) => {
          this.fotosReparacion = fotos.fotos;
          this.fotosReparacion.forEach(foto => {
            let data = this.fotosPipe.transform(foto.Key, [id, 'R']);
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

  escojeTab(opcion) {
    //console.log(opcion)
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
        //console.log("yaCargo de fotos.component: " +  this.yaCargo)
        this.actualizaFotosDespuesdeCargar(value);
      }
    })
  }

  actualizaFotosDespuesdeCargar(ok) {
    if (ok) {
      if (this.selected === 'fotos_lavado') {
        this.cargarFotos(this.id, "L");
      } else {
        if (this.selected === 'fotos_reparacion') {
          this.cargarFotos(this.id, "R");
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
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
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
        console.log('El archivo' + nombreArchivo + ' ya esta agregado');
        return true;
      }
    }
    return false;
  }

  atras(){
    this.location.back();
  }

}
