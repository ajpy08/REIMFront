import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { FileItem } from '../../models/file-item.models';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { HttpClient , HttpEventType} from '@angular/common/http';

@Injectable()
export class SubirArchivoService {
  constructor(public http: HttpClient) { }

  subirArchivoTemporal(archivo: File, tipo: string ): Observable<any> {
      if (!archivo) {
      return;
    }
    const formData = new FormData();
    formData.append('file', archivo, archivo.name);
    const url = URL_SERVICIOS + '/uploadFileTemp';
    return this.http.put( url, formData )
    .pipe(map( (resp: any) => {
      swal('Archivo Cargado', resp.nombreArchivo, 'success');
      return resp.nombreArchivo;
    }),
    catchError( err => {
      swal( err.error.mensaje, err.error.errors.message, 'error' );
      return throwError(err);
    }));
  }

  cargarImagenesMongo(imagenes: FileItem[], tipo: string, id: string) {
    return new Promise((resolve, reject) => {
      for (const item of imagenes) {
        const formData = new FormData();
        formData.append('file', item.archivo, item.nombreArchivo);
        const url = URL_SERVICIOS + '/maniobra/addimg/' + id;
        this.http.put( url, formData, {reportProgress: true, observe: 'events'} )
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            item.progreso = Math.round( event.loaded / event.total * 100);
          } else if (event.type === HttpEventType.Response) {
            console.log(event);
          }
        });
      }
    });
  }

  // subirArchivo(archivo: File, tipo: string, id: string) {
  //   return new Promise((resolve, reject) => {
  //   let formData = new FormData();
  //   let xhr = new XMLHttpRequest();
  //   formData.append('imagen', archivo, archivo.name);
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         console.log('Imagen Subida');
  //         resolve(JSON.parse(xhr.response));
  //       } else {
  //         console.log('Fallo la subida');
  //         reject(xhr.response);
  //       }
  //     }
  //   };
  //   let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
  //   xhr.open('put', url , true);
  //   xhr.send(formData);
  //   var result = JSON.parse(xhr.response);
  // console.log(result.data);
  //   });
  // }

  // subirArchivoExcel(archivo: File) {

  //   // tslint:disable-next-line:no-shadowed-variable
  //   return new Promise((resolve, reject) => {

  //     // tslint:disable-next-line:prefer-const
  //   let formData = new FormData();
  //   // tslint:disable-next-line:prefer-const
  //   let xhr = new XMLHttpRequest();


  //   formData.append('xlsx', archivo, archivo.name);

  //   xhr.onreadystatechange = function() {

  //     if (xhr.readyState === 4) {

  //       if (xhr.status === 200) {
  //         console.log('Excel Upload');
  //         resolve(JSON.parse(xhr.responseText));
  //       } else {
  //         console.log('Fallo la subida');
  //         reject(xhr.response);
  //       }

  //     }

  //   };

  //   // tslint:disable-next-line:prefer-const
  //   let url = URL_SERVICIOS + '/exceltojson';

  //   xhr.open('put', url , true);
  //   xhr.send(formData);
  //   xhr.open('Get', url , true);
  //   });
  // }




// cargarImagenesMongo(imagenes: FileItem[], tipo: string, id: string) {
//  return new Promise((resolve, reject) => {
//    for (const item of imagenes) {
//    let formData: any = new FormData();
//    let xhr = new XMLHttpRequest();
//    formData.append('imagen', item.archivo, item.nombreArchivo);
//    xhr.onload = function() {
//     if (this.status >= 200 && this.status < 300) {
//       console.log('Imagen Subida');
//       resolve(xhr.response);
//     } else {
//       reject({
//         status: this.status,
//         statusText: xhr.statusText
//       });
//     }
//   };
//   xhr.onerror = function () {
//     reject({
//       status: this.status,
//       statusText: xhr.statusText
//     });
//   };
//        let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

//        xhr.open('put', url , true);
//        xhr.send(formData);

//      }
//     });
// }


// subirArchivoMultiple(files: Array<File>, id: string) {

//   // tslint:disable-next-line:no-shadowed-variable
//   return new Promise((resolve, reject) => {

//     // tslint:disable-next-line:prefer-const
//   let formData: any = new FormData();
//   // tslint:disable-next-line:prefer-const
//   let xhr = new XMLHttpRequest();
//   for ( let i = 0; i < files.length; i++) {
//   formData.append('imagen[]', files[i], files[i].name);
//   }
//   xhr.onreadystatechange = function() {

//     if (xhr.readyState === 4) {

//       if (xhr.status === 200) {
//         console.log('Imagen Subida');
//         resolve(JSON.parse(xhr.response));
//       } else {
//         console.log('Fallo la subida');
//         reject(xhr.response);
//       }

//     }

//   };

//   // tslint:disable-next-line:prefer-const
//   let url = URL_SERVICIOS + '/dropzone/' + id;

//   xhr.open('put', url , true);
//   xhr.send(formData);


//   });
// }

}
