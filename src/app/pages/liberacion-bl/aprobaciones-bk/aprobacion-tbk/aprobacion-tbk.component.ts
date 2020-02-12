import { Component, OnInit, ViewChild } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatTabGroup,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatTabChangeEvent
} from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { ExcelService } from "src/app/services/service.index";
import * as _moment from "moment";
import { Liberacion } from "../../liberacion.models";
import { LiberacionBLService } from "../../liberacion-bl.service";
declare var swal: any;

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
  selector: "app-aprobacion-tbk",
  templateUrl: "./aprobacion-tbk.component.html",
  styleUrls: ["./aprobacion-tbk.component.css"],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "es-mx" }
  ]
})
export class AprobacionTBKComponent implements OnInit {
  fIni = moment()
    .local()
    .startOf("day")
    .subtract(1, "month");
  fFin = moment()
    .local()
    .startOf("day");

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator; //descargas
  @ViewChild(MatSort) sort: MatSort; //descargas

  // @ViewChild('pagDescargas', { read: MatPaginator }) pagDescargas: MatPaginator; //cargas
  // @ViewChild('sortDescargas') sortDescargas: MatSort; //cargas

  @ViewChild("pagCargas", { read: MatPaginator }) pagCargas: MatPaginator; //cargas
  @ViewChild("sortCargas") sortCargas: MatSort; //cargas

  cargando = true;
  aprobacionesExcel = [];

  displayedColumnsCarga = [
    "actions",
    "fAlta",
    "tipo",
    "naviera.nombreComercial",
    "cliente.nombreComercial",
    "observaciones",
    "estatus"
  ];

  dtCargas: any;
  totalRegistrosCargas = 0;

  constructor(
    public liberacionService: LiberacionBLService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.cargaSolicitudes("C");
    let indexTAB = localStorage.getItem("AprobacionTabs");
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
  }

  cargaSolicitudes(CD: string) {
    var naviera = "5e279f5f18e40063e7539339" || "5c49e55b6b427b166466c9b3";
    this.cargando = true;
    if (CD == "C") {
      this.cargando = true;
      this.liberacionService
        .getLiberacion(
          "C",
          "",
          this.fIni ? this.fIni.utc().format("DD-MM-YYYY") : "",
          this.fFin ? this.fFin.utc().format("DD-MM-YYYY") : "",
          naviera
        )
        .subscribe(resp => {
          //this.dtCargas = resp.solicitudes;
          this.dtCargas = new MatTableDataSource(resp.liberacion);
          this.dtCargas.sort = this.sortCargas;
          this.dtCargas.paginator = this.pagCargas;
          this.totalRegistrosCargas = resp.total;
          // this.dtCargas.filterPredicate  = this.Filtro();
        });
    }
    this.cargando = false;
  }

  applyFilterCargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dtCargas && this.dtCargas.data.length > 0) {
      this.dtCargas.filter = filterValue;
      this.totalRegistrosCargas = this.dtCargas.filteredData.length;
    } else {
      console.error("Error al filtrar el dataSource de Cargas");
    }

    // this.dtCargas.filter = filterValue;
    // this.totalRegistrosCargas = this.dtCargas.filteredData.length;
  }

  onLinkClick(event: MatTabChangeEvent) {
    //console.log(event.index);
    localStorage.setItem("AprobacionTabs", event.index.toString());
  }

  borrarSolicitud(liberacion: Liberacion) {
    swal({
      title: "¿Esta seguro?",
      text: "Esta apunto de borrar la solicitud.",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.liberacionService
          .borrarSolicitud(liberacion._id)
          .subscribe(borrado => {
            this.cargaSolicitudes(liberacion.tipo);
          });
      }
    });
  }

  // Filtro(): (data: any, filter: string) => boolean {
  //   let filterFunction = function (data, filter): boolean {
  //     const dataStr = data.contenedor.toLowerCase() +
  //       (data.folio ? data.folio : '') +
  //       data.tipo.toLowerCase() +
  //       data.peso.toLowerCase() +
  //       (data.viaje ? data.viaje.viaje.toLowerCase() : '') +
  //       (data.cliente ? data.cliente.nombreComercial.toLowerCase() : '') +
  //       (data.viaje ? data.viaje.buque.nombre.toLowerCase() : '') +
  //       (data.agencia ? data.agencia.nombreComercial.toLowerCase() : '');
  //     return dataStr.indexOf(filter) != -1;
  //   }
  //   return filterFunction;
  // }

  CreaDatosExcel(datos) {
    datos.forEach(b => {
      var buque = {
        //Id: b._id,
        FAlta: b.fAlta.substring(0, 10),
        Tipo: b.tipo,
        Agencia:
          b.agencia &&
          b.agencia.nombreComercial &&
          b.agencia.nombreComercial != undefined &&
          b.agencia.nombreComercial != "" &&
          b.agencia.nombreComercial,
        Naviera:
          b.naviera &&
          b.naviera.nombreComercial &&
          b.naviera.nombreComercial != undefined &&
          b.naviera.nombreComercial != "" &&
          b.naviera.nombreComercial,
        Cliente:
          b.cliente &&
          b.cliente.nombreComercial &&
          b.cliente.nombreComercial != undefined &&
          b.cliente.nombreComercial != "" &&
          b.cliente.nombreComercial,
        Viaje:
          b.viaje &&
          b.viaje.viaje &&
          b.viaje.viaje != undefined &&
          b.viaje.viaje != ""
            ? b.viaje.viaje
            : "" && b.viaje.viaje,
        Nombre_Buque:
          b.viaje.buque &&
          b.viaje.buque != undefined &&
          b.viaje.buque.nombre != ""
            ? b.viaje.buque.nombre
            : "" && b.viaje.buque.nombre,
        Observaciones: b.observaciones,
        Estatus: b.estatus
      };
      this.aprobacionesExcel.push(buque);
    });
  }

  exportAsXLSXD(dtDescargas, nombre: string): void {
    this.CreaDatosExcel(dtDescargas.filteredData);
    if (this.aprobacionesExcel) {
      this.excelService.exportAsExcelFile(this.aprobacionesExcel, nombre);
    } else {
      swal("No se puede exportar un excel vacio", "", "error");
    }
  }

  CreaDatosExcelC(datos) {
    datos.forEach(b => {
      var buque = {
        //Id: b._id,
        FAlta: b.fAlta.substring(0, 10),
        Tipo: b.tipo,
        Agencia:
          b.agencia &&
          b.agencia.nombreComercial &&
          b.agencia.nombreComercial != undefined &&
          b.agencia.nombreComercial != "" &&
          b.agencia.nombreComercial,
        Cliente:
          b.cliente &&
          b.cliente.nombreComercial &&
          b.cliente.nombreComercial != undefined &&
          b.cliente.nombreComercial != "" &&
          b.cliente.nombreComercial,
        Observaciones: b.observaciones,
        Estatus: b.estatus
      };
      this.aprobacionesExcel.push(buque);
    });
  }

  exportAsXLSXC(dtCargas, nombre: string): void {
    this.CreaDatosExcelC(dtCargas.filteredData);
    if (this.aprobacionesExcel) {
      this.excelService.exportAsExcelFile(this.aprobacionesExcel, nombre);
    } else {
      swal("No se puede exportar un excel vacio", "", "error");
    }
  }
}
