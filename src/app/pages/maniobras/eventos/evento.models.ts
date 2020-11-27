export class Evento {
  constructor(
      public _idManiobra?: string,
      public _id?: string,
      public tipoEvento?: string,
      public tipoLavado?: string,
      public observaciones?: string,
      public fIni?: string,
      public hIni?: string,
      public fFin?: string,
      public hFin?: string,
      public materiales?: []
  ) {}
}


