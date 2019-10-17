
//export let URL_SERVICIOS = 'http://187.210.87.57:3000';


export let URL_SERVICIOS = 'http://localhost:3000';

export const ID_MELFI = '5c49e55b6b427b166466c9b3';

export const ETAPAS_MANIOBRA = {APROBACION: 'APROBACION', APROBADO: 'APROBADO',
                                TRANSITO: 'TRANSITO', ESPERA: 'ESPERA',
                                REVISION: 'REVISION', LAVADO_REPARACION: 'LAVADO_REPARACION',
                                DISPONIBLE: 'DISPONIBLE', XCARGAR: 'XCARGAR',
                                CARGADO: 'CARGADO'};

export const PATIOS = {POLIGONO: 'POLIGONO INDUSTRIAL', UMAN: 'UMAN', SKY: 'SKY PARK'};
export const PATIOS_ARRAY = ['POLIGONO INDUSTRIAL', 'UMAN', 'SKY PARK'];


export const ESTADOS_CONTENEDOR = {VACIO: 'VACIO',
                                  VACIO_IMPORT: 'VACIO_IMPORT',
                                  VACIO_EXPORT: 'VACIO_EXPORT',
                                  LLENO_IMPORT: 'LLENO_IMPORT',
                                  LLENO_EXPORT: 'LLENO_EXPORT' };
export const ESTADOS_CONTENEDOR_ARRAY = ['VACIO', 'VACIO_IMPORT', 'VACIO_EXPORT', 'LLENO_IMPORT', 'LLENO_EXPORT'];

export const GRADOS_CONTENEDOR = {A: 'A', B: 'B', C: 'C'};
export const GRADOS_CONTENEDOR_ARRAY = ['A', 'B', 'C'];


export const ROLES = {
    ADMIN_ROLE: 'ADMIN_ROLE',
    REIMADMIN_ROLE: 'REIMADMIN_ROLE',
    REIM_ROLE: 'REIM_ROLE',
    NAVIERA_ROLE: 'NAVIERA_ROLE',
    TRANSPORTISTA_ROLE: 'TRANSPORTISTA_ROLE',
    AA_ROLE: 'AA_ROLE',
    CLIENT_ROLE: 'CLIENT_ROLE'
  };

export const ROLES_ARRAY = [ {_id: 'ADMIN_ROLE', descripcion: 'ADMINISTRADOR'} ,
                              {_id: 'REIMADMIN_ROLE', descripcion: 'ADMIN CONTAINER PARK'},
                              {_id: 'REIM_ROLE', descripcion: 'USUARIO COINTAINER PARK'},
                              {_id: 'NAVIERA_ROLE', descripcion: 'NAVIERA'},
                              {_id: 'TRANSPORTISTA_ROLE', descripcion: 'TRANSPORTISTA'},
                              {_id: 'AA_ROLE', descripcion: 'AGENCIA ADUANAL'},
                              {_id: 'CLIENT_ROLE', descripcion: 'CLIENTE'}
                              ];
