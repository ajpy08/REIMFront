import { Maniobra } from 'src/app/models/maniobra.models';
import { ManiobraService, FacturacionService, UsuarioService } from 'src/app/services/service.index';
import { AgenciaService } from './../../pages/agencias/agencia.service';
import { Notification } from './../../models/notification.models';
import { SolicitudService } from './../../pages/solicitudes/solicitud.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../pages/usuarios/usuario.model';
import { Router } from '@angular/router';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { ROLES } from 'src/app/config/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;
  maniobras: any[] = [];
  maniobrasCarga: any[] = [];
  notifications: Notification[] = [];
  CD: string;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(public _usuarioService: UsuarioService,
    private solicitudesService: SolicitudService,
    private agenciaService: AgenciaService,
    private maniobraService: ManiobraService,
    public router: Router,
    public facturacionService: FacturacionService,
    public usuarioService: UsuarioService) { }

  ngOnInit() {

    this.usuario = this._usuarioService.usuario;

    this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
      this.doSolicitudesNotifications(resp.solicitudes);
    });

    this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
      this.doSolicitudesNotifications(resp.solicitudes);
    });

    if (this.usuario.role === 'TRANSPORTISTA_ROLE') {
      this.usuario.empresas.forEach(empresa => {
        this.maniobraService.getManiobras('D', 'TRANSITO', empresa._id, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
          if (maniobras.maniobras.length > 0) {
            maniobras.maniobras.forEach(m => {
              this.maniobras.push(m);
            });
            this.maniobras.forEach(ma => {
              if (!ma.fAsignacionPapeleta) {
                this.doManiobraNotification(ma);
              }
            });
            this.maniobras = [];
          }
        });

        this.maniobraService.getManiobras('C', 'TRANSITO', empresa._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
          if (maniobras.maniobras.length > 0) {
            maniobras.maniobras.forEach(m => {
              this.maniobrasCarga.push(m);
            });
            this.maniobrasCarga.forEach(ma => {
              if (!ma.fAsignacionPapeleta) {
                this.doManiobraNotification(ma);
              }
            });
            this.maniobrasCarga = [];
          }
        });
      });
    }

    this.socket.on('new-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        const tempArray: Notification[] = [];
        tempArray.push(data.data);
        this.doSolicitudesNotifications(tempArray);
      }
    }.bind(this));


    this.socket.on('delete-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.notifications = [];
        this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });

        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });
      }
      if (this.usuario.role === 'TRANSPORTISTA_ROLE') {
        this.notifications = [];
        this.usuario.empresas.forEach(empresa => {
          this.maniobraService.getManiobras('D', 'TRANSITO', empresa._id, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobras.push(m);
              });
              this.maniobras.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobras = [];
            }
          });
          this.maniobraService.getManiobras('C', 'TRANSITO', empresa._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobrasCarga.push(m);
              });
              this.maniobrasCarga.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobrasCarga = [];
            }
          });
        });
      }
    }.bind(this));

    this.socket.on('delete-maniobra-descarga', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.notifications = [];
        this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });

        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });
      }
      if (this.usuario.role === 'TRANSPORTISTA_ROLE') {
        this.notifications = [];
        this.usuario.empresas.forEach(empresa => {
          this.maniobraService.getManiobras('D', 'TRANSITO', empresa._id, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobras.push(m);
              });
              this.maniobras.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobras = [];
            }
          });
          this.maniobraService.getManiobras('C', 'TRANSITO', empresa._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobrasCarga.push(m);
              });
              this.maniobrasCarga.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobrasCarga = [];
            }
          });
        });
      }
    }.bind(this));

    this.socket.on('delete-maniobra', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.notifications = [];
        this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });

        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });
      }
      if (this.usuario.role === 'TRANSPORTISTA_ROLE') {
        this.notifications = [];
        this.usuario.empresas.forEach(empresa => {
          this.maniobraService.getManiobras('D', 'TRANSITO', empresa._id, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobras.push(m);
              });
              this.maniobras.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobras = [];
            }
          });
          this.maniobraService.getManiobras('C', 'TRANSITO', empresa._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobrasCarga.push(m);
              });
              this.maniobrasCarga.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobrasCarga = [];
            }
          });
        });
      }

    }.bind(this));

    this.socket.on('aprobar-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.notifications = [];
        this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });

        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });
      } else {
        if (this.usuario.role === ROLES.TRANSPORTISTA_ROLE) {
          if (data.data.tipo === 'C') {
            this.CD = 'C';
          } else if (data.data.tipo === 'D') {
            this.CD = 'D';
          }
          data.data.contenedores.forEach(c => {
            this.usuario.empresas.forEach(empresa => {
              if (c.transportista === empresa._id) {

                if (this.CD === 'C') {
                  this.maniobraService.getManiobraConIncludes(c.maniobra).subscribe(maniobra => {
                    if (!maniobra.fAsignacionPapeleta) {
                      this.doManiobraNotification(maniobra.maniobra);
                    }
                  });
                } else if (this.CD === 'D') {
                  this.maniobraService.getManiobraConIncludes(c.maniobra._id).subscribe(maniobra => {
                    if (!maniobra.fAsignacionPapeleta) {
                      this.doManiobraNotification(maniobra.maniobra);
                    }
                  });
                }

              }
            });
          });
        }
      }
    }.bind(this));

    this.socket.on('asignacion-papeleta', function (data: any) {
      if (this.usuario.role === ROLES.TRANSPORTISTA_ROLE) {
        this.notifications = [];
        this.usuario.empresas.forEach(empresa => {
          this.maniobraService.getManiobras('D', 'TRANSITO', empresa._id, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobras.push(m);
              });
              this.maniobras.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobras = [];
            }
          });
          this.maniobraService.getManiobras('C', 'TRANSITO', empresa._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobrasCarga.push(m);
              });
              this.maniobrasCarga.forEach(ma => {
                if (!ma.fAsignacionPapeleta) {
                  this.doManiobraNotification(ma);
                }
              });
              this.maniobrasCarga = [];
            }
          });
        });
      }

    }.bind(this));

    this.socket.on('logout-user', function (data: any) {
      this.usuarioService.logout2(data.data.usuario._id);
    }.bind(this));

    this.socket.on('actualizar-perfil', function (data: any) {
      if (this.usuario._id === data.data._id) {
        this.cargarUsuario(data.data._id);
      }
    }.bind(this));

    // this.socket.on('update-papeleta', function (data: any) {
    //   if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
    //     this.notifications = [];
    //     this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
    //       this.doSolicitudesNotifications(resp.solicitudes);
    //     });

    //     this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
    //       this.doSolicitudesNotifications(resp.solicitudes);
    //     });
    //   } else {
    //     if (this.usuario.role === ROLES.TRANSPORTISTA_ROLE) {
    //       this.notifications = [];
    //       if (data.data.contenedores === undefined) {
    //         this.usuario.empresas.forEach(empresa => {
    //           if (data.data.transportista === empresa._id) {
    //             this.maniobraService.getManiobraConIncludes(data.data._id).suscribe(maniobra => {
    //               if (!maniobra.fAsignacionPapeleta) {
    //                 this.doManiobraNotification(maniobra.maniobra);
    //               }
    //             });
    //           }
    //         });
    //       } else {
    //         data.data.contenedores.forEach(c => {
    //           this.usuario.empresas.forEach(empresa => {
    //             if (c.transportista === empresa._id) {
    //               this.maniobraService.getManiobraConIncludes(c.maniobra).subscribe(maniobra => {
    //                 if (!maniobra.fAsignacionPapeleta) {
    //                   this.doManiobraNotification(maniobra.maniobra);
    //                 }
    //               });
    //             }
    //           });
    //         });
    //       }
    //     }
    //   }
    // }.bind(this));

  }

  cargarUsuario(id: string) {
    this._usuarioService.getUsuario(id).subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  buscar(termino: string) {
    this.router.navigate(['/busqueda', termino]);
  }

  calculaFechas(fAlta) {
    const today = new Date();
    console.log(fAlta);
    console.log(today);
    const minutesAgo = 1;
    return fAlta;
  }

  doSolicitudesNotifications(solicitudes) {
    if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
      solicitudes.forEach(solicitud => {
        let nombreAgencia = '';
        let promesa;
        if (solicitud.agencia !== undefined && !solicitud.agencia.razonSocial) {
          // tslint:disable-next-line: no-unused-expression
          promesa = new Promise((resolve, reject) => {
            this.agenciaService.getAgencia(solicitud.agencia).subscribe((agencia) => {
              nombreAgencia = agencia.razonSocial;
              resolve(true);
            });
          });
        } else {
          promesa = new Promise((resolve, reject) => {
            if (solicitud.agencia !== undefined && !solicitud.agencia.razonSocial) {
              nombreAgencia = solicitud.agencia.razonSocial;
            } else {
              nombreAgencia = solicitud.razonSocial;
            }
            resolve(true);
          });
        }

        promesa.then((value: boolean) => {
          if (value) {
            const notify = new Notification;
            const tipo = solicitud.tipo === 'D' ? 'Descarga' : solicitud.tipo === 'C' ? 'Carga' : 'TIPO';
            const contenedor = solicitud.contenedores.length > 1 ? 'contenedores' : 'contenedor';
            notify.name = nombreAgencia;
            notify.description = 'Solicitud de ' + tipo + '(' + solicitud.contenedores.length + ' ' + contenedor + ')';
            notify.fAlta = solicitud.fAlta;
            notify._id = solicitud._id;
            notify.url = `https://reimcontainerpark.com.mx/#/solicitudes/aprobaciones/aprobar_${tipo.toLocaleLowerCase()}/${notify._id}`;

            this.notifications.push(notify);
          }
        });
      });
    } else {

      if (this.usuario.role === ROLES.AA_ROLE) {
        solicitudes.forEach(solicitud => {
          const res = this.usuario.empresas.findIndex(empresa => empresa._id === solicitud.agencia._id);
          if (res > -1) {
            let nombreAgencia = '';
            let promesa;
            if (solicitud.agencia !== undefined && !solicitud.agencia.razonSocial) {
              // tslint:disable-next-line: no-unused-expression
              promesa = new Promise((resolve, reject) => {
                this.agenciaService.getAgencia(solicitud.agencia).subscribe((agencia) => {
                  nombreAgencia = agencia.razonSocial;
                  resolve(true);
                });
              });
            } else {
              promesa = new Promise((resolve, reject) => {
                if (solicitud.agencia !== undefined && !solicitud.agencia.razonSocial) {
                  nombreAgencia = solicitud.agencia.razonSocial;
                } else {
                  nombreAgencia = solicitud.razonSocial;
                }
                resolve(true);
              });
            }

            promesa.then((value: boolean) => {
              if (value) {
                const notify = new Notification;
                const tipo = solicitud.tipo === 'D' ? 'Descarga' : solicitud.tipo === 'C' ? 'Carga' : 'TIPO';
                const contenedor = solicitud.contenedores.length > 1 ? 'contenedores' : 'contenedor';
                notify.name = nombreAgencia;
                notify.description = 'Solicitud de ' + tipo + '(' + solicitud.contenedores.length + ' ' + contenedor + ')';
                notify.fAlta = solicitud.fAlta;
                notify._id = solicitud._id;
                notify.url = `https://reimcontainerpark.com.mx/#/solicitudes/aprobaciones/aprobar_${tipo.toLocaleLowerCase()}/${notify._id}`;

                this.notifications.push(notify);
              }
            });
          }
        });
      }
    }
  }

  doManiobraNotification(maniobra) {
    const notify = new Notification;
    const tipo = maniobra.cargaDescarga === 'D' ? 'Descarga' : maniobra.cargaDescarga === 'C' ? 'Carga' : 'TIPO';
    notify.name = 'Maniobra de ' + tipo;
    notify.description = ' Folio ' + maniobra.folio + ' (' + maniobra.agencia.razonSocial + ')';
    notify.fAlta = maniobra.fAlta;
    notify._id = maniobra._id;
    notify.url = `https://reimcontainerpark.com.mx/#/solicitud_transportista/${notify._id}`;

    this.notifications.push(notify);
  }

  logout() {
    this._usuarioService.updateStatusUser(this._usuarioService.usuario).subscribe((usuario) => {
      this._usuarioService.logout();
      this.socket.emit('logout-user', usuario);
    });
  }
}
