import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Maniobra } from 'src/app/models/maniobra.models';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Coordenada } from 'src/app/models/coordenada.models';
import { CoordenadaService } from '../maniobras/coordenada.service';
import { Point_Coordenada } from 'src/app/models/point_coordenada.models';
import { ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser/src/dom/debug/ng_probe';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
  encapsulation: ViewEncapsulation.None
})



export class MapaComponent implements OnInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  // @ViewChild('canvasN2')
  // canvasN2: ElementRef<HTMLCanvasElement>;
  // @ViewChild('canvasN3')
  // canvasN3: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null;
  // private ctx: CanvasRenderingContext2D;
  // private ctx: CanvasRenderingContext2D;




  point;
  arrayJsons = [];
  arrayClamped = [];
  coordenada = new Coordenada('', '');
  point_coordenada;
  coordenadas;
  nivelSelected = 'N1';

  constructor(private maniobraService: ManiobraService, private coordenadaService: CoordenadaService, private elemRef: ElementRef) { }



  ngOnInit(): void {
    this.draw(this.nivelSelected)
    this.numeracion();

  }



  // MOSTRAR SELECT //



  // =================== N I V E L  [ 1 ]====================================
  bahia11() {
    //Bahia 12    

    this.point = new Uint32Array([10, 10, 110, 18]);
    this.coordenada = new Coordenada('11', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([10, 30, 110, 18]);
    this.coordenada = new Coordenada('11', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 50, 110, 18]);
    this.coordenada = new Coordenada('11', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 70, 110, 18]);
    this.coordenada = new Coordenada('11', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 90, 110, 18]);
    this.coordenada = new Coordenada('11', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("11", 55, 130);

  }

  bahia10() {


    //bahia 10 A
    this.point = new Uint32Array([135, 10, 110, 18]);
    this.coordenada = new Coordenada('10', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([135, 30, 110, 18]);
    this.coordenada = new Coordenada('10', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 50, 110, 18]);
    this.coordenada = new Coordenada('10', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 70, 110, 18]);
    this.coordenada = new Coordenada('10', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 90, 110, 18]);
    this.coordenada = new Coordenada('10', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("10", 235, 130);

    //bahia 10 B

    this.point = new Uint32Array([247, 10, 110, 18]);
    this.coordenada = new Coordenada('10', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 30, 110, 18]);
    this.coordenada = new Coordenada('10', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 50, 110, 18]);
    this.coordenada = new Coordenada('10', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 70, 110, 18]);
    this.coordenada = new Coordenada('10', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 90, 110, 18]);
    this.coordenada = new Coordenada('10', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  linea() {
    this.ctx.beginPath();
    this.ctx.moveTo(366, 0);
    this.ctx.lineTo(366, 900);
    this.ctx.strokeStyle = "red";
    this.ctx.setLineDash([10, 10])
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

  }


  bahia9() {
    //bahia 09 A
    this.point = new Uint32Array([372, 10, 110, 18]);
    this.coordenada = new Coordenada('9', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 30, 110, 18]);
    this.coordenada = new Coordenada('9', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 50, 110, 18]);
    this.coordenada = new Coordenada('9', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 70, 110, 18]);
    this.coordenada = new Coordenada('9', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 90, 110, 18]);
    this.coordenada = new Coordenada('9', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("9", 478, 130);

    // bahia 9 B
    this.point = new Uint32Array([484, 10, 110, 18]);
    this.coordenada = new Coordenada('9', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 30, 110, 18]);
    this.coordenada = new Coordenada('9', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 50, 110, 18]);
    this.coordenada = new Coordenada('9', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 70, 110, 18]);
    this.coordenada = new Coordenada('9', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 90, 110, 18]);
    this.coordenada = new Coordenada('9', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });




    //bahia 10 B



  }

  bahia8() {

    this.point = new Uint16Array([609, 10, 55, 18]);
    this.coordenada = new Coordenada('8', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 30, 55, 18]);
    this.coordenada = new Coordenada('8', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 50, 55, 18]);
    this.coordenada = new Coordenada('8', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 70, 55, 18]);
    this.coordenada = new Coordenada('8', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 90, 55, 18]);
    this.coordenada = new Coordenada('8', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("8", 630, 130);

    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "rgba(0,0,0,1)";
    // this.ctx.fillStyle = "red";

    // this.ctx.rect(599, 0, 110, 18);

    // this.ctx.fillStyle = "red";
    // this.ctx.rect(599, 20, 110, 18);

    // this.ctx.fillStyle = "red";
    // this.ctx.rect(599, 40, 110, 18);

    // this.ctx.fillStyle = "red";
    // this.ctx.rect(599, 60, 110, 18);

    // this.ctx.fillStyle = "red";
    // this.ctx.rect(599, 80, 110, 18);
  }

  bahia7() {

    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "rgba(0,0,0,1)";
    // this.ctx.rect(724, 0, 110, 18);
    // this.ctx.rect(724, 20, 110, 18);
    // this.ctx.rect(724, 40, 110, 18);
    // this.ctx.rect(724, 60, 110, 18);
    // this.ctx.rect(724, 80, 110, 18);

    // bahia 7 A
    this.point = new Uint32Array([680, 10, 110, 18]);
    this.coordenada = new Coordenada('7', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 30, 110, 18]);
    this.coordenada = new Coordenada('7', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 50, 110, 18]);
    this.coordenada = new Coordenada('7', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 70, 110, 18]);
    this.coordenada = new Coordenada('7', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 90, 110, 18]);
    this.coordenada = new Coordenada('7', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("7", 785, 130);

    //bahia 7 b
    this.point = new Uint32Array([792, 10, 110, 18]);
    this.coordenada = new Coordenada('7', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 30, 110, 18]);
    this.coordenada = new Coordenada('7', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 50, 110, 18]);
    this.coordenada = new Coordenada('7', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 70, 110, 18]);
    this.coordenada = new Coordenada('7', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 90, 110, 18]);
    this.coordenada = new Coordenada('7', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    // this.ctx.rect(836, 0, 110, 18);
    // this.ctx.rect(836, 20, 110, 18);
    // this.ctx.rect(836, 40, 110, 18);
    // this.ctx.rect(836, 60, 110, 18);
    // this.ctx.rect(836, 80, 110, 18);
  }

  // bahia20() {

  //   this.point = new Uint16Array([836, 120, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([860, 120, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([884, 120, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([908, 120, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([932, 120, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


  //   //bahia 20 b

  //   this.point = new Uint32Array([836, 177, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([860, 177, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([884, 177, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([908, 177, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([932, 177, 22, 55]);
  //   this.coordenada = new Coordenada('20', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  // }

  bahia6() {

    //reim 7 A
    this.point = new Uint16Array([783, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([806, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([829, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([852, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([875, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("6", 760, 330);

    // bahia 6 B 
    this.point = new Uint16Array([783, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([806, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([829, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([852, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([875, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

  }

  // bahia6() {

  //   //bahia 6 A
  //   this.point = new Uint32Array([836, 370, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([860, 370, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([884, 370, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([908, 370, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([932, 370, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   //bahia 6 B
  //   this.point = new Uint32Array([836, 427, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([860, 427, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([884, 427, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([908, 427, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


  //   this.point = new Uint32Array([932, 427, 22, 55]);
  //   this.coordenada = new Coordenada('6', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  // }

  bahia5() {

    //bahia 5 A
    // this.point = new Uint32Array([836, 495, 22, 110]);
    // this.coordenada = new Coordenada('5', 'J1', undefined, undefined, undefined)
    // this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // this.point = new Uint32Array([860, 495, 22, 110]);
    // this.coordenada = new Coordenada('5', 'I1', undefined, undefined, undefined)
    // this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // this.point = new Uint32Array([884, 495, 22, 110]);
    // this.coordenada = new Coordenada('5', 'H1', undefined, undefined, undefined)
    // this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // this.point = new Uint32Array([908, 495, 22, 110]);
    // this.coordenada = new Coordenada('5', 'G1', undefined, undefined, undefined)
    // this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // this.point = new Uint32Array([932, 495, 22, 110]);
    // this.coordenada = new Coordenada('5', 'F1', undefined, undefined, undefined)
    // this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 5 B

    this.point = new Uint32Array([783, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([806, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([829, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([852, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([875, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("5", 760, 490);

  }

  // bahia19() {
  //   //bahia 19 A


  //   this.point = new Uint32Array([836, 620, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([860, 620, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([884, 620, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([908, 620, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([932, 620, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  //   //bahia 19 B

  //   this.point = new Uint32Array([836, 677, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([860, 677, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([884, 677, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([908, 677, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([932, 677, 22, 55]);
  //   this.coordenada = new Coordenada('19', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  // }

  bahia4() {

    //bahia 4 A


    this.point = new Uint32Array([846, 650, 55, 18]);
    this.coordenada = new Coordenada('4', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 670, 55, 18]);
    this.coordenada = new Coordenada('4', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 690, 55, 18]);
    this.coordenada = new Coordenada('4', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 710, 55, 18]);
    this.coordenada = new Coordenada('4', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 730, 55, 18]);
    this.coordenada = new Coordenada('4', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("4", 870, 640);
  }

  bahia3() {
    //BAHIA 3 A


    this.point = new Uint32Array([721, 650, 110, 18]);
    this.coordenada = new Coordenada('3', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 670, 110, 18]);
    this.coordenada = new Coordenada('3', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 690, 110, 18]);
    this.coordenada = new Coordenada('3', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([721, 710, 110, 18]);
    this.coordenada = new Coordenada('3', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 730, 110, 18]);
    this.coordenada = new Coordenada('3', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("3", 713, 640);

    // BAHIA 3 B

    this.point = new Uint32Array([609, 650, 110, 18]);
    this.coordenada = new Coordenada('3', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 670, 110, 18]);
    this.coordenada = new Coordenada('3', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 690, 110, 18]);
    this.coordenada = new Coordenada('3', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 710, 110, 18]);
    this.coordenada = new Coordenada('3', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 730, 110, 18]);
    this.coordenada = new Coordenada('3', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia2() {
    //BAHIA 2 A

    this.point = new Uint32Array([484, 650, 110, 18]);
    this.coordenada = new Coordenada('2', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 670, 110, 18]);
    this.coordenada = new Coordenada('2', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 690, 110, 18]);
    this.coordenada = new Coordenada('2', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 710, 110, 18]);
    this.coordenada = new Coordenada('2', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 730, 110, 18]);
    this.coordenada = new Coordenada('2', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("2", 477, 640);
    //BAHIA 2 B

    this.point = new Uint32Array([372, 650, 110, 18]);
    this.coordenada = new Coordenada('2', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 670, 110, 18]);
    this.coordenada = new Coordenada('2', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 690, 110, 18]);
    this.coordenada = new Coordenada('2', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 710, 110, 18]);
    this.coordenada = new Coordenada('2', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 730, 110, 18]);
    this.coordenada = new Coordenada('2', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia1() {

    //BAHIA 1 A

    this.point = new Uint32Array([247, 650, 110, 18]);
    this.coordenada = new Coordenada('1', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 670, 110, 18]);
    this.coordenada = new Coordenada('1', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 690, 110, 18]);
    this.coordenada = new Coordenada('1', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 710, 110, 18]);
    this.coordenada = new Coordenada('1', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 730, 110, 18]);
    this.coordenada = new Coordenada('1', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("1", 238, 640);

    //BAHIA 1 B


    this.point = new Uint32Array([135, 650, 110, 18]);
    this.coordenada = new Coordenada('1', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 670, 110, 18]);
    this.coordenada = new Coordenada('1', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 690, 110, 18]);
    this.coordenada = new Coordenada('1', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 710, 110, 18]);
    this.coordenada = new Coordenada('1', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 730, 110, 18]);
    this.coordenada = new Coordenada('1', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



  }

  // bahia21() {

  //   //bahia 21 A
  //   this.point = new Uint32Array([0, 120, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 120, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 120, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 120, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 120, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   //bahia 21 B
  //   this.point = new Uint32Array([0, 177, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 177, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 177, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 177, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 177, 22, 55]);
  //   this.coordenada = new Coordenada('21', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  // }

  // bahia13() {
  //   //reim 13 A


  //   this.point = new Uint32Array([0, 245, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 245, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 245, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 245, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 245, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   //bahia 13 B 
  //   this.point = new Uint32Array([0, 302, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 302, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 302, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 302, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 302, 22, 55]);
  //   this.coordenada = new Coordenada('13', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  // }

  // bahia14() {
  //   // BAHIA 14 A

  //   this.point = new Uint32Array([0, 370, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 370, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 370, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 370, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 370, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   //bahia 14 B
  //   this.point = new Uint32Array([0, 427, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 427, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 427, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 427, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 427, 22, 55]);
  //   this.coordenada = new Coordenada('14', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  // }

  // bahia15() {

  //   //bahia 15 A
  //   this.point = new Uint32Array([0, 495, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'A1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 495, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'B1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 495, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'C1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 495, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'D1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 495, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'E1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   //bahia 15 B
  //   this.point = new Uint32Array([0, 552, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'F1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([24, 552, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'G1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([48, 552, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'H1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([72, 552, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'I1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  //   this.point = new Uint32Array([96, 552, 22, 55]);
  //   this.coordenada = new Coordenada('15', 'J1', undefined, undefined, undefined)
  //   this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  // }

  bahia17() {
    //BAHIA 16 

    this.point = new Uint32Array([10, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([34, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([58, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([82, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([106, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("17", 135, 550);

  }

  bahia12() {

    this.point = new Uint32Array([10, 245, 110, 18]);
    this.coordenada = new Coordenada('12 ', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 265, 110, 18]);
    this.coordenada = new Coordenada('12', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 285, 110, 18]);
    this.coordenada = new Coordenada('12', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 305, 110, 18]);
    this.coordenada = new Coordenada('12', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 325, 110, 18]);
    this.coordenada = new Coordenada('12', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 345, 110, 18]);
    this.coordenada = new Coordenada('12', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 365, 110, 18]);
    this.coordenada = new Coordenada('12', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 385, 110, 18]);
    this.coordenada = new Coordenada('12', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 405, 110, 18]);
    this.coordenada = new Coordenada('12', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 425, 110, 18]);
    this.coordenada = new Coordenada('12', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 445, 110, 18]);
    this.coordenada = new Coordenada('12', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 465, 110, 18]);
    this.coordenada = new Coordenada('12', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("12", 55, 225);

  }

  bahia13() {
    this.point = new Uint32Array([130, 245, 110, 18]);
    this.coordenada = new Coordenada('13 ', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 265, 110, 18]);
    this.coordenada = new Coordenada('13', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 285, 110, 18]);
    this.coordenada = new Coordenada('13', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 305, 110, 18]);
    this.coordenada = new Coordenada('13', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 325, 110, 18]);
    this.coordenada = new Coordenada('13', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 345, 110, 18]);
    this.coordenada = new Coordenada('13', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 365, 110, 18]);
    this.coordenada = new Coordenada('13', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 385, 110, 18]);
    this.coordenada = new Coordenada('13', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 405, 110, 18]);
    this.coordenada = new Coordenada('13', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 425, 110, 18]);
    this.coordenada = new Coordenada('13', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 445, 110, 18]);
    this.coordenada = new Coordenada('13', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 465, 110, 18]);
    this.coordenada = new Coordenada('13', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("13", 180, 225);
  }

  bahia14() {
    //BAHIA 17

    this.point = new Uint32Array([247, 245, 110, 18]);
    this.coordenada = new Coordenada('14 ', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 265, 110, 18]);
    this.coordenada = new Coordenada('14', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 285, 110, 18]);
    this.coordenada = new Coordenada('14', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 305, 110, 18]);
    this.coordenada = new Coordenada('14', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 325, 110, 18]);
    this.coordenada = new Coordenada('14', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 345, 110, 18]);
    this.coordenada = new Coordenada('14', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 365, 110, 18]);
    this.coordenada = new Coordenada('14', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 385, 110, 18]);
    this.coordenada = new Coordenada('14', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 405, 110, 18]);
    this.coordenada = new Coordenada('14', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 425, 110, 18]);
    this.coordenada = new Coordenada('14', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 445, 110, 18]);
    this.coordenada = new Coordenada('14', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 465, 110, 18]);
    this.coordenada = new Coordenada('14', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("14", 290, 225);

  }

  bahia15() {
    //BAHIA 18

    this.point = new Uint32Array([372, 245, 110, 18]);
    this.coordenada = new Coordenada('15', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 265, 110, 18]);
    this.coordenada = new Coordenada('15', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 285, 110, 18]);
    this.coordenada = new Coordenada('15', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 305, 110, 18]);
    this.coordenada = new Coordenada('15', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([372, 325, 110, 18]);
    this.coordenada = new Coordenada('15', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 345, 110, 18]);
    this.coordenada = new Coordenada('15', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 365, 110, 18]);
    this.coordenada = new Coordenada('15', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 385, 110, 18]);
    this.coordenada = new Coordenada('15', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 405, 110, 18]);
    this.coordenada = new Coordenada('15', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 425, 110, 18]);
    this.coordenada = new Coordenada('15', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 445, 110, 18]);
    this.coordenada = new Coordenada('15', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 465, 110, 18]);
    this.coordenada = new Coordenada('15', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("15", 415, 225);

  }

  bahia16() {

    this.point = new Uint32Array([494, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([518, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([542, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([566, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([590, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });


    this.point = new Uint32Array([494, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([518, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([542, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([566, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([590, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([498, 345, 110, 18]);
    this.coordenada = new Coordenada('16', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([498, 365, 110, 18]);
    this.coordenada = new Coordenada('16', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });



    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillText("16", 540, 225);



  }


  // =================== N I V E L  [ 2 ]====================================

  bahia12N2() {
    //Bahia 12 

    this.point = new Uint32Array([10, 245, 110, 18]);
    this.coordenada = new Coordenada('12 ', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 265, 110, 18]);
    this.coordenada = new Coordenada('12', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 285, 110, 18]);
    this.coordenada = new Coordenada('12', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 305, 110, 18]);
    this.coordenada = new Coordenada('12', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 325, 110, 18]);
    this.coordenada = new Coordenada('12', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 345, 110, 18]);
    this.coordenada = new Coordenada('12', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 365, 110, 18]);
    this.coordenada = new Coordenada('12', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 385, 110, 18]);
    this.coordenada = new Coordenada('12', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 405, 110, 18]);
    this.coordenada = new Coordenada('12', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 425, 110, 18]);
    this.coordenada = new Coordenada('12', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 445, 110, 18]);
    this.coordenada = new Coordenada('12', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 465, 110, 18]);
    this.coordenada = new Coordenada('12', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("12", 55, 225);

  }

  bahia11N2() {
    this.point = new Uint32Array([10, 10, 110, 18]);
    this.coordenada = new Coordenada('11', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([10, 30, 110, 18]);
    this.coordenada = new Coordenada('11', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 50, 110, 18]);
    this.coordenada = new Coordenada('11', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 70, 110, 18]);
    this.coordenada = new Coordenada('11', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 90, 110, 18]);
    this.coordenada = new Coordenada('11', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("11", 55, 130);
  }


  bahia10N2() {
    //bahia 10 A
    this.point = new Uint32Array([135, 10, 110, 18]);
    this.coordenada = new Coordenada('10', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([135, 30, 110, 18]);
    this.coordenada = new Coordenada('10', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 50, 110, 18]);
    this.coordenada = new Coordenada('10', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 70, 110, 18]);
    this.coordenada = new Coordenada('10', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 90, 110, 18]);
    this.coordenada = new Coordenada('10', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("10", 235, 130);

    //bahia 10 B

    this.point = new Uint32Array([247, 10, 110, 18]);
    this.coordenada = new Coordenada('10', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 30, 110, 18]);
    this.coordenada = new Coordenada('10', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 50, 110, 18]);
    this.coordenada = new Coordenada('10', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 70, 110, 18]);
    this.coordenada = new Coordenada('10', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 90, 110, 18]);
    this.coordenada = new Coordenada('10', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



  }

  bahia9N2() {
    this.point = new Uint32Array([372, 10, 110, 18]);
    this.coordenada = new Coordenada('9', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 30, 110, 18]);
    this.coordenada = new Coordenada('9', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 50, 110, 18]);
    this.coordenada = new Coordenada('9', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 70, 110, 18]);
    this.coordenada = new Coordenada('9', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 90, 110, 18]);
    this.coordenada = new Coordenada('9', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("9", 478, 130);

    // bahia 9 B
    this.point = new Uint32Array([484, 10, 110, 18]);
    this.coordenada = new Coordenada('9', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 30, 110, 18]);
    this.coordenada = new Coordenada('9', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 50, 110, 18]);
    this.coordenada = new Coordenada('9', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 70, 110, 18]);
    this.coordenada = new Coordenada('9', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 90, 110, 18]);
    this.coordenada = new Coordenada('9', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia8N2() {
    // bahia 8 A
    this.point = new Uint16Array([609, 10, 55, 18]);
    this.coordenada = new Coordenada('8', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 30, 55, 18]);
    this.coordenada = new Coordenada('8', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 50, 55, 18]);
    this.coordenada = new Coordenada('8', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 70, 55, 18]);
    this.coordenada = new Coordenada('8', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 90, 55, 18]);
    this.coordenada = new Coordenada('8', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("8", 630, 130);
  }


  bahia7N2() {
    this.point = new Uint32Array([680, 10, 110, 18]);
    this.coordenada = new Coordenada('7', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 30, 110, 18]);
    this.coordenada = new Coordenada('7', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 50, 110, 18]);
    this.coordenada = new Coordenada('7', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 70, 110, 18]);
    this.coordenada = new Coordenada('7', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 90, 110, 18]);
    this.coordenada = new Coordenada('7', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("7", 785, 130);

    //bahia 7 b
    this.point = new Uint32Array([792, 10, 110, 18]);
    this.coordenada = new Coordenada('7', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 30, 110, 18]);
    this.coordenada = new Coordenada('7', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 50, 110, 18]);
    this.coordenada = new Coordenada('7', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 70, 110, 18]);
    this.coordenada = new Coordenada('7', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 90, 110, 18]);
    this.coordenada = new Coordenada('7', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia6N2() {
    this.point = new Uint16Array([783, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });


    this.point = new Uint16Array([806, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([829, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([852, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([875, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("6", 760, 330);

    // bahia 6 B 
    this.point = new Uint16Array([783, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([806, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([829, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([852, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([875, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
  }

  bahia5N2() {
    //bahia 5 A

    this.point = new Uint32Array([783, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([806, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([829, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([852, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([875, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("5", 760, 490);

  }



  bahia4N2() {
    this.point = new Uint32Array([846, 650, 55, 18]);
    this.coordenada = new Coordenada('4', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 670, 55, 18]);
    this.coordenada = new Coordenada('4', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 690, 55, 18]);
    this.coordenada = new Coordenada('4', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 710, 55, 18]);
    this.coordenada = new Coordenada('4', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 730, 55, 18]);
    this.coordenada = new Coordenada('4', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("4", 870, 640);
  }

  bahia3N2() {
    //BAHIA 3 A


    this.point = new Uint32Array([721, 650, 110, 18]);
    this.coordenada = new Coordenada('3', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 670, 110, 18]);
    this.coordenada = new Coordenada('3', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 690, 110, 18]);
    this.coordenada = new Coordenada('3', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([721, 710, 110, 18]);
    this.coordenada = new Coordenada('3', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 730, 110, 18]);
    this.coordenada = new Coordenada('3', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("3", 713, 640);

    // BAHIA 3 B

    this.point = new Uint32Array([609, 650, 110, 18]);
    this.coordenada = new Coordenada('3', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 670, 110, 18]);
    this.coordenada = new Coordenada('3', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 690, 110, 18]);
    this.coordenada = new Coordenada('3', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 710, 110, 18]);
    this.coordenada = new Coordenada('3', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 730, 110, 18]);
    this.coordenada = new Coordenada('3', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia2N2() {
    this.point = new Uint32Array([484, 650, 110, 18]);
    this.coordenada = new Coordenada('2', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 670, 110, 18]);
    this.coordenada = new Coordenada('2', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 690, 110, 18]);
    this.coordenada = new Coordenada('2', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 710, 110, 18]);
    this.coordenada = new Coordenada('2', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 730, 110, 18]);
    this.coordenada = new Coordenada('2', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("2", 477, 640);
    //BAHIA 2 B

    this.point = new Uint32Array([372, 650, 110, 18]);
    this.coordenada = new Coordenada('2', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 670, 110, 18]);
    this.coordenada = new Coordenada('2', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 690, 110, 18]);
    this.coordenada = new Coordenada('2', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 710, 110, 18]);
    this.coordenada = new Coordenada('2', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 730, 110, 18]);
    this.coordenada = new Coordenada('2', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia1N2() {
    this.point = new Uint32Array([247, 650, 110, 18]);
    this.coordenada = new Coordenada('1', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 670, 110, 18]);
    this.coordenada = new Coordenada('1', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 690, 110, 18]);
    this.coordenada = new Coordenada('1', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 710, 110, 18]);
    this.coordenada = new Coordenada('1', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 730, 110, 18]);
    this.coordenada = new Coordenada('1', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("1", 238, 640);

    //BAHIA 1 B


    this.point = new Uint32Array([135, 650, 110, 18]);
    this.coordenada = new Coordenada('1', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 670, 110, 18]);
    this.coordenada = new Coordenada('1', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 690, 110, 18]);
    this.coordenada = new Coordenada('1', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 710, 110, 18]);
    this.coordenada = new Coordenada('1', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 730, 110, 18]);
    this.coordenada = new Coordenada('1', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }


  bahia13N2() {
    this.point = new Uint32Array([130, 245, 110, 18]);
    this.coordenada = new Coordenada('13 ', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 265, 110, 18]);
    this.coordenada = new Coordenada('13', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 285, 110, 18]);
    this.coordenada = new Coordenada('13', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 305, 110, 18]);
    this.coordenada = new Coordenada('13', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 325, 110, 18]);
    this.coordenada = new Coordenada('13', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 345, 110, 18]);
    this.coordenada = new Coordenada('13', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 365, 110, 18]);
    this.coordenada = new Coordenada('13', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 385, 110, 18]);
    this.coordenada = new Coordenada('13', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 405, 110, 18]);
    this.coordenada = new Coordenada('13', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 425, 110, 18]);
    this.coordenada = new Coordenada('13', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 445, 110, 18]);
    this.coordenada = new Coordenada('13', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 465, 110, 18]);
    this.coordenada = new Coordenada('13', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("13", 180, 225);
  }

  bahia14N2() {
    this.point = new Uint32Array([247, 245, 110, 18]);
    this.coordenada = new Coordenada('14 ', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 265, 110, 18]);
    this.coordenada = new Coordenada('14', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 285, 110, 18]);
    this.coordenada = new Coordenada('14', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 305, 110, 18]);
    this.coordenada = new Coordenada('14', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 325, 110, 18]);
    this.coordenada = new Coordenada('14', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 345, 110, 18]);
    this.coordenada = new Coordenada('14', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 365, 110, 18]);
    this.coordenada = new Coordenada('14', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 385, 110, 18]);
    this.coordenada = new Coordenada('14', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 405, 110, 18]);
    this.coordenada = new Coordenada('14', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 425, 110, 18]);
    this.coordenada = new Coordenada('14', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 445, 110, 18]);
    this.coordenada = new Coordenada('14', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 465, 110, 18]);
    this.coordenada = new Coordenada('14', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("14", 290, 225);
  }

  bahia15N2() {

    this.point = new Uint32Array([372, 245, 110, 18]);
    this.coordenada = new Coordenada('15', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 265, 110, 18]);
    this.coordenada = new Coordenada('15', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 285, 110, 18]);
    this.coordenada = new Coordenada('15', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 305, 110, 18]);
    this.coordenada = new Coordenada('15', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([372, 325, 110, 18]);
    this.coordenada = new Coordenada('15', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 345, 110, 18]);
    this.coordenada = new Coordenada('15', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 365, 110, 18]);
    this.coordenada = new Coordenada('15', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 385, 110, 18]);
    this.coordenada = new Coordenada('15', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 405, 110, 18]);
    this.coordenada = new Coordenada('15', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 425, 110, 18]);
    this.coordenada = new Coordenada('15', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 445, 110, 18]);
    this.coordenada = new Coordenada('15', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 465, 110, 18]);
    this.coordenada = new Coordenada('15', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("15", 415, 225);
  }

  bahia16N2() {
    this.point = new Uint32Array([494, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([518, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([542, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([566, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([590, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });


    this.point = new Uint32Array([494, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([518, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([542, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([566, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([590, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([498, 345, 110, 18]);
    this.coordenada = new Coordenada('16', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([498, 365, 110, 18]);
    this.coordenada = new Coordenada('16', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }
  bahia17N2() {

    this.point = new Uint32Array([10, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada,"orientacion": "V" });

    this.point = new Uint32Array([34, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([58, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([82, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([106, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada,"orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("17", 135, 550);
  }


  // =================== N I V E L  [ 3 ]====================================

  bahia12N3() {
    //Bahia 12 
    this.point = new Uint32Array([10, 245, 110, 18]);
    this.coordenada = new Coordenada('12 ', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 265, 110, 18]);
    this.coordenada = new Coordenada('12', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 285, 110, 18]);
    this.coordenada = new Coordenada('12', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 305, 110, 18]);
    this.coordenada = new Coordenada('12', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 325, 110, 18]);
    this.coordenada = new Coordenada('12', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 345, 110, 18]);
    this.coordenada = new Coordenada('12', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 365, 110, 18]);
    this.coordenada = new Coordenada('12', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 385, 110, 18]);
    this.coordenada = new Coordenada('12', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 405, 110, 18]);
    this.coordenada = new Coordenada('12', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 425, 110, 18]);
    this.coordenada = new Coordenada('12', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 445, 110, 18]);
    this.coordenada = new Coordenada('12', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 465, 110, 18]);
    this.coordenada = new Coordenada('12', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("12", 55, 225);
  }

  bahia11N3() {
    this.point = new Uint32Array([10, 10, 110, 18]);
    this.coordenada = new Coordenada('11', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([10, 30, 110, 18]);
    this.coordenada = new Coordenada('11', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 50, 110, 18]);
    this.coordenada = new Coordenada('11', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 70, 110, 18]);
    this.coordenada = new Coordenada('11', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([10, 90, 110, 18]);
    this.coordenada = new Coordenada('11', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("11", 55, 130);
  }


  bahia10N3() {
    //bahia 10 A
    this.point = new Uint32Array([135, 10, 110, 18]);
    this.coordenada = new Coordenada('10', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([135, 30, 110, 18]);
    this.coordenada = new Coordenada('10', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 50, 110, 18]);
    this.coordenada = new Coordenada('10', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 70, 110, 18]);
    this.coordenada = new Coordenada('10', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 90, 110, 18]);
    this.coordenada = new Coordenada('10', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("10", 235, 130);

    //bahia 10 B

    this.point = new Uint32Array([247, 10, 110, 18]);
    this.coordenada = new Coordenada('10', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 30, 110, 18]);
    this.coordenada = new Coordenada('10', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 50, 110, 18]);
    this.coordenada = new Coordenada('10', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 70, 110, 18]);
    this.coordenada = new Coordenada('10', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 90, 110, 18]);
    this.coordenada = new Coordenada('10', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia9N3() {
    this.point = new Uint32Array([372, 10, 110, 18]);
    this.coordenada = new Coordenada('9', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 30, 110, 18]);
    this.coordenada = new Coordenada('9', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 50, 110, 18]);
    this.coordenada = new Coordenada('9', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 70, 110, 18]);
    this.coordenada = new Coordenada('9', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 90, 110, 18]);
    this.coordenada = new Coordenada('9', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("9", 478, 130);

    // bahia 9 B
    this.point = new Uint32Array([484, 10, 110, 18]);
    this.coordenada = new Coordenada('9', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 30, 110, 18]);
    this.coordenada = new Coordenada('9', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 50, 110, 18]);
    this.coordenada = new Coordenada('9', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 70, 110, 18]);
    this.coordenada = new Coordenada('9', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 90, 110, 18]);
    this.coordenada = new Coordenada('9', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


  }

  bahia8N3() {
    // bahia 8 A
    this.point = new Uint16Array([609, 10, 55, 18]);
    this.coordenada = new Coordenada('8', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 30, 55, 18]);
    this.coordenada = new Coordenada('8', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 50, 55, 18]);
    this.coordenada = new Coordenada('8', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 70, 55, 18]);
    this.coordenada = new Coordenada('8', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint16Array([609, 90, 55, 18]);
    this.coordenada = new Coordenada('8', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("8", 630, 130);
  }


  bahia7N3() {
    this.point = new Uint32Array([680, 10, 110, 18]);
    this.coordenada = new Coordenada('7', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 30, 110, 18]);
    this.coordenada = new Coordenada('7', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 50, 110, 18]);
    this.coordenada = new Coordenada('7', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 70, 110, 18]);
    this.coordenada = new Coordenada('7', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([680, 90, 110, 18]);
    this.coordenada = new Coordenada('7', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("7", 785, 130);

    //bahia 7 b
    this.point = new Uint32Array([792, 10, 110, 18]);
    this.coordenada = new Coordenada('7', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 30, 110, 18]);
    this.coordenada = new Coordenada('7', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 50, 110, 18]);
    this.coordenada = new Coordenada('7', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 70, 110, 18]);
    this.coordenada = new Coordenada('7', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([792, 90, 110, 18]);
    this.coordenada = new Coordenada('7', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia6N3() {
    this.point = new Uint16Array([783, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([806, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([829, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([852, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([875, 220, 22, 90]);
    this.coordenada = new Coordenada('6', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("6", 760, 330);

    // bahia 6 B 
    this.point = new Uint16Array([783, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([806, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([829, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([852, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint16Array([875, 322, 22, 90]);
    this.coordenada = new Coordenada('6', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
  }

  bahia5N3() {
    //bahia 5 A

    this.point = new Uint32Array([783, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([806, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([829, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([852, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([875, 430, 22, 90]);
    this.coordenada = new Coordenada('5', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("5", 760, 490);

  }



  bahia4N3() {
    //bahia 4 A
    this.point = new Uint32Array([846, 650, 55, 18]);
    this.coordenada = new Coordenada('4', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 670, 55, 18]);
    this.coordenada = new Coordenada('4', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 690, 55, 18]);
    this.coordenada = new Coordenada('4', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 710, 55, 18]);
    this.coordenada = new Coordenada('4', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([846, 730, 55, 18]);
    this.coordenada = new Coordenada('4', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("4", 870, 640);
  }

  bahia3N3() {
    this.point = new Uint32Array([721, 650, 110, 18]);
    this.coordenada = new Coordenada('3', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 670, 110, 18]);
    this.coordenada = new Coordenada('3', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 690, 110, 18]);
    this.coordenada = new Coordenada('3', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([721, 710, 110, 18]);
    this.coordenada = new Coordenada('3', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([721, 730, 110, 18]);
    this.coordenada = new Coordenada('3', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("3", 713, 640);

    // BAHIA 3 B

    this.point = new Uint32Array([609, 650, 110, 18]);
    this.coordenada = new Coordenada('3', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 670, 110, 18]);
    this.coordenada = new Coordenada('3', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 690, 110, 18]);
    this.coordenada = new Coordenada('3', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 710, 110, 18]);
    this.coordenada = new Coordenada('3', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([609, 730, 110, 18]);
    this.coordenada = new Coordenada('3', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia2N3() {
    this.point = new Uint32Array([484, 650, 110, 18]);
    this.coordenada = new Coordenada('2', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 670, 110, 18]);
    this.coordenada = new Coordenada('2', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 690, 110, 18]);
    this.coordenada = new Coordenada('2', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 710, 110, 18]);
    this.coordenada = new Coordenada('2', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([484, 730, 110, 18]);
    this.coordenada = new Coordenada('2', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("2", 477, 640);
    //BAHIA 2 B

    this.point = new Uint32Array([372, 650, 110, 18]);
    this.coordenada = new Coordenada('2', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 670, 110, 18]);
    this.coordenada = new Coordenada('2', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 690, 110, 18]);
    this.coordenada = new Coordenada('2', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 710, 110, 18]);
    this.coordenada = new Coordenada('2', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 730, 110, 18]);
    this.coordenada = new Coordenada('2', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia1N3() {
    this.point = new Uint32Array([247, 650, 110, 18]);
    this.coordenada = new Coordenada('1', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 670, 110, 18]);
    this.coordenada = new Coordenada('1', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 690, 110, 18]);
    this.coordenada = new Coordenada('1', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 710, 110, 18]);
    this.coordenada = new Coordenada('1', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 730, 110, 18]);
    this.coordenada = new Coordenada('1', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("1", 238, 640);

    //BAHIA 1 B


    this.point = new Uint32Array([135, 650, 110, 18]);
    this.coordenada = new Coordenada('1', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 670, 110, 18]);
    this.coordenada = new Coordenada('1', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 690, 110, 18]);
    this.coordenada = new Coordenada('1', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 710, 110, 18]);
    this.coordenada = new Coordenada('1', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([135, 730, 110, 18]);
    this.coordenada = new Coordenada('1', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }


  bahia13N3() {
    //reim 13 A
    this.point = new Uint32Array([130, 245, 110, 18]);
    this.coordenada = new Coordenada('13 ', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 265, 110, 18]);
    this.coordenada = new Coordenada('13', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 285, 110, 18]);
    this.coordenada = new Coordenada('13', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 305, 110, 18]);
    this.coordenada = new Coordenada('13', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 325, 110, 18]);
    this.coordenada = new Coordenada('13', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 345, 110, 18]);
    this.coordenada = new Coordenada('13', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 365, 110, 18]);
    this.coordenada = new Coordenada('13', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 385, 110, 18]);
    this.coordenada = new Coordenada('13', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 405, 110, 18]);
    this.coordenada = new Coordenada('13', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 425, 110, 18]);
    this.coordenada = new Coordenada('13', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 445, 110, 18]);
    this.coordenada = new Coordenada('13', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([130, 465, 110, 18]);
    this.coordenada = new Coordenada('13', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("13", 180, 225);
  }

  bahia14N3() {
    this.point = new Uint32Array([247, 245, 110, 18]);
    this.coordenada = new Coordenada('14 ', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 265, 110, 18]);
    this.coordenada = new Coordenada('14', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 285, 110, 18]);
    this.coordenada = new Coordenada('14', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 305, 110, 18]);
    this.coordenada = new Coordenada('14', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 325, 110, 18]);
    this.coordenada = new Coordenada('14', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 345, 110, 18]);
    this.coordenada = new Coordenada('14', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 365, 110, 18]);
    this.coordenada = new Coordenada('14', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 385, 110, 18]);
    this.coordenada = new Coordenada('14', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 405, 110, 18]);
    this.coordenada = new Coordenada('14', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 425, 110, 18]);
    this.coordenada = new Coordenada('14', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 445, 110, 18]);
    this.coordenada = new Coordenada('14', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([247, 465, 110, 18]);
    this.coordenada = new Coordenada('14', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("14", 290, 225);
  }

  bahia15N3() {
    this.point = new Uint32Array([372, 245, 110, 18]);
    this.coordenada = new Coordenada('15', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 265, 110, 18]);
    this.coordenada = new Coordenada('15', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 285, 110, 18]);
    this.coordenada = new Coordenada('15', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 305, 110, 18]);
    this.coordenada = new Coordenada('15', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([372, 325, 110, 18]);
    this.coordenada = new Coordenada('15', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 345, 110, 18]);
    this.coordenada = new Coordenada('15', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 365, 110, 18]);
    this.coordenada = new Coordenada('15', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 385, 110, 18]);
    this.coordenada = new Coordenada('15', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 405, 110, 18]);
    this.coordenada = new Coordenada('15', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 425, 110, 18]);
    this.coordenada = new Coordenada('15', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 445, 110, 18]);
    this.coordenada = new Coordenada('15', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([372, 465, 110, 18]);
    this.coordenada = new Coordenada('15', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("15", 415, 225);
  }

  bahia16N3() {
    this.point = new Uint32Array([494, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([518, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([542, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([566, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([590, 245, 22, 90]);
    this.coordenada = new Coordenada('16', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });


    this.point = new Uint32Array([494, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([518, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([542, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([566, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });
    this.point = new Uint32Array([590, 390, 22, 90]);
    this.coordenada = new Coordenada('16', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "V" });

    this.point = new Uint32Array([498, 345, 110, 18]);
    this.coordenada = new Coordenada('16', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });

    this.point = new Uint32Array([498, 365, 110, 18]);
    this.coordenada = new Coordenada('16', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada, "orientacion": "H" });



    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillText("16", 540, 225);
  }
  bahia17N3() {
    this.point = new Uint32Array([10, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([34, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([58, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([82, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([106, 520, 22, 55]);
    this.coordenada = new Coordenada('17', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.font = "20px Arial";
    this.ctx.fillText("17", 135, 550);
  }




  numeracion() {
    this.ctx.fillStyle = 'black';
    this.ctx.font = "20px Arial";
    this.ctx.fillText("12", 55, 225);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("11", 55, 130);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("10", 235, 130);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("9", 478, 130);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("8", 630, 130);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("7", 785, 130);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("6", 760, 330);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("5", 760, 490);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("4", 870, 640);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("3", 713, 640);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("2", 477, 640);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("1", 238, 640);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("13", 180, 225);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("14", 290, 225);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("15", 415, 225);
    this.ctx.font = "20px Arial";
    this.ctx.fillText("17", 135, 550)
  }




  // METODOS

  drawContainers(array) {

    this.coordenadaService.getCoordenadas().subscribe(coordenada => {
      this.coordenadas = coordenada.coordenadas;




      /////////////////////DIBUJO CONTORNOS NIVELES /////////////////////////
      // SIRVE PARA QUE NO SE PONGA EL MAPA CORTADO EN EL CONTORNO DE LOS CUADROS 
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([0, 0])
      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      ////////////////////////////////////////////////////////////////////////////////////

      // RECORREMOS EL ARRAY PARA SACAR EL TIPO, AHIA Y POSICION DE LA BD
      array.forEach(a => {
        if (this.coordenadas) {
          this.coordenadas.forEach(coor => {
            if (coor.bahia == a.coordenada.bahia && coor.posicion == a.coordenada.posicion) {
              a.tipo = coor.tipo;
              a.maniobras = coor.maniobras;
            }
          })
        }


        //PINTAMOS EL MAPA DEL NIVELES

        //Contenedores 40
        if (a.tipo == 40) {
          if (a.maniobras.length > 0) {// SI TIENE MANIOBRA SOLO SE VA PINTAR EL RECTANCULO Y NO EL NOMBRE
            this.ctx.fillText(a, coordenada.posicion, a.an + 50, a.al + 50)
            this.ctx.rect(a.x, a.y, a.an, a.al);
          } else {
            this.ctx.rect(a.x, a.y, a.an, a.al); // PINTAMOS EL RECTANGULO CON LAS VARIABLES DE X, Y QUE NO TIENE MANIOBRA
            this.ctx.fillStyle = 'black';
            this.ctx.font = "bold 11px sans-serif";

            if (a.orientacion == "V") {
              this.ctx.fillText(a.coordenada.posicion, a.x + 5, a.y + 50); //COLOCAMOS LA POSICION DE CADA ESPACIO DE 40 VERTICAL
            } else {
              this.ctx.fillText(a.coordenada.posicion, a.x + 50, a.y + 13); //COLOCAMOS LA POSICION DE CADA ESPACIO DE 40 HORIZONTAL
            }

          }
        }

        //Contenedores 20
        else if (a.tipo == 20) {
          this.ctx.rect(a.x, a.y, a.an, a.al);
          this.ctx.fillStyle = 'black';
          this.ctx.font = "bold 9px sans-serif";

          if (a.orientacion == "H") {
            this.ctx.fillText(a.coordenada.posicion, a.x + 22, a.y + 13); //COLOCAMOS LA POSICION DE CADA ESPACIO DE 20 HORIZONTAL
          } else {
            this.ctx.fillText(a.coordenada.posicion, a.x + 5, a.y + 30); //COLOCAMOS LA POSICION DE CADA ESPACIO DE 20 VERTICAL
          }


        }
      });


      this.ctx.stroke();

      /////////////////////////////////////////////////////////////



      array.forEach(c => {
        // var elem = document.getElementById("canvass");
        // var ctx = this.canvas.nativeElement.getContext("2d");
        
        //   var pos = {
        //     x: c.x,
        //     y: c.y
        //   };


        //   elem.addEventListener('click', function (event) {
        //     pos = oMousePos(elem, event)
        //     ctx.beginPath();
        //     if (c.maniobras){
        //       ctx.rect(c.x, c.y, c.an, c.al);
        //       if (ctx.isPointInPath(c.x, c.y)) {
        //         console.log(pos.x, pos.y);
        //     }
        //     }


        //   });


        
        // function oMousePos(elem, event) {
        //   var ClientRect = elem.getBoundingClientRect();
        //   return { //objeto
        //     x: Math.round(event.clientX - ClientRect.left),
        //     y: Math.round(event.clientY - ClientRect.top)
        //   }
        // }
       

        // if (this.coordenadas) {
        // this.coordenadas.forEach(coor => {
        // if (coor.bahia == c.coordenada.bahia && coor.posicion == c.coordenada.posicion) {


        var count = 0;
        // Si tengo mas de una maniobra
        if (c.maniobras.length > 0) {


          c.maniobras.forEach(m => {
            count++;



            // Obtengo el tipo
            var tipo = this.TryParseInt(m.maniobra.tipo.substring(0, 2), 0);
            var ancho = 0;
            if (tipo) {
              // Calculo el ancho que voy a rellenar
              ancho = c.tipo / tipo
            }


            if (count > 1) {
              if (c.orientacion == "V" && tipo != "40") {
                c.y = c.y + (90 / ancho);
              } else if (c.orientacion == "V" && tipo == "40" && c.bahia == "16") {
                c.y = c.y + (90 / ancho);

              } else {
                c.x = c.x + (110 / ancho);

              }

            }
            //c.x = c.x;


            if (c.coordenada.posicion.includes("1")) {



              if (c.tipo === 40) {
                if (c.tipo != tipo && c.orientacion == 'V') {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al / ancho);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 30);
                  this.ctx.rect(c.x, c.y, c.an, c.al / ancho);

                  if (c.maniobras.length <= 1) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 72)
                  } else {
                   
                  }
                  this.ctx.stroke();
                } else
                  if (c.tipo != tipo) {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgb(14,121,19)';
                    this.ctx.fillRect(c.x, c.y, 110 / ancho, 18);
                    this.ctx.fillStyle = 'rgb(250,250,251)';
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.stroke();
                    this.ctx.fillText(c.coordenada.posicion, c.x + ((110 / ancho) / 2 - 6), c.y + 13);
                    this.ctx.lineWidth = 2;
                    this.ctx.rect(c.x, c.y, 110 / ancho, 18);

                    if (c.maniobras.length <= 1) {
                      this.ctx.fillStyle = 'black';
                      this.ctx.fillText(c.coordenada.posicion, c.x + 75, c.y + 13)
                    } else {
                     
                    }

                    this.ctx.stroke();
                  }
                  else if (c.coordenada.bahia == "16" && c.orientacion == "H") {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgb(0,44,119)';
                    this.ctx.fillRect(c.x, c.y, 22, 90);
                    this.ctx.fillStyle = 'rgb(250,250,251)';
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.fillText(c.coordenada.posicion, c.x + 5, c.y + 50);
                    this.ctx.lineWidth = 2;
                    this.ctx.rect(c.x, c.y, c.an, c.al);
                    this.ctx.stroke();
                  } else
                    if (c.orientacion == "V") {
                      this.ctx.beginPath()
                      this.ctx.fillStyle = 'rgb(0,44,119)';
                      this.ctx.fillRect(c.x, c.y, 22, 90);
                      this.ctx.fillStyle = 'rgb(250,250,251)';
                      this.ctx.font = "bold 11px sans-serif";
                      this.ctx.fillText(c.coordenada.posicion, c.x + 5, c.y + 50);
                      this.ctx.lineWidth = 2;
                      this.ctx.rect(c.x, c.y, 22, 90);
                      this.ctx.stroke();
                    }
                    else {
                      this.ctx.beginPath()
                      this.ctx.fillStyle = 'rgb(0,44,119)';
                      this.ctx.fillRect(c.x, c.y, 110, 18);
                      this.ctx.fillStyle = 'rgb(250,250,251)';
                      this.ctx.font = "bold 11px sans-serif";
                      this.ctx.fillText(c.coordenada.posicion, c.x + ((110 / ancho) / 2 - 6), c.y + 13);
                      this.ctx.lineWidth = 2;
                      this.ctx.rect(c.x, c.y, 110, 18);
                      this.ctx.stroke();
                    }
                //Contenedores 20
              } if (c.tipo === 20) {
                if (c.orientacion == "V") {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 30);
                  this.ctx.rect(c.x, c.y, c.an, c.al);
                  this.ctx.stroke();
                } else {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 21, c.y + 12);
                  this.ctx.rect(c.x, c.y, c.an, c.al);
                  this.ctx.stroke();
                }

              }



            }



            if (c.coordenada.posicion.includes("2")) {

             
              if (c.tipo === 40) {
                if (c.tipo != tipo && c.orientacion == 'V') {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al / ancho);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 30);
                  this.ctx.rect(c.x, c.y, c.an, c.al / ancho);

                  if (c.maniobras.length <= 1) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 72)
                  } else {
                    
                  }
                  this.ctx.stroke();
                } else
                  if (c.tipo != tipo) {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgb(14,121,19)';
                    this.ctx.fillRect(c.x, c.y, 110 / ancho, 18);
                    this.ctx.fillStyle = 'rgb(250,250,251)';
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.stroke();
                    this.ctx.fillText(c.coordenada.posicion, c.x + ((110 / ancho) / 2 - 6), c.y + 13);
                    this.ctx.lineWidth = 2;
                    this.ctx.rect(c.x, c.y, 110 / ancho, 18);

                    if (c.maniobras.length <= 1) {
                      this.ctx.fillStyle = 'black';
                      this.ctx.fillText(c.coordenada.posicion, c.x + 75, c.y + 13)
                    } else {
                      
                    }

                    this.ctx.stroke();
                  }
                  else if (c.coordenada.bahia == "16" && c.orientacion == "H") {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgb(0,44,119)';
                    this.ctx.fillRect(c.x, c.y, 22, 90);
                    this.ctx.fillStyle = 'rgb(250,250,251)';
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.fillText(c.coordenada.posicion, c.x + 5, c.y + 50);
                    this.ctx.lineWidth = 2;
                    this.ctx.rect(c.x, c.y, c.an, c.al);
                    this.ctx.stroke();
                  } else
                    if (c.orientacion == "V") {
                      this.ctx.beginPath()
                      this.ctx.fillStyle = 'rgb(0,44,119)';
                      this.ctx.fillRect(c.x, c.y, 22, 90);
                      this.ctx.fillStyle = 'rgb(250,250,251)';
                      this.ctx.font = "bold 11px sans-serif";
                      this.ctx.fillText(c.coordenada.posicion, c.x + 5, c.y + 50);
                      this.ctx.lineWidth = 2;
                      this.ctx.rect(c.x, c.y, 22, 90);
                      this.ctx.stroke();
                    }
                    else {
                      this.ctx.beginPath()
                      this.ctx.fillStyle = 'rgb(0,44,119)';
                      this.ctx.fillRect(c.x, c.y, 110, 18);
                      this.ctx.fillStyle = 'rgb(250,250,251)';
                      this.ctx.font = "bold 11px sans-serif";
                      this.ctx.fillText(c.coordenada.posicion, c.x + ((110 / ancho) / 2 - 6), c.y + 13);
                      this.ctx.lineWidth = 2;
                      this.ctx.rect(c.x, c.y, 110, 18);
                      this.ctx.stroke();
                    }
                //Contenedores 20
              } if (c.tipo === 20) {
                if (c.orientacion == "V") {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";

                  this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 30);
                  this.ctx.rect(c.x, c.y, c.an, c.al);
                  this.ctx.stroke();
                } else {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 21, c.y + 12);
                  this.ctx.rect(c.x, c.y, c.an, c.al);
                  this.ctx.stroke();
                }

              }




            }

            if (c.coordenada.posicion.includes("3")) {

            
              if (c.tipo === 40) {
                if (c.tipo != tipo && c.orientacion == 'V') {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al / ancho);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 30);
                  this.ctx.rect(c.x, c.y, c.an, c.al / ancho);

                  if (c.maniobras.length <= 1) {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 72)
                  } else {
                   
                  }
                  this.ctx.stroke();
                } else
                  if (c.tipo != tipo) {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgb(14,121,19)';
                    this.ctx.fillRect(c.x, c.y, 110 / ancho, 18);
                    this.ctx.fillStyle = 'rgb(250,250,251)';
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.stroke();
                    this.ctx.fillText(c.coordenada.posicion, c.x + ((110 / ancho) / 2 - 6), c.y + 13);
                    this.ctx.lineWidth = 2;
                    this.ctx.rect(c.x, c.y, 110 / ancho, 18);

                    if (c.maniobras.length <= 1) {
                      this.ctx.fillStyle = 'black';
                      this.ctx.fillText(c.coordenada.posicion, c.x + 75, c.y + 13)
                    } else {
                      
                    }

                    this.ctx.stroke();
                  }
                  else if (c.coordenada.bahia == "16" && c.orientacion == "H") {
                    this.ctx.beginPath()
                    this.ctx.fillStyle = 'rgb(0,44,119)';
                    this.ctx.fillRect(c.x, c.y, 22, 90);
                    this.ctx.fillStyle = 'rgb(250,250,251)';
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.fillText(c.coordenada.posicion, c.x + 5, c.y + 50);
                    this.ctx.lineWidth = 2;
                    this.ctx.rect(c.x, c.y, c.an, c.al);
                    this.ctx.stroke();
                  } else
                    if (c.orientacion == "V") {
                      this.ctx.beginPath()
                      this.ctx.fillStyle = 'rgb(0,44,119)';
                      this.ctx.fillRect(c.x, c.y, 22, 90);
                      this.ctx.fillStyle = 'rgb(250,250,251)';
                      this.ctx.font = "bold 11px sans-serif";
                      this.ctx.fillText(c.coordenada.posicion, c.x + 5, c.y + 50);
                      this.ctx.lineWidth = 2;
                      this.ctx.rect(c.x, c.y, 22, 90);
                      this.ctx.stroke();
                    }
                    else {
                      this.ctx.beginPath()
                      this.ctx.fillStyle = 'rgb(0,44,119)';
                      this.ctx.fillRect(c.x, c.y, 110, 18);
                      this.ctx.fillStyle = 'rgb(250,250,251)';
                      this.ctx.font = "bold 11px sans-serif";
                      this.ctx.fillText(c.coordenada.posicion, c.x + ((110 / ancho) / 2 - 6), c.y + 13);
                      this.ctx.lineWidth = 2;
                      this.ctx.rect(c.x, c.y, 110, 18);
                      this.ctx.stroke();
                    }
                //Contenedores 20
              } if (c.tipo === 20) {
                if (c.orientacion == "V") {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 4, c.y + 30);
                  this.ctx.rect(c.x, c.y, c.an, c.al);
                  this.ctx.stroke();
                } else {
                  this.ctx.beginPath()
                  this.ctx.fillStyle = 'rgb(14,121,19)';
                  this.ctx.fillRect(c.x, c.y, c.an, c.al);
                  this.ctx.fillStyle = 'rgb(250,250,251)';
                  this.ctx.font = "bold 11px sans-serif";
                  this.ctx.fillText(c.coordenada.posicion, c.x + 21, c.y + 12);
                  this.ctx.rect(c.x, c.y, c.an, c.al);
                  this.ctx.stroke();
                }

              }




            }
          });
        }

      });
    });

  }

  TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
      if (str.length > 0) {
        if (!isNaN(str)) {
          retValue = parseInt(str);
        }
      }
    }
    return retValue;
  }

  draw(nivel) {

    if (this.ctx != undefined) {
      this.ctx.clearRect(0, 0, 955, 760);
      this.arrayClamped = [];
      this.arrayJsons = [];
    }

    if (nivel == "N1") {
      // =================== N I V E L  [ 1 ]====================================  
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.bahia1();
      this.bahia2();
      this.bahia3();
      this.bahia4();
      this.bahia5();
      this.bahia6();
      this.bahia7();
      this.bahia8();
      this.bahia9();
      this.bahia10();
      this.bahia11();
      this.bahia12();
      this.bahia13();
      this.bahia14();
      this.bahia15();
      this.bahia16();
      this.bahia17();
      // this.bahia20();
      // this.bahia6();
      // this.bahia19();
      // this.bahia21();
      // this.bahia13();
      // this.bahia14();
      // this.bahia15();
      this.linea();
      this.numeracion();

    } else {
      if (nivel == "N2") {
        // ==================================== N I V E L [ 2 ] ====================================
        this.ctx = this.canvas.nativeElement.getContext('2d');

        this.bahia1N2();
        this.bahia2N2();
        this.bahia3N2();
        this.bahia4N2();
        this.bahia5N2();
        this.bahia6N2();
        this.bahia7N2();
        this.bahia8N2();
        this.bahia9N2();
        this.bahia10N2();
        this.bahia11N2();
        this.bahia12N2();
        this.bahia13N2();
        this.bahia14N2();
        this.bahia15N2();
        this.bahia16N2();
        this.bahia17N2();
        this.linea();
        this.numeracion();
      } else {
        if (nivel == "N3") {

          // ==================================== N I V E L [ 3 ] ====================================
          this.ctx = this.canvas.nativeElement.getContext('2d');
          this.bahia1N3();
          this.bahia2N3();
          this.bahia3N3();
          this.bahia4N3();
          this.bahia5N3();
          this.bahia6N3();
          this.bahia7N3();
          this.bahia8N3();
          this.bahia9N3();
          this.bahia10N3();
          this.bahia11N3();
          this.bahia12N3();
          this.bahia13N3();
          this.bahia14N3();
          this.bahia15N3();
          this.bahia16N3();
          this.bahia17N3();
          this.linea();
          this.numeracion();
        }
      }
    }
    this.arrayClamped.forEach(nodo => {
      var json = {
        coordenada: nodo.coordenada,
        x: nodo.point[0],
        y: nodo.point[1],
        an: nodo.point[2],
        al: nodo.point[3],
        orientacion: nodo.orientacion,
        tipo: 0,
        maniobras: []
      };
      this.arrayJsons.push(json);

    });

    this.drawContainers(this.arrayJsons);
    // console.log(this.arrayJsons)
  }
}
