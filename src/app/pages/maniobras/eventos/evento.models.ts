export class Evento {
  constructor(
      public _idManiobra?: string,
      public _id?: string,
      public tipoEvento?: string,
      public tipoLavado?: string,
      public observaciones?: string,
      public fechas?:[{fIni?: string, hIni?: string, fFin?: string, hFin?: string}],
      public materiales?:[{material?: string, descripcion?: string, costo?: number, precio?:number, cantidad?: number}],
  ) {}

}


