import { Lavado } from '../models/lavado.models';
import { TipoEvento } from '../models/tipoEvento.models';

export const ID_MELFI = '5c49e55b6b427b166466c9b3';

export const ID_MSC = '5e279f5f18e40063e7539339';

export let Id_sentry = 'https://2199e7fcc6ee44ec9dbb6ea6e2ff54a3@sentry.io/2275987';
export let RFCEMISOR = 'TLR1308235K8';

export const ETAPAS_MANIOBRA = {
  APROBACION: 'APROBACION',
  APROBADO: 'APROBADO',
  TRANSITO: 'TRANSITO',
  ESPERA: 'ESPERA',
  REVISION: 'REVISION',
  LAVADO_REPARACION: 'LAVADO_REPARACION',
  DISPONIBLE: 'DISPONIBLE',
  XCARGAR: 'XCARGAR',
  CARGADO: 'CARGADO'
};

export const DATOS_TIMBRADO = {
  LugarExpedicion : '97320',
  Emisor_Nombre: 'TRANSPORTE Y LOGISTICA REIM, SA DE CV',
  Emisor_RegimenFiscal: '601',
  Emisor_RFC: 'TLR1308235K8',
  NoCertificado: '00001000000407584910'
};

export const ETAPAS_MANIOBRA_ARRAY = [
  'APROBACION',
  'APROBADO',
  'TRANSITO',
  'ESPERA',
  'REVISION',
  'LAVADO_REPARACION',
  'DISPONIBLE',
  'XCARGAR',
  'CARGADO'
];

export const PATIOS = {
  POLIGONO: 'POLIGONO INDUSTRIAL',
  UMAN: 'UMAN',
  SKY: 'SKY PARK',
  PARAISO: 'PARAÍSO'
};
export const PATIOS_ARRAY = [
  'POLIGONO INDUSTRIAL',
  'UMAN',
  'SKY PARK',
  'PARAÍSO'
];

export const ESTADOS_CONTENEDOR = {
  VACIO: 'VACIO',
  VACIO_IMPORT: 'VACIO_IMPORT',
  VACIO_EXPORT: 'VACIO_EXPORT',
  LLENO_IMPORT: 'LLENO_IMPORT',
  LLENO_EXPORT: 'LLENO_EXPORT'
};
export const ESTADOS_CONTENEDOR_ARRAY = [
  'VACIO',
  'VACIO_IMPORT',
  'VACIO_EXPORT',
  'LLENO_IMPORT',
  'LLENO_EXPORT'
];

export const GRADOS_CONTENEDOR = { A: 'A', B: 'B', C: 'C', PT: 'PT', DM: 'DM', DD: 'DD', PIA: 'PIA' };
export const GRADOS_CONTENEDOR_ARRAY = ['A', 'B', 'C', 'PT', 'DM', 'DD', 'PIA'];

export const ROLES = {
  ADMIN_ROLE: 'ADMIN_ROLE',
  PATIOADMIN_ROLE: 'PATIOADMIN_ROLE',
  PATIO_ROLE: 'PATIO_ROLE',
  NAVIERA_ROLE: 'NAVIERA_ROLE',
  TRANSPORTISTA_ROLE: 'TRANSPORTISTA_ROLE',
  AA_ROLE: 'AA_ROLE',
  CLIENT_ROLE: 'CLIENT_ROLE'
};

export const ROLES_ARRAY = [

  { _id: 'ADMIN_ROLE', descripcion: 'ADMINISTRADOR' },
  { _id: 'PATIOADMIN_ROLE', descripcion: 'ADMIN CONTAINER PARK' },
  { _id: 'PATIO_ROLE', descripcion: 'PATIO COINTAINER PARK' },
  { _id: 'NAVIERA_ROLE', descripcion: 'NAVIERA' },
  { _id: 'TRANSPORTISTA_ROLE', descripcion: 'TRANSPORTISTA' },
  { _id: 'AA_ROLE', descripcion: 'AGENCIA ADUANAL' },
  { _id: 'CLIENT_ROLE', descripcion: 'CLIENTE' }
];

export const STATUS_SOLICITUD = {
  NA: 'NA',
  ESPERA: 'ESPERA',
  NULL: 'NULL'
};

export const PERMISOS = [
  { _id: 'ASIGNACION_EQUIPO', descripcion: 'ASIGANCION_EQUIPO' },
  { _id: 'ASIGNACION_TRANSPORTISTA', descripcion: 'ASIGNACION_TRANSPORTISTA' }
];

export const TIPOS_LAVADO_ARRAY = [new Lavado('BASICO', 'Basico'), new Lavado('ESPECIAL', 'Especial')];

export const TIPOS_MANTENIMIENTO_ARRAY = [new TipoEvento('LAVADO', 'Lavado'), new TipoEvento('REPARACION', 'Reparacion'), new TipoEvento('ACONDICIONAMIENTO', 'Acondicionamiento')];

/* #region  FACTURACION */
export const TR_ARRAY = ['TRASLADO', 'RETENCION'];
export const IMPUESTOS_ARRAY = ['IVA', 'IEPS', 'ISR'];
/* #endregion */

// export const TIPOS_MATERIAL_ARRAY = ['I', 'M'];
export const TIPOS_MATERIAL_ARRAY = [
  { valor: 'I', descripcion: 'Insumo' },
  { valor: 'M', descripcion: 'Mano de Obra' }
];
