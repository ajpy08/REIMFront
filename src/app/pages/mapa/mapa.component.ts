import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Maniobra } from 'src/app/models/maniobra.models';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Coordenada } from 'src/app/models/coordenada.models';
import { CoordenadaService } from '../maniobras/coordenada.service';
import { Point_Coordenada } from 'src/app/models/point_coordenada.models';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasN2')
  canvasN2: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasN3')
  canvasN3: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  private ctx2: CanvasRenderingContext2D;
  private ctx3: CanvasRenderingContext2D;

  point;
  arrayJsons = [];
  arrayClamped = [];
  coordenada = new Coordenada('', '');
  point_coordenada;
  coordenadas;

  constructor(private maniobraService: ManiobraService, private coordenadaService: CoordenadaService) { }

  ngOnInit(): void {
    // =================== N I V E L  [ 1 ]====================================
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.bahia12();
    this.bahia11();
    this.bahia10();
    this.bahia9();
    this.bahia8();
    this.bahia20();
    this.bahia7();
    this.bahia6();
    this.bahia5();
    this.bahia19();
    this.bahia4();
    this.bahia3();
    this.bahia2();
    this.bahia1();
    this.bahia21();
    this.bahia13();
    this.bahia14();
    this.bahia15();
    this.bahia16();
    this.bahia17();
    this.bahia18();
    this.bahiaLavadoOReparacion();
    this.linea();


    // ==================================== N I V E L [ 2 ] ====================================
    this.ctx2 = this.canvasN2.nativeElement.getContext('2d');

    this.bahia12N2();
    this.bahia11N2();
    this.bahia10N2();
    this.bahia9N2();
    this.bahia8N2();
    this.bahia20N2();
    this.bahia7N2();
    this.bahia6N2();
    this.bahia5N2();
    this.bahia19N2();
    this.bahia4N2();
    this.bahia3N2();
    this.bahia2N2();
    this.bahia1N2();
    this.bahia21N2();
    this.bahia13N2();
    this.bahia14N2();
    this.bahia15N2();
    this.bahia16N2();
    this.bahia17N2();
    this.bahia18N2();
    this.bahiaLavadoOReparacionN2();
    this.lineaN2();



    // ==================================== N I V E L [ 3 ] ====================================
    this.ctx3 = this.canvasN3.nativeElement.getContext('2d');

    this.bahia12N3();
    this.bahia11N3();
    this.bahia10N3();
    this.bahia9N3();
    this.bahia8N3();
    this.bahia20N3();
    this.bahia7N3();
    this.bahia6N3();
    this.bahia5N3();
    this.bahia19N3();
    this.bahia4N3();
    this.bahia3N3();
    this.bahia2N3();
    this.bahia1N3();
    this.bahia21N3();
    this.bahia13N3();
    this.bahia14N3();
    this.bahia15N3();
    this.bahia16N3();
    this.bahia17N3();
    this.bahia18N3();
    this.bahiaLavadoOReparacionN3();
    this.lineaN3();




    this.arrayClamped.forEach(nodo => {
      var json = {
        coordenada: nodo.coordenada,
        x: nodo.point[0],
        y: nodo.point[1],
        tipo: 0,
        maniobra: ''
      };
      this.arrayJsons.push(json);

    });

    this.drawContainers(this.arrayJsons);


  }

  // =================== N I V E L  [ 1 ]====================================
  bahia12() {
    //Bahia 12    

    this.point = new Uint32Array([0, 0, 110, 18]);
    this.coordenada = new Coordenada('12', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([0, 20, 110, 18]);
    this.coordenada = new Coordenada('12', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 40, 110, 18]);
    this.coordenada = new Coordenada('12', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 60, 110, 18]);
    this.coordenada = new Coordenada('12', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 80, 110, 18]);
    this.coordenada = new Coordenada('12', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia11() {


    //bahia 11 A
    this.point = new Uint32Array([125, 0, 110, 18]);
    this.coordenada = new Coordenada('11', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([125, 20, 110, 18]);
    this.coordenada = new Coordenada('11', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 40, 110, 18]);
    this.coordenada = new Coordenada('11', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 60, 110, 18]);
    this.coordenada = new Coordenada('11', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 80, 110, 18]);
    this.coordenada = new Coordenada('11', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    //bahia 11 B

    this.point = new Uint32Array([237, 0, 110, 18]);
    this.coordenada = new Coordenada('11', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 20, 110, 18]);
    this.coordenada = new Coordenada('11', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 40, 110, 18]);
    this.coordenada = new Coordenada('11', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 60, 110, 18]);
    this.coordenada = new Coordenada('11', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 80, 110, 18]);
    this.coordenada = new Coordenada('11', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  linea() {
    this.ctx.beginPath();
    this.ctx.moveTo(356, 0);
    this.ctx.lineTo(356, 900);
    this.ctx.strokeStyle = "red";
    this.ctx.setLineDash([10, 10])
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }

  bahia10() {
    //bahia 10 A
    this.point = new Uint32Array([362, 0, 110, 18]);
    this.coordenada = new Coordenada('10', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 20, 110, 18]);
    this.coordenada = new Coordenada('10', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 40, 110, 18]);
    this.coordenada = new Coordenada('10', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 60, 110, 18]);
    this.coordenada = new Coordenada('10', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 80, 110, 18]);
    this.coordenada = new Coordenada('10', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([474, 0, 110, 18]);
    this.coordenada = new Coordenada('10', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 20, 110, 18]);
    this.coordenada = new Coordenada('10', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 40, 110, 18]);
    this.coordenada = new Coordenada('10', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 60, 110, 18]);
    this.coordenada = new Coordenada('10', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 80, 110, 18]);
    this.coordenada = new Coordenada('10', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });




    //bahia 10 B



  }

  bahia9() {

    this.point = new Uint16Array([599, 0, 110, 18]);
    this.coordenada = new Coordenada('9', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([599, 20, 110, 18]);
    this.coordenada = new Coordenada('9', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([599, 40, 110, 18]);
    this.coordenada = new Coordenada('9', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([599, 60, 110, 18]);
    this.coordenada = new Coordenada('9', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([599, 80, 110, 18]);
    this.coordenada = new Coordenada('9', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

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

  bahia8() {

    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "rgba(0,0,0,1)";
    // this.ctx.rect(724, 0, 110, 18);
    // this.ctx.rect(724, 20, 110, 18);
    // this.ctx.rect(724, 40, 110, 18);
    // this.ctx.rect(724, 60, 110, 18);
    // this.ctx.rect(724, 80, 110, 18);

    // bahia 8 A
    this.point = new Uint32Array([724, 0, 110, 18]);
    this.coordenada = new Coordenada('8', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 20, 110, 18]);
    this.coordenada = new Coordenada('8', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 40, 110, 18]);
    this.coordenada = new Coordenada('8', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 60, 110, 18]);
    this.coordenada = new Coordenada('8', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 80, 110, 18]);
    this.coordenada = new Coordenada('8', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 8 b
    this.point = new Uint32Array([836, 0, 110, 18]);
    this.coordenada = new Coordenada('8', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 20, 110, 18]);
    this.coordenada = new Coordenada('8', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 40, 110, 18]);
    this.coordenada = new Coordenada('8', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 60, 110, 18]);
    this.coordenada = new Coordenada('8', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 80, 110, 18]);
    this.coordenada = new Coordenada('8', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    // this.ctx.rect(836, 0, 110, 18);
    // this.ctx.rect(836, 20, 110, 18);
    // this.ctx.rect(836, 40, 110, 18);
    // this.ctx.rect(836, 60, 110, 18);
    // this.ctx.rect(836, 80, 110, 18);
  }

  bahia20() {

    this.point = new Uint16Array([836, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    // bahia 20 A
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "rgba(0,0,0,1)";
    // this.ctx.rect(836, 120, 22, 55);
    // this.ctx.rect(860, 120, 22, 55);
    // this.ctx.rect(884, 120, 22, 55);
    // this.ctx.rect(908, 120, 22, 55);
    // this.ctx.rect(932, 120, 22, 55);

    //bahia 20 b

    this.point = new Uint32Array([836, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    // this.ctx.rect(836, 177, 22, 55);
    // this.ctx.rect(860, 177, 22, 55);
    // this.ctx.rect(884, 177, 22, 55);
    // this.ctx.rect(908, 177, 22, 55);
    // this.ctx.rect(932, 177, 22, 55);
  }

  bahia7() {

    //reim 7 A
    this.point = new Uint16Array([836, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([860, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([884, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([908, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([932, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 7 B 
    this.point = new Uint16Array([836, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([860, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([884, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([908, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint16Array([932, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia6() {

    //bahia 6 A
    this.point = new Uint32Array([836, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 6 B
    this.point = new Uint32Array([836, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([932, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia5() {

    //bahia 5 A
    this.point = new Uint32Array([836, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 5 B

    this.point = new Uint32Array([836, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia19() {
    //bahia 19 A


    this.point = new Uint32Array([836, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    //bahia 19 B

    this.point = new Uint32Array([836, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia4() {

    //bahia 4 A


    this.point = new Uint32Array([836, 750, 110, 18]);
    this.coordenada = new Coordenada('4', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 770, 110, 18]);
    this.coordenada = new Coordenada('4', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 790, 110, 18]);
    this.coordenada = new Coordenada('4', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 810, 110, 18]);
    this.coordenada = new Coordenada('4', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 830, 110, 18]);
    this.coordenada = new Coordenada('4', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia3() {
    //BAHIA 3 A


    this.point = new Uint32Array([711, 750, 110, 18]);
    this.coordenada = new Coordenada('3', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 770, 110, 18]);
    this.coordenada = new Coordenada('3', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 790, 110, 18]);
    this.coordenada = new Coordenada('3', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([711, 810, 110, 18]);
    this.coordenada = new Coordenada('3', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 830, 110, 18]);
    this.coordenada = new Coordenada('3', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // BAHIA 3 B

    this.point = new Uint32Array([599, 750, 110, 18]);
    this.coordenada = new Coordenada('3', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 770, 110, 18]);
    this.coordenada = new Coordenada('3', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 790, 110, 18]);
    this.coordenada = new Coordenada('3', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 810, 110, 18]);
    this.coordenada = new Coordenada('3', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 830, 110, 18]);
    this.coordenada = new Coordenada('3', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia2() {
    //BAHIA 2 A

    this.point = new Uint32Array([474, 750, 110, 18]);
    this.coordenada = new Coordenada('2', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 770, 110, 18]);
    this.coordenada = new Coordenada('2', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 790, 110, 18]);
    this.coordenada = new Coordenada('2', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 810, 110, 18]);
    this.coordenada = new Coordenada('2', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 830, 110, 18]);
    this.coordenada = new Coordenada('2', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    //BAHIA 2 B

    this.point = new Uint32Array([362, 750, 110, 18]);
    this.coordenada = new Coordenada('2', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 770, 110, 18]);
    this.coordenada = new Coordenada('2', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 790, 110, 18]);
    this.coordenada = new Coordenada('2', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 810, 110, 18]);
    this.coordenada = new Coordenada('2', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 830, 110, 18]);
    this.coordenada = new Coordenada('2', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia1() {

    //BAHIA 1 A

    this.point = new Uint32Array([237, 750, 110, 18]);
    this.coordenada = new Coordenada('1', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 770, 110, 18]);
    this.coordenada = new Coordenada('1', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 790, 110, 18]);
    this.coordenada = new Coordenada('1', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 810, 110, 18]);
    this.coordenada = new Coordenada('1', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 830, 110, 18]);
    this.coordenada = new Coordenada('1', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    //BAHIA 1 B


    this.point = new Uint32Array([125, 750, 110, 18]);
    this.coordenada = new Coordenada('1', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 770, 110, 18]);
    this.coordenada = new Coordenada('1', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 790, 110, 18]);
    this.coordenada = new Coordenada('1', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 810, 110, 18]);
    this.coordenada = new Coordenada('1', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 830, 110, 18]);
    this.coordenada = new Coordenada('1', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



  }

  bahia21() {

    //bahia 21 A
    this.point = new Uint32Array([0, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 21 B
    this.point = new Uint32Array([0, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia13() {
    //reim 13 A


    this.point = new Uint32Array([0, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 13 B 
    this.point = new Uint32Array([0, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia14() {
    // BAHIA 14 A

    this.point = new Uint32Array([0, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 14 B
    this.point = new Uint32Array([0, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia15() {

    //bahia 15 A
    this.point = new Uint32Array([0, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 15 B
    this.point = new Uint32Array([0, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia16() {
    //BAHIA 16 

    this.point = new Uint32Array([0, 620, 22, 55]);
    this.coordenada = new Coordenada('16', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 620, 22, 55]);
    this.coordenada = new Coordenada('16', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 620, 22, 55]);
    this.coordenada = new Coordenada('16', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 620, 22, 55]);
    this.coordenada = new Coordenada('16', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 620, 22, 55]);
    this.coordenada = new Coordenada('16', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }
  bahia17() {
    //BAHIA 17

    this.point = new Uint32Array([237, 245, 110, 18]);
    this.coordenada = new Coordenada('17 ', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 265, 110, 18]);
    this.coordenada = new Coordenada('17', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 285, 110, 18]);
    this.coordenada = new Coordenada('17', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 305, 110, 18]);
    this.coordenada = new Coordenada('17', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 325, 110, 18]);
    this.coordenada = new Coordenada('17', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 345, 110, 18]);
    this.coordenada = new Coordenada('17', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 365, 110, 18]);
    this.coordenada = new Coordenada('17', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 385, 110, 18]);
    this.coordenada = new Coordenada('17', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 405, 110, 18]);
    this.coordenada = new Coordenada('17', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 425, 110, 18]);
    this.coordenada = new Coordenada('17', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 445, 110, 18]);
    this.coordenada = new Coordenada('17', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 465, 110, 18]);
    this.coordenada = new Coordenada('17', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia18() {
    //BAHIA 18

    this.point = new Uint32Array([362, 245, 110, 18]);
    this.coordenada = new Coordenada('18', 'A1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 265, 110, 18]);
    this.coordenada = new Coordenada('18', 'B1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 285, 110, 18]);
    this.coordenada = new Coordenada('18', 'C1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 305, 110, 18]);
    this.coordenada = new Coordenada('18', 'D1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([362, 325, 110, 18]);
    this.coordenada = new Coordenada('18', 'E1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 345, 110, 18]);
    this.coordenada = new Coordenada('18', 'F1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 365, 110, 18]);
    this.coordenada = new Coordenada('18', 'G1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 385, 110, 18]);
    this.coordenada = new Coordenada('18', 'H1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 405, 110, 18]);
    this.coordenada = new Coordenada('18', 'I1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 425, 110, 18]);
    this.coordenada = new Coordenada('18', 'J1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 445, 110, 18]);
    this.coordenada = new Coordenada('18', 'K1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 465, 110, 18]);
    this.coordenada = new Coordenada('18', 'L1', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahiaLavadoOReparacion() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black';

    this.ctx.rect(474, 245, 22, 55);
    this.ctx.rect(498, 245, 22, 55);
    this.ctx.rect(522, 245, 22, 55);
    this.ctx.rect(546, 245, 22, 55);
    this.ctx.rect(570, 245, 22, 55);

    //REPARACION 20
    this.ctx.rect(474, 302, 22, 55);
    this.ctx.rect(498, 302, 22, 55);
    this.ctx.rect(522, 302, 22, 55);
    this.ctx.rect(546, 302, 22, 55);
    this.ctx.rect(570, 302, 22, 55);



    this.ctx.rect(478, 360, 110, 18);
    this.ctx.rect(478, 380, 110, 18);

    //reparacion 40


    this.ctx.rect(474, 400, 22, 80);
    this.ctx.rect(498, 400, 22, 80);
    this.ctx.rect(522, 400, 22, 80);
    this.ctx.rect(546, 400, 22, 80);
    this.ctx.rect(570, 400, 22, 80);

    this.ctx.rect(608, 378, 22, 80);
    this.ctx.rect(608, 270, 22, 55);

    this.ctx.stroke();
  }


  // =================== N I V E L  [ 2 ]====================================

  bahia12N2() {
    //Bahia 12 

    this.point = new Uint32Array([0, 0, 110, 18]);
    this.coordenada = new Coordenada('12', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([0, 20, 110, 18]);
    this.coordenada = new Coordenada('12', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 40, 110, 18]);
    this.coordenada = new Coordenada('12', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 60, 110, 18]);
    this.coordenada = new Coordenada('12', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 80, 110, 18]);
    this.coordenada = new Coordenada('12', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia11N2() {
    this.point = new Uint32Array([125, 0, 110, 18]);
    this.coordenada = new Coordenada('11', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([125, 20, 110, 18]);
    this.coordenada = new Coordenada('11', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 40, 110, 18]);
    this.coordenada = new Coordenada('11', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 60, 110, 18]);
    this.coordenada = new Coordenada('11', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 80, 110, 18]);
    this.coordenada = new Coordenada('11', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    //bahia 11 B

    this.point = new Uint32Array([237, 0, 110, 18]);
    this.coordenada = new Coordenada('11', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 20, 110, 18]);
    this.coordenada = new Coordenada('11', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 40, 110, 18]);
    this.coordenada = new Coordenada('11', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 60, 110, 18]);
    this.coordenada = new Coordenada('11', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 80, 110, 18]);
    this.coordenada = new Coordenada('11', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  lineaN2() {
    this.ctx.beginPath();
    this.ctx.moveTo(356, 0);
    this.ctx.lineTo(356, 900);
    this.ctx.strokeStyle = "red";
    this.ctx.setLineDash([10, 10])
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

  }
  bahia10N2() {
    this.point = new Uint32Array([362, 0, 110, 18]);
    this.coordenada = new Coordenada('10', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 20, 110, 18]);
    this.coordenada = new Coordenada('10', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 40, 110, 18]);
    this.coordenada = new Coordenada('10', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 60, 110, 18]);
    this.coordenada = new Coordenada('10', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 80, 110, 18]);
    this.coordenada = new Coordenada('10', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([474, 0, 110, 18]);
    this.coordenada = new Coordenada('10', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 20, 110, 18]);
    this.coordenada = new Coordenada('10', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 40, 110, 18]);
    this.coordenada = new Coordenada('10', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 60, 110, 18]);
    this.coordenada = new Coordenada('10', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 80, 110, 18]);
    this.coordenada = new Coordenada('10', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



  }

  bahia9N2() {
    this.point = new Uint32Array([599, 0, 110, 18]);
    this.coordenada = new Coordenada('9', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 20, 110, 18]);
    this.coordenada = new Coordenada('9', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 40, 110, 18]);
    this.coordenada = new Coordenada('9', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 60, 110, 18]);
    this.coordenada = new Coordenada('9', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 80, 110, 18]);
    this.coordenada = new Coordenada('9', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia8N2() {
    // bahia 8 A
    this.point = new Uint32Array([724, 0, 110, 18]);
    this.coordenada = new Coordenada('8', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 20, 110, 18]);
    this.coordenada = new Coordenada('8', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 40, 110, 18]);
    this.coordenada = new Coordenada('8', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 60, 110, 18]);
    this.coordenada = new Coordenada('8', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 80, 110, 18]);
    this.coordenada = new Coordenada('8', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 8 b
    this.point = new Uint32Array([836, 0, 110, 18]);
    this.coordenada = new Coordenada('8', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 20, 110, 18]);
    this.coordenada = new Coordenada('8', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 40, 110, 18]);
    this.coordenada = new Coordenada('8', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 60, 110, 18]);
    this.coordenada = new Coordenada('8', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 80, 110, 18]);
    this.coordenada = new Coordenada('8', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia20N2() {
    //bahia 20 A
    this.point = new Uint32Array([836, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    //bahia 20 b
    this.point = new Uint32Array([836, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia7N2() {
    this.point = new Uint32Array([836, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 7 B 
    this.point = new Uint32Array([836, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia6N2() {
    this.point = new Uint32Array([836, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 6 B
    this.point = new Uint32Array([836, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([932, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia5N2() {
    //bahia 5 A
    this.point = new Uint32Array([836, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 5 B

    this.point = new Uint32Array([836, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia19N2() {
    //bahia 19 A
    this.point = new Uint32Array([836, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    //bahia 19 B

    this.point = new Uint32Array([836, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia4N2() {
    //bahia 4 A
    this.point = new Uint32Array([836, 750, 110, 18]);
    this.coordenada = new Coordenada('4', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 770, 110, 18]);
    this.coordenada = new Coordenada('4', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 790, 110, 18]);
    this.coordenada = new Coordenada('4', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 810, 110, 18]);
    this.coordenada = new Coordenada('4', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 830, 110, 18]);
    this.coordenada = new Coordenada('4', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia3N2() {
    this.point = new Uint32Array([711, 750, 110, 18]);
    this.coordenada = new Coordenada('3', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 770, 110, 18]);
    this.coordenada = new Coordenada('3', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 790, 110, 18]);
    this.coordenada = new Coordenada('3', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([711, 810, 110, 18]);
    this.coordenada = new Coordenada('3', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 830, 110, 18]);
    this.coordenada = new Coordenada('3', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // BAHIA 3 B

    this.point = new Uint32Array([599, 750, 110, 18]);
    this.coordenada = new Coordenada('3', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 770, 110, 18]);
    this.coordenada = new Coordenada('3', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 790, 110, 18]);
    this.coordenada = new Coordenada('3', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 810, 110, 18]);
    this.coordenada = new Coordenada('3', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 830, 110, 18]);
    this.coordenada = new Coordenada('3', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia2N2() {
    this.point = new Uint32Array([474, 750, 110, 18]);
    this.coordenada = new Coordenada('2', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 770, 110, 18]);
    this.coordenada = new Coordenada('2', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 790, 110, 18]);
    this.coordenada = new Coordenada('2', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 810, 110, 18]);
    this.coordenada = new Coordenada('2', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 830, 110, 18]);
    this.coordenada = new Coordenada('2', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    //BAHIA 2 B

    this.point = new Uint32Array([362, 750, 110, 18]);
    this.coordenada = new Coordenada('2', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 770, 110, 18]);
    this.coordenada = new Coordenada('2', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 790, 110, 18]);
    this.coordenada = new Coordenada('2', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 810, 110, 18]);
    this.coordenada = new Coordenada('2', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 830, 110, 18]);
    this.coordenada = new Coordenada('2', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia1N2() {
    this.point = new Uint32Array([237, 750, 110, 18]);
    this.coordenada = new Coordenada('1', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 770, 110, 18]);
    this.coordenada = new Coordenada('1', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 790, 110, 18]);
    this.coordenada = new Coordenada('1', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 810, 110, 18]);
    this.coordenada = new Coordenada('1', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 830, 110, 18]);
    this.coordenada = new Coordenada('1', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //BAHIA 1 B

    this.point = new Uint32Array([125, 750, 110, 18]);
    this.coordenada = new Coordenada('1', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 770, 110, 18]);
    this.coordenada = new Coordenada('1', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 790, 110, 18]);
    this.coordenada = new Coordenada('1', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 810, 110, 18]);
    this.coordenada = new Coordenada('1', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 830, 110, 18]);
    this.coordenada = new Coordenada('1', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia21N2() {
    //bahia 21 A
    this.point = new Uint32Array([0, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 21 B
    this.point = new Uint32Array([0, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia13N2() {
    //reim 13 A
    this.point = new Uint32Array([0, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 13 B 
    this.point = new Uint32Array([0, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia14N2() {
    this.point = new Uint32Array([0, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 14 B
    this.point = new Uint32Array([0, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia15N2() {
    this.point = new Uint32Array([0, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 15 B
    this.point = new Uint32Array([0, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia16N2() {
    this.ctx.rect(0, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(24, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(48, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(72, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(96, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }
  bahia17N2() {

    this.point = new Uint32Array([237, 245, 110, 18]);
    this.coordenada = new Coordenada('17 ', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 265, 110, 18]);
    this.coordenada = new Coordenada('17', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 285, 110, 18]);
    this.coordenada = new Coordenada('17', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 305, 110, 18]);
    this.coordenada = new Coordenada('17', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 325, 110, 18]);
    this.coordenada = new Coordenada('17', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([237, 345, 110, 18]);
    this.coordenada = new Coordenada('17', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 365, 110, 18]);
    this.coordenada = new Coordenada('17', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 385, 110, 18]);
    this.coordenada = new Coordenada('17', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 405, 110, 18]);
    this.coordenada = new Coordenada('17', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 425, 110, 18]);
    this.coordenada = new Coordenada('17', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([237, 445, 110, 18]);
    this.coordenada = new Coordenada('17', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 465, 110, 18]);
    this.coordenada = new Coordenada('17', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia18N2() {
    this.point = new Uint32Array([362, 245, 110, 18]);
    this.coordenada = new Coordenada('18', 'A2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 265, 110, 18]);
    this.coordenada = new Coordenada('18', 'B2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 285, 110, 18]);
    this.coordenada = new Coordenada('18', 'C2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 305, 110, 18]);
    this.coordenada = new Coordenada('18', 'D2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([362, 325, 110, 18]);
    this.coordenada = new Coordenada('18', 'E2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 345, 110, 18]);
    this.coordenada = new Coordenada('18', 'F2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 365, 110, 18]);
    this.coordenada = new Coordenada('18', 'G2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 385, 110, 18]);
    this.coordenada = new Coordenada('18', 'H2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 405, 110, 18]);
    this.coordenada = new Coordenada('18', 'I2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 425, 110, 18]);
    this.coordenada = new Coordenada('18', 'J2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 445, 110, 18]);
    this.coordenada = new Coordenada('18', 'K2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 465, 110, 18]);
    this.coordenada = new Coordenada('18', 'L2', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


  }

  bahiaLavadoOReparacionN2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(474, 245, 22, 55);
    this.ctx2.rect(498, 245, 22, 55);
    this.ctx2.rect(522, 245, 22, 55);

    this.ctx2.fillStyle = "green";
    this.ctx2.rect(546, 245, 22, 55);
    this.ctx2.rect(570, 245, 22, 55);

    //bahia 7 B
    this.ctx2.rect(474, 302, 22, 55);
    this.ctx2.rect(498, 302, 22, 55);
    this.ctx2.rect(522, 302, 22, 55);
    this.ctx2.rect(546, 302, 22, 55);
    this.ctx2.rect(570, 302, 22, 55);


    this.ctx2.fillStyle = "green";
    this.ctx2.rect(478, 360, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(478, 380, 110, 18);

    //reparacion 40


    this.ctx2.rect(474, 400, 22, 80);

    this.ctx2.rect(498, 400, 22, 80);

    this.ctx2.fillStyle = "black";
    this.ctx2.rect(522, 400, 22, 80);

    this.ctx2.fillStyle = "green";
    this.ctx2.rect(546, 400, 22, 80);

    this.ctx2.fillStyle = "black";
    this.ctx2.rect(570, 400, 22, 80);

    this.ctx2.fillStyle = "green";
    this.ctx2.rect(608, 378, 22, 80);

    this.ctx2.fillStyle = "black";
    this.ctx2.rect(608, 270, 22, 55);
    this.ctx2.stroke();
  }

  // =================== N I V E L  [ 3 ]====================================

  bahia12N3() {
    //Bahia 12 
    this.point = new Uint32Array([0, 0, 110, 18]);
    this.coordenada = new Coordenada('12', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([0, 20, 110, 18]);
    this.coordenada = new Coordenada('12', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 40, 110, 18]);
    this.coordenada = new Coordenada('12', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 60, 110, 18]);
    this.coordenada = new Coordenada('12', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([0, 80, 110, 18]);
    this.coordenada = new Coordenada('12', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia11N3() {
    this.point = new Uint32Array([125, 0, 110, 18]);
    this.coordenada = new Coordenada('11', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([125, 20, 110, 18]);
    this.coordenada = new Coordenada('11', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 40, 110, 18]);
    this.coordenada = new Coordenada('11', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 60, 110, 18]);
    this.coordenada = new Coordenada('11', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 80, 110, 18]);
    this.coordenada = new Coordenada('11', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    //bahia 11 B

    this.point = new Uint32Array([237, 0, 110, 18]);
    this.coordenada = new Coordenada('11', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 20, 110, 18]);
    this.coordenada = new Coordenada('11', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 40, 110, 18]);
    this.coordenada = new Coordenada('11', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 60, 110, 18]);
    this.coordenada = new Coordenada('11', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 80, 110, 18]);
    this.coordenada = new Coordenada('11', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }
  lineaN3() {
    this.ctx.beginPath();
    this.ctx.moveTo(356, 0);
    this.ctx.lineTo(356, 900);
    this.ctx.strokeStyle = "red";
    this.ctx.setLineDash([10, 10])
    this.ctx.lineWidth = 5;


  }
  bahia10N3() {
    //bahia 10 A
    this.point = new Uint32Array([362, 0, 110, 18]);
    this.coordenada = new Coordenada('10', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 20, 110, 18]);
    this.coordenada = new Coordenada('10', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 40, 110, 18]);
    this.coordenada = new Coordenada('10', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 60, 110, 18]);
    this.coordenada = new Coordenada('10', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 80, 110, 18]);
    this.coordenada = new Coordenada('10', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([474, 0, 110, 18]);
    this.coordenada = new Coordenada('10', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 20, 110, 18]);
    this.coordenada = new Coordenada('10', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 40, 110, 18]);
    this.coordenada = new Coordenada('10', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 60, 110, 18]);
    this.coordenada = new Coordenada('10', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 80, 110, 18]);
    this.coordenada = new Coordenada('10', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia9N3() {
    this.point = new Uint32Array([599, 0, 110, 18]);
    this.coordenada = new Coordenada('9', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 20, 110, 18]);
    this.coordenada = new Coordenada('9', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 40, 110, 18]);
    this.coordenada = new Coordenada('9', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 60, 110, 18]);
    this.coordenada = new Coordenada('9', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 80, 110, 18]);
    this.coordenada = new Coordenada('9', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


  }

  bahia8N3() {
    // bahia 8 A
    this.point = new Uint32Array([724, 0, 110, 18]);
    this.coordenada = new Coordenada('8', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 20, 110, 18]);
    this.coordenada = new Coordenada('8', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 40, 110, 18]);
    this.coordenada = new Coordenada('8', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 60, 110, 18]);
    this.coordenada = new Coordenada('8', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([724, 80, 110, 18]);
    this.coordenada = new Coordenada('8', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 8 b
    this.point = new Uint32Array([836, 0, 110, 18]);
    this.coordenada = new Coordenada('8', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 20, 110, 18]);
    this.coordenada = new Coordenada('8', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 40, 110, 18]);
    this.coordenada = new Coordenada('8', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 60, 110, 18]);
    this.coordenada = new Coordenada('8', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 80, 110, 18]);
    this.coordenada = new Coordenada('8', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia20N3() {
    //bahia 20 A
    this.point = new Uint32Array([836, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 120, 22, 55]);
    this.coordenada = new Coordenada('20', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    //bahia 20 b
    this.point = new Uint32Array([836, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 177, 22, 55]);
    this.coordenada = new Coordenada('20', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia7N3() {
    this.point = new Uint32Array([836, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 245, 22, 55]);
    this.coordenada = new Coordenada('7', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 7 B 
    this.point = new Uint32Array([836, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 302, 22, 55]);
    this.coordenada = new Coordenada('7', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia6N3() {
    this.point = new Uint32Array([836, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 370, 22, 55]);
    this.coordenada = new Coordenada('6', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 6 B
    this.point = new Uint32Array([836, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([932, 427, 22, 55]);
    this.coordenada = new Coordenada('6', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia5N3() {
    //bahia 5 A
    this.point = new Uint32Array([836, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 495, 22, 55]);
    this.coordenada = new Coordenada('5', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 5 B

    this.point = new Uint32Array([836, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 552, 22, 55]);
    this.coordenada = new Coordenada('5', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahia19N3() {
    //bahia 19 A
    this.point = new Uint32Array([836, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 620, 22, 55]);
    this.coordenada = new Coordenada('19', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    //bahia 19 B

    this.point = new Uint32Array([836, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([860, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([884, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([908, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([932, 677, 22, 55]);
    this.coordenada = new Coordenada('19', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia4N3() {
    //bahia 4 A
    this.point = new Uint32Array([836, 750, 110, 18]);
    this.coordenada = new Coordenada('4', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 770, 110, 18]);
    this.coordenada = new Coordenada('4', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 790, 110, 18]);
    this.coordenada = new Coordenada('4', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 810, 110, 18]);
    this.coordenada = new Coordenada('4', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([836, 830, 110, 18]);
    this.coordenada = new Coordenada('4', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia3N3() {
    this.point = new Uint32Array([711, 750, 110, 18]);
    this.coordenada = new Coordenada('3', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 770, 110, 18]);
    this.coordenada = new Coordenada('3', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 790, 110, 18]);
    this.coordenada = new Coordenada('3', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });


    this.point = new Uint32Array([711, 810, 110, 18]);
    this.coordenada = new Coordenada('3', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([711, 830, 110, 18]);
    this.coordenada = new Coordenada('3', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    // BAHIA 3 B

    this.point = new Uint32Array([599, 750, 110, 18]);
    this.coordenada = new Coordenada('3', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 770, 110, 18]);
    this.coordenada = new Coordenada('3', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 790, 110, 18]);
    this.coordenada = new Coordenada('3', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 810, 110, 18]);
    this.coordenada = new Coordenada('3', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([599, 830, 110, 18]);
    this.coordenada = new Coordenada('3', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia2N3() {
    this.point = new Uint32Array([474, 750, 110, 18]);
    this.coordenada = new Coordenada('2', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 770, 110, 18]);
    this.coordenada = new Coordenada('2', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 790, 110, 18]);
    this.coordenada = new Coordenada('2', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 810, 110, 18]);
    this.coordenada = new Coordenada('2', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([474, 830, 110, 18]);
    this.coordenada = new Coordenada('2', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    //BAHIA 2 B

    this.point = new Uint32Array([362, 750, 110, 18]);
    this.coordenada = new Coordenada('2', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 770, 110, 18]);
    this.coordenada = new Coordenada('2', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 790, 110, 18]);
    this.coordenada = new Coordenada('2', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 810, 110, 18]);
    this.coordenada = new Coordenada('2', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 830, 110, 18]);
    this.coordenada = new Coordenada('2', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia1N3() {
    this.point = new Uint32Array([237, 750, 110, 18]);
    this.coordenada = new Coordenada('1', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 770, 110, 18]);
    this.coordenada = new Coordenada('1', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 790, 110, 18]);
    this.coordenada = new Coordenada('1', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 810, 110, 18]);
    this.coordenada = new Coordenada('1', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 830, 110, 18]);
    this.coordenada = new Coordenada('1', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //BAHIA 1 B

    this.point = new Uint32Array([125, 750, 110, 18]);
    this.coordenada = new Coordenada('1', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 770, 110, 18]);
    this.coordenada = new Coordenada('1', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 790, 110, 18]);
    this.coordenada = new Coordenada('1', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 810, 110, 18]);
    this.coordenada = new Coordenada('1', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([125, 830, 110, 18]);
    this.coordenada = new Coordenada('1', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia21N3() {
    this.point = new Uint32Array([0, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 120, 22, 55]);
    this.coordenada = new Coordenada('21', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 21 B
    this.point = new Uint32Array([0, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 177, 22, 55]);
    this.coordenada = new Coordenada('21', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia13N3() {
    //reim 13 A
    this.point = new Uint32Array([0, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 245, 22, 55]);
    this.coordenada = new Coordenada('13', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 13 B 
    this.point = new Uint32Array([0, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 302, 22, 55]);
    this.coordenada = new Coordenada('13', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia14N3() {
    this.point = new Uint32Array([0, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 370, 22, 55]);
    this.coordenada = new Coordenada('14', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 14 B
    this.point = new Uint32Array([0, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 427, 22, 55]);
    this.coordenada = new Coordenada('14', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia15N3() {
    this.point = new Uint32Array([0, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 495, 22, 55]);
    this.coordenada = new Coordenada('15', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    //bahia 15 B
    this.point = new Uint32Array([0, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([24, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([48, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([72, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([96, 552, 22, 55]);
    this.coordenada = new Coordenada('15', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia16N3() {
    this.ctx.rect(0, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(24, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(48, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(72, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.ctx.rect(96, 620, 22, 55);
    this.coordenada = new Coordenada('16', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }
  bahia17N3() {
    this.point = new Uint32Array([237, 245, 110, 18]);
    this.coordenada = new Coordenada('17 ', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 265, 110, 18]);
    this.coordenada = new Coordenada('17', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 285, 110, 18]);
    this.coordenada = new Coordenada('17', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 305, 110, 18]);
    this.coordenada = new Coordenada('17', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 325, 110, 18]);
    this.coordenada = new Coordenada('17', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });



    this.point = new Uint32Array([237, 345, 110, 18]);
    this.coordenada = new Coordenada('17', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 365, 110, 18]);
    this.coordenada = new Coordenada('17', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 385, 110, 18]);
    this.coordenada = new Coordenada('17', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 405, 110, 18]);
    this.coordenada = new Coordenada('17', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 425, 110, 18]);
    this.coordenada = new Coordenada('17', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([237, 445, 110, 18]);
    this.coordenada = new Coordenada('17', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([237, 465, 110, 18]);
    this.coordenada = new Coordenada('17', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
  }

  bahia18N3() {
    this.point = new Uint32Array([362, 245, 110, 18]);
    this.coordenada = new Coordenada('18', 'A3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 265, 110, 18]);
    this.coordenada = new Coordenada('18', 'B3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 285, 110, 18]);
    this.coordenada = new Coordenada('18', 'C3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 305, 110, 18]);
    this.coordenada = new Coordenada('18', 'D3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });
    this.point = new Uint32Array([362, 325, 110, 18]);
    this.coordenada = new Coordenada('18', 'E3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 345, 110, 18]);
    this.coordenada = new Coordenada('18', 'F3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 365, 110, 18]);
    this.coordenada = new Coordenada('18', 'G3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 385, 110, 18]);
    this.coordenada = new Coordenada('18', 'H3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 405, 110, 18]);
    this.coordenada = new Coordenada('18', 'I3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 425, 110, 18]);
    this.coordenada = new Coordenada('18', 'J3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 445, 110, 18]);
    this.coordenada = new Coordenada('18', 'K3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

    this.point = new Uint32Array([362, 465, 110, 18]);
    this.coordenada = new Coordenada('18', 'L3', undefined, undefined, undefined)
    this.arrayClamped.push({ "point": this.point, "coordenada": this.coordenada });

  }

  bahiaLavadoOReparacionN3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(474, 245, 22, 55);
    this.ctx3.rect(498, 245, 22, 55);
    this.ctx3.rect(522, 245, 22, 55);

    this.ctx3.fillStyle = "green";
    this.ctx3.rect(546, 245, 22, 55);
    this.ctx3.rect(570, 245, 22, 55);

    //bahia 7 B
    this.ctx3.rect(474, 302, 22, 55);
    this.ctx3.rect(498, 302, 22, 55);
    this.ctx3.rect(522, 302, 22, 55);
    this.ctx3.rect(546, 302, 22, 55);
    this.ctx3.rect(570, 302, 22, 55);


    this.ctx3.fillStyle = "green";
    this.ctx3.rect(478, 360, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(478, 380, 110, 18);

    //reparacion 40

    this.ctx3.rect(474, 400, 22, 80);
    this.ctx3.rect(498, 400, 22, 80);
    this.ctx3.rect(522, 400, 22, 80);
    this.ctx3.rect(546, 400, 22, 80);
    this.ctx3.rect(570, 400, 22, 80);
    this.ctx3.rect(608, 378, 22, 80);
    this.ctx3.rect(608, 270, 22, 55);
    this.ctx3.stroke();
  }


  // METODOS

  drawContainers(array) {
    this.coordenadaService.getCoordenadas().subscribe(coordenada => {
      this.coordenadas = coordenada.coordenadas;

      array.forEach(c => {
        if (this.coordenadas) {
          this.coordenadas.forEach(coor => {
            if (coor.bahia == c.coordenada.bahia && coor.posicion == c.coordenada.posicion) {
              c.tipo = coor.tipo;
              c.maniobra = coor.maniobra;

              // Si tengo una maniobra en ese espacio
              if (c.maniobra) {
                    // Obtengo el tipo
                    var tipo = this.TryParseInt(c.maniobra.tipo.substring(0, 2), 0);
                    var ancho = 0;
                    if (tipo) {
                      // Calculo el ancho que voy a rellenar
                      ancho = c.tipo / tipo
                    }

                    //Contenedores 40
                    if (c.tipo === 40) {
                      if (c.tipo != tipo) {
                        this.ctx.beginPath()
                        this.ctx.fillStyle = 'green';
                        this.ctx.fillRect(c.x, c.y, 110 / ancho, 18);
                        this.ctx.stroke();
                      } else {
                        this.ctx.beginPath()
                        this.ctx.fillStyle = 'blue';
                        this.ctx.fillRect(c.x, c.y, 110, 18);
                        this.ctx.stroke();
                      }
                      //Contenedores 20
                    } else if (c.tipo === 20) {
                      {
                        this.ctx.beginPath()
                        this.ctx.fillStyle = 'green';
                        this.ctx.fillRect(c.x, c.y, 22, 55);
                        this.ctx.stroke();
                      }
                    }
                // });
              }
            }
          });
        }
      });

      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([0, 0])
      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      array.forEach(a => {
        //Pintar contornos de mapa

        //Contenedores 40
        if (a.tipo == 40) {
          this.ctx.rect(a.x, a.y, 110, 18);
          //Contenedores 20
        } else if (a.tipo == 20) {
          this.ctx.rect(a.x, a.y, 22, 55);
        }
      });
      this.ctx.stroke();
    });


    console.log(array)

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
}
