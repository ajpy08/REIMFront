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

  items = [{ruta: '../../../assets/images/1.jpg', estado: 'active'},
            {ruta: '../../../assets/images/2.jpg', estado: ''},
            {ruta: '../../../assets/images/1.jpg', estado: ''}];

  constructor(public _maniobraService: ManiobraService,
    public _subirArchivoService: SubirArchivoService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
      activatedRoute.params.subscribe();
    }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarManiobra( id );
  }

  cargarManiobra( id: string) {
    this._maniobraService.getManiobra( id )
          .subscribe( maniobra => {
            console.log(maniobra);
            this.maniobra = maniobra.maniobra;
          });
  }

  cargarImagenes() {

    this._subirArchivoService.cargarImagenesMongo(this.archivos, this.selected, this.maniobra._id);
  }

  cargarImgenesSelect() {
    console.log();
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
