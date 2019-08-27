import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item.models';
import { ManiobraService } from '../maniobras/maniobra.service';
import { SubirArchivoService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { Maniobra } from '../maniobras/maniobra.models';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css']
})

export class FotosComponent implements OnInit {
  // maniobra: Maniobra;
  estaSobreElemento = false;
  archivos: FileItem[] = [];
  imagenSubir:  FileItem[] = [];
  maniobra: Maniobra = new Maniobra();
  foto: Maniobra = new Maniobra('');
  selected = 'fotos_lavado';
  id: string;

  // items = [{ruta: '../../../assets/images/1.jpg', estado: 'active'},
  //           {ruta: '../../../assets/images/2.jpg', estado: ''},
  //           {ruta: '../../../assets/images/1.jpg', estado: ''}];
  fotosLavado;
  fotosReparacion;

  constructor(public _maniobraService: ManiobraService,
    public _subirArchivoService: SubirArchivoService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
      activatedRoute.params.subscribe();
    }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarManiobra( this.id );
    this.cargarFotos(this.id, "L");
    this.cargarFotos(this.id, "R");
  }

  cargarManiobra( id: string) {
    this._maniobraService.getManiobra( id )
          .subscribe( maniobra => {
            this.maniobra = maniobra.maniobra;
          });
  }

  cargarFotos(id: string, lavado_reparacion: string) {
    if(lavado_reparacion === "L") {
      this._maniobraService.getFotos(id, lavado_reparacion).subscribe((fotos) => {
        this.fotosLavado = fotos.fotos;
      });
    } else {
      if(lavado_reparacion === "R") {
        this._maniobraService.getFotos(id, lavado_reparacion).subscribe((fotos) => {
          this.fotosReparacion = fotos.fotos;
        });
      }
    }
  }

  cargarImagenes() {
    this._subirArchivoService.cargarImagenesMongo(this.archivos, this.selected, this.maniobra._id);
  }

  cargarImgenesSelect() {
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  borrarFotoLavado( id: string, foto: string ) {
    console.log(id);
    console.log(foto);
    this._maniobraService.removerFotosLavados(id, foto)
    .subscribe(maniobra => {
          this.maniobra._id = this.maniobra._id;
          this.cargarManiobra(this.maniobra._id);
    });

  }

  borrarFotoReparado( id: string, foto: string ) {
    console.log(id);
    console.log(foto);
    this._maniobraService.removerFotosReparados(id, foto)
    .subscribe(maniobra => {
          this.maniobra._id = this.maniobra._id;
          this.cargarManiobra(this.maniobra._id);
    });

  }

  seleccionImagen(archivo: FileItem[] = []) {
    console.log(archivo);
  }

}
