import { Component, OnInit, ViewChild } from "@angular/core";
import { Transportista } from "./transportista.models";
import {
  TransportistaService,
  ExcelService
} from "../../services/service.index";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
declare var swal: any;

@Component({
  selector: "app-transportistas",
  templateUrl: "./transportistas.component.html",
  styles: []
})
export class TransportistasComponent implements OnInit {
  transportistas: Transportista[] = [];
  cargando = true;
  totalRegistros = 0;
  transportistaExcel = [];

  displayedColumns = [
    "actions",
    "img",
    "rfc",
    "razonSocial",
    "calle",
    "noExterior",
    "noInterior",
    "colonia",
    "municipio",
    "ciudad",
    "estado",
    "cp",
    "formatoR1",
    "correo",
    "correoFac",
    "credito",
    "caat"
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _transportistaService: TransportistaService,
    private excelService: ExcelService
  ) {}
  ngOnInit() {
    this.cargarTransportistas();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error("Error al filtrar el dataSource de Transportistas");
    }
  }

  cargarTransportistas() {
    this.cargando = true;
    this._transportistaService.getTransportistas().subscribe(transportistas => {
      this.dataSource = new MatTableDataSource(transportistas.transportistas);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = transportistas.transportistas.length;
    });
    this.cargando = false;
  }

  borrarTransportista(transportista: Transportista) {
    swal({
      title: "¿Esta seguro?",
      text: "Esta apunto de borrar a " + transportista.nombreComercial,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._transportistaService
          .borrarTransportista(transportista._id)
          .subscribe(borrado => {
            this.cargarTransportistas();
          });
      }
    });
  }

  crearDatosExcel(datos) {
    datos.forEach(d => {
      var transportista = {
        Rfc: d.rfc,
        RazonSocial: d.razonSocial,
        Calle: d.calle,
        No_Exterior: d.noExterior,
        No_Interior: d.noInterior,
        Colonia: d.colonia,
        Municipio: d.municipio,
        Ciudad: d.ciudad,
        Estado: d.estado,
        Cp: d.cp,
        Correo: d.correo,
        CorreoFac: d.correoFac,
        Credito: d.credito,
        Caat: d.Caat
      };
      this.transportistaExcel.push(transportista);
    });
  }

  exportarXLSX() {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.transportistaExcel) {
      this.excelService.exportAsExcelFile(
        this.transportistaExcel,
        "Transportista"
      );
    } else {
      swal("No se puede exportar un excel vacio", "", "error");
    }
  }
}
