import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray
} from "@angular/forms";
import { Buque } from "../buques/buques.models";
import { Naviera } from "../navieras/navieras.models";
import {
  ViajeService,
  BuqueService,
  NavieraService
} from "../../services/service.index";
import { SubirArchivoService } from "../../services/subirArchivo/subir-archivo.service";
import { ExcelService } from "../../services/excel/excel.service";
import { ESTADOS_CONTENEDOR_ARRAY, PATIOS_ARRAY } from "../../config/config";
import swal from "sweetalert";

// datapiker
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import * as _moment from "moment";
import { TiposContenedoresService } from "../tipos-contenedores/tipos-contenedores.service";
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ["l", "L"]
  },
  display: {
    dateInput: "L",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: "app-viaje",
  templateUrl: "./viaje.component.html",
  styleUrls: ["./viaje.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "es-mx" }
  ]
})
export class ViajeComponent implements OnInit {
  cargando: boolean = true;
  regForm: FormGroup;
  fileTemporal: File = null;
  fileExcel: File = null;
  temporal = false;
  edicion = false;
  buques: Buque[] = [];
  navieras: Naviera[] = [];
  tiposContenedor: any[] = [];
  erroresCarga: string[] = [];

  estadosContenedor = ESTADOS_CONTENEDOR_ARRAY;
  PA = PATIOS_ARRAY;

  constructor(
    private _viajeService: ViajeService,
    private _tipoContenedorService: TiposContenedoresService,
    private _buqueService: BuqueService,
    private _navieraService: NavieraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _subirArchivoService: SubirArchivoService,
    private _excelService: ExcelService
  ) {}

  ngOnInit() {
    this._buqueService
      .getBuques()
      .subscribe(buques => (this.buques = buques.buques));
    this._navieraService
      .getNavieras()
      .subscribe(navieras => (this.navieras = navieras.navieras));
    this._tipoContenedorService
      .getTiposContenedor()
      .subscribe(tipos => (this.tiposContenedor = tipos.tiposContenedor));
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id !== "nuevo" && id !== "") {
      this.edicion = true;
      this.cargarViaje(id);
    } else {
      this.naviera.setValue("5c49e55b6b427b166466c9b3"); // por default se pone a maritima maya..
    }
    this.contenedores.removeAt(0);
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      naviera: ["", [Validators.required]],
      viaje: ["", [Validators.required]],
      buque: ["", [Validators.required]],
      fArribo: [
        moment()
          .local()
          .startOf("day")
      ],
      fVigenciaTemporal: [
        moment()
          .local()
          .startOf("day")
          .add(10, "years")
      ],
      pdfTemporal: [""],
      contenedores: this.fb.array([
        this.creaContenedor("", "", "", "", "", "")
      ]),
      anio: [
        moment()
          .local()
          .year()
      ],
      _id: [""]
    });
  }

  creaContenedor(
    cont: string,
    tipo: string,
    peso: string,
    dest: string,
    estatus: string,
    patio: string
  ): FormGroup {
    return this.fb.group({
      contenedor: [cont],
      tipo: [tipo],
      peso: [peso],
      destinatario: [dest],
      estatus: [estatus], // DETERMINA EN QUE FASE SE ENCUENTRA LA MANIOBRA
      patio: [patio]
    });
  }

  /* #region Propiedades  */
  get _id() {
    return this.regForm.get("_id");
  }
  get viaje() {
    return this.regForm.get("viaje");
  }
  get naviera() {
    return this.regForm.get("naviera");
  }
  get buque() {
    return this.regForm.get("buque");
  }
  get fArribo() {
    return this.regForm.get("fArribo");
  }
  get fVigenciaTemporal() {
    return this.regForm.get("fVigenciaTemporal");
  }
  get pdfTemporal() {
    return this.regForm.get("pdfTemporal");
  }
  get anio() {
    return this.regForm.get("anio");
  }
  get contenedores() {
    return this.regForm.get("contenedores") as FormArray;
  }

  /* #endregion */

  addContenedor(
    cont: string,
    tipo: string,
    peso: string,
    destinatario: string,
    estatus: string,
    patio: string
  ): void {
    if (cont === "") {
      swal("", "El contenedor no pues estar vacio.", "error");
      return;
    }
    this.contenedores.push(
      this.creaContenedor(cont, tipo, peso, destinatario, estatus, patio)
    );
  }

  addContenedor2(
    cont: string,
    tipo: string,
    peso: string,
    destinatario: string,
    patio: string
  ): void {
    if (this._id.value) {
      if (cont != "" && tipo != "" && peso != "") {
        this._viajeService
          .addContenedor(
            this._id.value,
            this.formateoContenedor(cont),
            tipo,
            peso,
            destinatario,
            patio
          )
          .subscribe(res => {
            if (res.ok) {
              this.addContenedor(
                this.formateoContenedor(cont),
                tipo,
                peso,
                destinatario,
                "APROBACION",
                res.maniobra.patio
              );
              swal("Contenedor Agregado con exito", "", "success");
            }
          });
      } else {
        swal("", "El contenedor, tipo y peso no pues estar vacio.", "error");
      }
    } else {
      if (cont != "" && tipo != "" && peso != "") {
        this.addContenedor(
          this.formateoContenedor(cont),
          tipo,
          peso,
          destinatario,
          "",
          patio
        );
      } else {
        swal("", "El contenedor, tipo y peso no pues estar vacio.", "error");
      }
    }
  }

  quitarContenedor(indice: number) {
    // console.log( this.contenedores.controls[indice].get('contenedor').value);
    if (this._id.value) {
      this._viajeService
        .removerContenedor(
          this._id.value,
          this.contenedores.controls[indice].get("contenedor").value
        )
        .subscribe(res => {
          if (res.ok) {
            this.contenedores.removeAt(indice);
            swal("Contenedor Eliminado", "", "success");
          }
        });
    } else {
      this.contenedores.removeAt(indice);
    }
  }

  cargarViaje(id: string) {
    this._viajeService.getViajeXID(id).subscribe(viaje => {
      this.regForm.controls["_id"].setValue(viaje._id);
      this.regForm.controls["viaje"].setValue(viaje.viaje);
      this.regForm.controls["buque"].setValue(viaje.buque);
      this.regForm.controls["naviera"].setValue(viaje.naviera);
      this.regForm.controls["fArribo"].setValue(viaje.fArribo);
      this.regForm.controls["fVigenciaTemporal"].setValue(
        viaje.fVigenciaTemporal
      );
      this.regForm.controls["pdfTemporal"].setValue(viaje.pdfTemporal);
      this.regForm.controls["anio"].setValue(viaje.anio);
      viaje.contenedores.forEach(element => {
        this.addContenedor(
          element.contenedor,
          element.tipo,
          element.peso,
          element.destinatario,
          element.estatus,
          element.patio
        );
      });
    });
  }

  guardarViaje() {
    if (this.regForm.valid) {
      if (this.contenedores.length == 0) {
        swal({
          title: "Estas seguro de dar de alta un viaje sin contenedores?",
          text: "Solo podras agregar contenedores manualmente, si quieres dar de alta el viaje desde plantilla tendrás que eliminar este viaje y crear uno nuevo.",
          icon: "warning",
          buttons: ["No!", "Si, Estoy seguro!"],
          dangerMode: true
        })
       
        .then(ok => {
          if (ok) {
            this._viajeService
              .guardarViaje(this.regForm.value)
              .subscribe(res => {
                this.fileTemporal = null;
                this.temporal = false;
                if (this.regForm.get("_id").value === "") {
                  this.regForm.get("_id").setValue(res._id);
                  this.edicion = true;
                  this.router.navigate([
                    "/viaje",
                    this.regForm.get("_id").value
                  ]);
                }
                this.regForm.markAsPristine();
              });
          }
        });
        // swal({
        //   title: "Estas seguro de dar de alta un viaje sin contenedores?",
        //   text:
        //     "Solo podras agregar contenedores manualmente, si quieres dar de alta el viaje desde plantilla tendrás que eliminar este viaje y crear uno nuevo.",
        //   icon: "warning",
        //   buttons: ["No!", "Si, Estoy seguro!"],
        //   dangerMode: true
        // }).then(function(isConfirm) {
        //   if (isConfirm) {

        //   } else {
        //     swal("Cancelled", "Your imaginary file is safe :)", "error");
        //   }
        // })
      } else {         
           this._viajeService
        .guardarViaje(this.regForm.value)
        .subscribe(res => {
          this.fileTemporal = null;
          this.temporal = false;
          if (this.regForm.get("_id").value === "") {
            this.regForm.get("_id").setValue(res._id);
            this.edicion = true;
            this.router.navigate([
              "/viaje",
              this.regForm.get("_id").value
            ]);
          }
          this.regForm.markAsPristine();
        });

      }
    }
  }

  cargarBuques(event) {
    this._buqueService.getBuqueXNaviera(event.value).subscribe(buques => {
      this.buques = buques.buques;
    });
  }

  onFileExcelSelected(event) {
    this.fileExcel = <File>event.target.files[0];
    this.cargarExcel();
  }
  onFilePDFSelected(event) {
    this.fileTemporal = <File>event.target.files[0];
    this.subirFormato();
  }

  subirFormato() {
    this._subirArchivoService
      .subirArchivoBucketTemporal(this.fileTemporal)
      .subscribe(nombreArchivo => {
        this.regForm.get("pdfTemporal").setValue(nombreArchivo);
        this.regForm.get("pdfTemporal").markAsDirty();
        this.temporal = true;
        this.guardarViaje();
      });
  }

  cambiaVigencia() {
    if (this.fArribo.value) {
      this.fVigenciaTemporal.setValue(
        this.fArribo.value.clone().add(10, "years")
      );
      this.anio.setValue(this.fArribo.value.year());
    }
  }
  cargarExcel() {
    this.regForm.markAsDirty();
    while (this.contenedores.length !== 0) {
      this.contenedores.removeAt(0);
    }
    this.erroresCarga = [];
    this._excelService.excelToJSON(this.fileExcel).subscribe(res => {
      res.forEach(element => {
        const indexTipo = this.tiposContenedor.find(
          dato => dato.tipo === element.Tipo.replace("'", "")
        );
        if (!indexTipo) {
          // tslint:disable-next-line:max-line-length
          this.erroresCarga.push(
            `Contenedor: ${
              element.Contenedor
            } no agregado, tipo ( ${element.Tipo.replace(
              "'",
              ""
            )} ) no encontrado`
          );
        } else {
          this.addContenedor(
            this.formateoContenedor(element.Contenedor),
            element.Tipo.replace("'", ""),
            element.Peso,
            element.Cliente,
            "NUEVO",
            element.Patio
          );
        }
      });
      this.regForm.controls["viaje"].setValue(res[0].Viaje);
      const index = this.buques.find(dato => dato.nombre === res[0].Buque);
      if (!index) {
        swal(
          "El nombre del Buque",
          "No fue encontrado en el catalogo",
          "error"
        );
      } else {
        this.regForm.controls["buque"].setValue(index._id);
      }
    });
  }

  formateoContenedor(contenedor: string): string {
    var final;

    final = contenedor.replace(/-/g, "");
    final = final.replace(/ /g, "");
    final = final.replace("'", "");

    return final.trim();
  }
}
