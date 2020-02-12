import { OnInit, ViewChild, Component } from "@angular/core";
import { Naviera } from "./navieras.models";
import { NavieraService, ExcelService } from "../../services/service.index";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
declare var swal: any;
@Component({
  selector: "app-navieras",
  templateUrl: "./navieras.component.html"
})
export class NavierasComponent implements OnInit {
  navieras: Naviera[] = [];
  cargando = true;
  totalRegistros = 0;
  navieraExcel = [];

  displayedColumns = [
    "actions",
    "img",
    "rfc",
    "razonSocial",
    "calle",
    "noExterior",
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

  // displayedColumns = ['actions', 'img', 'razonSocial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
  // 'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'caat'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _navieraService: NavieraService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.cargarNavieras();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error("Error al filtrar el dataSource de Navieras");
    }
  }

  cargarNavieras() {
    this.cargando = true;
    this._navieraService.getNavieras().subscribe(navieras => {
      this.dataSource = new MatTableDataSource(navieras.navieras);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = navieras.navieras.length;
    });
    this.cargando = false;
  }

  borrarNaviera(naviera: Naviera) {
    swal({
      title: "¿Esta seguro?",
      text: "Esta apunto de borrar a " + naviera.nombreComercial,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._navieraService.borrarNaviera(naviera._id).subscribe(borrado => {
          this.cargarNavieras();
        });
      }
    });
  }
  crearDatosExcel(datos) {
    datos.forEach(d => {
      var naviera = {
        Rfc: d.rfc,
        RazonSocial: d.razonSocial,
        Calle: d.calle,
        No_Exterior: d.noExterior,
        Colonia: d.colonia,
        Municipio: d.municipio,
        Ciudad: d.ciudad,
        Estado: d.estado,
        CP: d.cp,
        Correo: d.correo,
        Correo_Facturación: d.correoFac,
        Credito: d.credito,
        Caat: d.caat,
        FAlta: d.fAlta.substring(0, 10)
      };
      this.navieraExcel.push(naviera);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.navieraExcel) {
      this.excelService.exportAsExcelFile(this.navieraExcel, "Naviera");
    } else {
      swal("No se puede exportar un excel vacio", "", "error");
    }
  }
}
