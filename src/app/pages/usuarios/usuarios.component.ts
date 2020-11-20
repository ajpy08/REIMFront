import { Component, OnInit, ViewChild } from "@angular/core";
import { Usuario } from "./usuario.model";
import { UsuarioService, ExcelService } from "../../services/service.index";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ROLES_ARRAY } from "../../config/config";
import { balancePreviousStylesIntoKeyframes } from "@angular/animations/browser/src/util";

declare var swal: any;
@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  totalRegistros = 0;
  cargando = true;
  roles = ROLES_ARRAY;
  usuarioExcel = [];
  displayedColumns = [
    "actions",
    "foto",
    "email",
    "activo",
    "nombre",
    "role",
    "empresas"
  ];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _usuarioService: UsuarioService,
    private excelService: ExcelService
  ) {}
  ngOnInit() {
    this.cargarUsuarios();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error("No se puede filtrar en un datasource vacío");
    }
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.getUsuarios().subscribe((usuarios: any) => {
      this.dataSource = new MatTableDataSource(usuarios.usuarios);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = usuarios.usuarios.length;
    });
    this.cargando = false;
  }

  habilitaDeshabilitaUsuario(usuario, event) {
    if (usuario._id === this._usuarioService.usuario._id) {
      swal(
        "Error!",
        "No se puede habilitar / deshabilitar a si mismo",
        "error"
      );
      return;
    }
    swal({
      title: "¿Esta seguro?",
      text: "Esta apunto de deshabilitar a " + usuario.nombre,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._usuarioService
          .habilitaDeshabilitaUsuario(usuario, event.checked)
          .subscribe(borrado => {
            this.cargarUsuarios();
          });
      } else {
        event.source.checked = !event.checked;
      }
    });
  }

  crearDatosExcel(datos) {
    datos.forEach(b => {
      var usuario = {
        Email: b.email,
        Activo: b.activo,
        Nombre: b.nombre,
        Role: b.role,
        Empresa: b.empresas,
        FAlta: b.fAlta.substring(0, 10)
      };
      this.usuarioExcel.push(usuario);
    });
  }
  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.usuarioExcel) {
      this.excelService.exportAsExcelFile(this.usuarioExcel, "Usuarios");
    } else {
      swal("No se puede exportar un excel vacio", "", "error");
    }
  }

  enviarcorreo(usuarios) {
    this._usuarioService.enviaCorreoUsuario(usuarios).subscribe(() => {});
  }
}
