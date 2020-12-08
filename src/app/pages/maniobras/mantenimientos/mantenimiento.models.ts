export class Mantenimiento {
  constructor(
      public _id?: string,
      public maniobra?: string,
      public tipoMantenimiento?: string,
      public tipoLavado?: string,
      public observacionesGenerales?: string,
      public izquierdo?: string,
      public derecho?: string,
      public frente?: string,
      public posterior?: string,
      public interior?: string,
      public piso?: string,
      public techo?: string,
      public puerta?: string,
      public observacionesCompleto?: string,
      public fechas?:[{fIni?: string, hIni?: string, fFin?: string, hFin?: string}],
      public materiales?:[{material?: string, descripcion?: string, cantidad?: number, costo?: number, precio?:number}],
  ) {}

}


