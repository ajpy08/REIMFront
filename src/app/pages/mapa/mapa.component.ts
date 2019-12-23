import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Maniobra } from 'src/app/models/maniobra.models';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Coordenada } from 'src/app/models/coordenada.models';

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

  constructor(private maniobraService: ManiobraService) { }

  ngOnInit(): void {
    // =================== N I V E L  [ 1 ]====================================
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.bahia12();
    this.bahia11();
    this.bahia10();
    this.bahia9();
    this.bahia8();
    this.gahia20();
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




    this.arrayClamped.forEach(point => {
      var json = {
        coordenada: this.coordenada,
        x: point[0],
        y: point[1],
        tipo: 40,
        maniobra: '5da4e1b095d2572f881fcfd6'
      };
      this.arrayJsons.push(json);
    });

    this.drawContainers(this.arrayJsons);
    console.log(this.arrayJsons)
  }

  // =================== N I V E L  [ 1 ]====================================
  bahia12() {
    //Bahia 12    

    this.point = new Uint8ClampedArray([0, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([0, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([0, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([0, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([0, 80, 110, 18]);
    this.arrayClamped.push(this.point);    
  }

  drawContainers(array) {
    let maniobra;
    array.forEach(c => {

      //Pintar contornos de mapa
      //Contenedores 40
      if (c.point === 40) {
        this.ctx.rect(c.x, c.y, 110, 18);
        //Contenedores 20
      } else if (c.point === 20) {
        this.ctx.rect(c.x, c.y, 22, 55);
      }

      // Si tengo una maniobra en ese espacio
      if (c.maniobra) {
        //Obtengo datos de maniobra
        this.maniobraService.getManiobra(c.maniobra).subscribe((maniobra) => {
          maniobra = maniobra.maniobra;

          //Si encontro alguna maniobra con ese id
          if (maniobra) {
            // Obtengo el tipo
            var tipo = this.TryParseInt(maniobra.tipo.substring(0, 2), 0);
            var ancho = 0;
            if (tipo) {
              // Calculo el ancho que voy a rellenar
              ancho = c.tipo / tipo
            }

            //Contenedores 40
            if (c.tipo === 40) {
              if (c.tipo != tipo) {

                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(c.x, c.y, 110 / ancho, 18);
              } else {
                this.ctx.fillRect(c.x, c.y, 110, 18);
              }
              this.ctx.strokeStyle = 'blue';
              //Contenedores 20
            } else if (c.tipo === 20) {
              {
                this.ctx.fillRect(c.x, c.y, 22, 55);
                this.ctx.fillStyle = 'red';
              }
            }
          }
        });
      }
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

  bahia11() {

    //bahia 11 A
    this.point = new Uint8ClampedArray([125, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([125, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([125, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([125, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([125, 80, 110, 18]);
    this.arrayClamped.push(this.point);

    //bahia 11 B

    this.point = new Uint8ClampedArray([237, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([237, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([237, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([237, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint8ClampedArray([237, 80, 110, 18]);
    this.arrayClamped.push(this.point);
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
    this.point = new Uint16Array([362, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([362, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([362, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([362, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([362, 80, 110, 18]);
    this.arrayClamped.push(this.point);

    this.point = new Uint16Array([474, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([474, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([474, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([474, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([474, 80, 110, 18]);
    this.arrayClamped.push(this.point);



    //bahia 10 B



  }

  bahia9() {

    this.point = new Uint16Array([599, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([599, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([599, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([599, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([599, 80, 110, 18]);
    this.arrayClamped.push(this.point);
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

    this.point = new Uint16Array([724, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([724, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([724, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([724, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([724, 80, 110, 18]);
    this.arrayClamped.push(this.point);
    // bahia 8 A
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "rgba(0,0,0,1)";


    // this.ctx.rect(724, 0, 110, 18);


    // this.ctx.rect(724, 20, 110, 18);


    // this.ctx.rect(724, 40, 110, 18);


    // this.ctx.rect(724, 60, 110, 18);


    // this.ctx.rect(724, 80, 110, 18);
    //bahia 8 b
    this.point = new Uint16Array([836, 0, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([836, 20, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([836, 40, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([836, 60, 110, 18]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([836, 80, 110, 18]);
    this.arrayClamped.push(this.point);

    // this.ctx.rect(836, 0, 110, 18);


    // this.ctx.rect(836, 20, 110, 18);


    // this.ctx.rect(836, 40, 110, 18);


    // this.ctx.rect(836, 60, 110, 18);


    // this.ctx.rect(836, 80, 110, 18);
  }

  gahia20() {

    this.point = new Uint16Array([836, 120, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([860, 120, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([884, 120, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([908, 120, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([932, 120, 22, 55]);
    this.arrayClamped.push(this.point);


    //bahia 20 A
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "rgba(0,0,0,1)";

    // this.ctx.rect(836, 120, 22, 55);

    // this.ctx.rect(860, 120, 22, 55);

    // this.ctx.rect(884, 120, 22, 55);

    // this.ctx.rect(908, 120, 22, 55);

    // this.ctx.rect(932, 120, 22, 55);

    //bahia 20 b

    this.point = new Uint16Array([836, 177, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([860, 177, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([884, 177, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([908, 177, 22, 55]);
    this.arrayClamped.push(this.point);
    this.point = new Uint16Array([932, 177, 22, 55]);
    this.arrayClamped.push(this.point);
    // this.ctx.rect(836, 177, 22, 55);

    // this.ctx.rect(860, 177, 22, 55);

    // this.ctx.rect(884, 177, 22, 55);

    // this.ctx.rect(908, 177, 22, 55);

    // this.ctx.rect(932, 177, 22, 55);

  }

  bahia7() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    //reim 7 A
    this.ctx.rect(836, 245, 22, 55);

    this.ctx.rect(860, 245, 22, 55);

    this.ctx.rect(884, 245, 22, 55);

    this.ctx.rect(908, 245, 22, 55);

    this.ctx.rect(932, 245, 22, 55);

    //bahia 7 B 
    this.ctx.rect(836, 302, 22, 55);

    this.ctx.rect(860, 302, 22, 55);

    this.ctx.rect(884, 302, 22, 55);

    this.ctx.rect(908, 302, 22, 55);

    this.ctx.rect(932, 302, 22, 55);

  }

  bahia6() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    //bahia 6 A
    this.ctx.rect(836, 370, 22, 55);

    this.ctx.rect(860, 370, 22, 55);

    this.ctx.rect(884, 370, 22, 55);

    this.ctx.rect(908, 370, 22, 55);

    this.ctx.rect(932, 370, 22, 55);

    //bahia 6 B
    this.ctx.rect(836, 427, 22, 55);
    this.ctx.rect(860, 427, 22, 55);
    this.ctx.rect(884, 427, 22, 55);
    this.ctx.rect(908, 427, 22, 55);
    this.ctx.rect(932, 427, 22, 55);
  }

  bahia5() {
    //bahia 4 A
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.fillStyle = "black";
    this.ctx.rect(836, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(860, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(884, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(908, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(932, 495, 22, 55);
    //bahia 4 B
    this.ctx.fillStyle = "black";
    this.ctx.rect(836, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(860, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(884, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(908, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.rect(932, 552, 22, 55);

  }

  bahia19() {
    //bahia 19 A
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(836, 620, 22, 55);
    this.ctx.rect(860, 620, 22, 55);
    this.ctx.rect(884, 620, 22, 55);
    this.ctx.rect(908, 620, 22, 55);
    this.ctx.rect(932, 620, 22, 55);
    //bahia 19 B

    this.ctx.rect(836, 677, 22, 55);
    this.ctx.rect(860, 677, 22, 55);
    this.ctx.rect(884, 677, 22, 55);
    this.ctx.rect(908, 677, 22, 55);
    this.ctx.rect(932, 677, 22, 55);
  }

  bahia4() {
    //bahia 4 A
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(836, 750, 110, 18);
    this.ctx.rect(836, 770, 110, 18);
    this.ctx.rect(836, 790, 110, 18);
    this.ctx.rect(836, 810, 110, 18);
    this.ctx.rect(836, 830, 110, 18);
  }

  bahia3() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";


    this.ctx.rect(711, 750, 110, 18);


    this.ctx.rect(711, 770, 110, 18);


    this.ctx.rect(711, 790, 110, 18);


    this.ctx.rect(711, 810, 110, 18);


    this.ctx.rect(711, 830, 110, 18);



    this.ctx.rect(599, 750, 110, 18);

    this.ctx.rect(599, 770, 110, 18);

    this.ctx.rect(599, 790, 110, 18);

    this.ctx.rect(599, 810, 110, 18);

    this.ctx.rect(599, 830, 110, 18);
  }

  bahia2() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(474, 750, 110, 18);

    this.ctx.rect(474, 770, 110, 18);

    this.ctx.rect(474, 790, 110, 18);

    this.ctx.rect(474, 810, 110, 18);

    this.ctx.rect(474, 830, 110, 18);


    this.ctx.rect(362, 750, 110, 18);
    this.ctx.rect(362, 770, 110, 18);
    this.ctx.rect(362, 790, 110, 18);
    this.ctx.rect(362, 810, 110, 18);
    this.ctx.rect(362, 830, 110, 18);
  }

  bahia1() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(237, 750, 110, 18);
    this.ctx.rect(237, 770, 110, 18);
    this.ctx.rect(237, 790, 110, 18);
    this.ctx.rect(237, 810, 110, 18);
    this.ctx.rect(237, 830, 110, 18);


    this.ctx.rect(125, 750, 110, 18);
    this.ctx.rect(125, 770, 110, 18);
    this.ctx.rect(125, 790, 110, 18);
    this.ctx.rect(125, 810, 110, 18);
    this.ctx.rect(125, 830, 110, 18);
  }

  bahia21() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    //bahia 21 A
    this.ctx.rect(0, 120, 22, 55);

    this.ctx.rect(24, 120, 22, 55);

    this.ctx.rect(48, 120, 22, 55);

    this.ctx.rect(72, 120, 22, 55);

    this.ctx.rect(96, 120, 22, 55);

    //bahia 21 b
    this.ctx.rect(0, 177, 22, 55);

    this.ctx.rect(24, 177, 22, 55);

    this.ctx.rect(48, 177, 22, 55);

    this.ctx.rect(72, 177, 22, 55);

    this.ctx.rect(96, 177, 22, 55);
  }

  bahia13() {
    //reim 13 A
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(0, 245, 22, 55);

    this.ctx.rect(24, 245, 22, 55);

    this.ctx.rect(48, 245, 22, 55);

    this.ctx.rect(72, 245, 22, 55);

    this.ctx.rect(96, 245, 22, 55);

    //bahia 13 B 
    this.ctx.rect(0, 302, 22, 55);

    this.ctx.rect(24, 302, 22, 55);

    this.ctx.rect(48, 302, 22, 55);

    this.ctx.rect(72, 302, 22, 55);

    this.ctx.rect(96, 302, 22, 55);
  }

  bahia14() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(0, 370, 22, 55);

    this.ctx.rect(24, 370, 22, 55);

    this.ctx.rect(48, 370, 22, 55);

    this.ctx.rect(72, 370, 22, 55);

    this.ctx.rect(96, 370, 22, 55);

    //bahia 14 B
    this.ctx.rect(0, 427, 22, 55);
    this.ctx.rect(24, 427, 22, 55);
    this.ctx.rect(48, 427, 22, 55);
    this.ctx.rect(72, 427, 22, 55);
    this.ctx.rect(96, 427, 22, 55);
  }

  bahia15() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    //bahia 15 A
    this.ctx.rect(0, 495, 22, 55);
    this.ctx.rect(24, 495, 22, 55);
    this.ctx.rect(48, 495, 22, 55);
    this.ctx.rect(72, 495, 22, 55);
    this.ctx.rect(96, 495, 22, 55);
    //bahia 15 B
    this.ctx.rect(0, 552, 22, 55);
    this.ctx.rect(24, 552, 22, 55);
    this.ctx.rect(48, 552, 22, 55);
    this.ctx.rect(72, 552, 22, 55);
    this.ctx.rect(96, 552, 22, 55);
  }

  bahia16() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(0, 620, 22, 55);
    this.ctx.rect(24, 620, 22, 55);
    this.ctx.rect(48, 620, 22, 55);
    this.ctx.rect(72, 620, 22, 55);
    this.ctx.rect(96, 620, 22, 55);
  }
  bahia17() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(237, 245, 110, 18);


    this.ctx.rect(237, 265, 110, 18);

    this.ctx.rect(237, 285, 110, 18);

    this.ctx.rect(237, 305, 110, 18);

    this.ctx.rect(237, 325, 110, 18);
    this.ctx.rect(237, 345, 110, 18);
    this.ctx.rect(237, 365, 110, 18);
    this.ctx.rect(237, 385, 110, 18);
    this.ctx.rect(237, 405, 110, 18);
    this.ctx.rect(237, 425, 110, 18);
    this.ctx.rect(237, 445, 110, 18);
    this.ctx.rect(237, 465, 110, 18);
  }

  bahia18() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(362, 245, 110, 18);

    this.ctx.rect(362, 265, 110, 18);

    this.ctx.rect(362, 285, 110, 18);

    this.ctx.rect(362, 305, 110, 18)
    this.ctx.rect(362, 325, 110, 18);

    this.ctx.rect(362, 345, 110, 18);

    this.ctx.rect(362, 365, 110, 18);

    this.ctx.rect(362, 385, 110, 18);

    this.ctx.rect(362, 405, 110, 18);

    this.ctx.rect(362, 425, 110, 18);
    this.ctx.rect(362, 445, 110, 18);
    this.ctx.rect(362, 465, 110, 18);

  }

  bahiaLavadoOReparacion() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";

    this.ctx.rect(474, 245, 22, 55);
    this.ctx.rect(498, 245, 22, 55);
    this.ctx.rect(522, 245, 22, 55);

    this.ctx.fillStyle = "green";
    this.ctx.rect(546, 245, 22, 55);
    this.ctx.rect(570, 245, 22, 55);

    //bahia 7 B
    this.ctx.rect(474, 302, 22, 55);
    this.ctx.rect(498, 302, 22, 55);
    this.ctx.rect(522, 302, 22, 55);
    this.ctx.rect(546, 302, 22, 55);
    this.ctx.rect(570, 302, 22, 55);


    this.ctx.fillStyle = "green";
    this.ctx.rect(478, 360, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.rect(478, 380, 110, 18);

    //reparacion 40


    this.ctx.rect(474, 400, 22, 80);

    this.ctx.rect(498, 400, 22, 80);

    this.ctx.fillStyle = "black";
    this.ctx.rect(522, 400, 22, 80);

    this.ctx.fillStyle = "green";
    this.ctx.rect(546, 400, 22, 80);

    this.ctx.fillStyle = "black";
    this.ctx.rect(570, 400, 22, 80);

    this.ctx.fillStyle = "green";
    this.ctx.rect(608, 378, 22, 80);

    this.ctx.fillStyle = "black";
    this.ctx.rect(608, 270, 22, 55);
    this.ctx.stroke();
  }


  // =================== N I V E L  [ 2 ]====================================

  bahia12N2() {
    //Bahia 12 

    this.ctx2.strokeStyle = "black";
    this.ctx2.stroke();
    this.ctx2.rect(0, 0, 110, 18);
    this.ctx2.rect(0, 20, 110, 18);
    this.ctx2.rect(0, 40, 110, 18);
    this.ctx2.rect(0, 60, 110, 18);
    this.ctx2.rect(0, 80, 110, 18);

  }

  bahia11N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    //bahia 11 A
    this.ctx2.rect(125, 0, 110, 18);

    this.ctx2.rect(125, 20, 110, 18);

    this.ctx2.rect(125, 40, 110, 18);

    this.ctx2.rect(125, 60, 110, 18);

    this.ctx2.rect(125, 80, 110, 18);

    //bahia 11 B

    this.ctx2.rect(237, 0, 110, 18);

    this.ctx2.rect(237, 20, 110, 18);

    this.ctx2.rect(237, 40, 110, 18);

    this.ctx2.rect(237, 60, 110, 18);

    this.ctx2.rect(237, 80, 110, 18);
  }

  lineaN2() {
    this.ctx2.beginPath();
    this.ctx2.moveTo(356, 0);
    this.ctx2.lineTo(356, 900);
    this.ctx2.strokeStyle = "red";
    this.ctx2.setLineDash([10, 10])
    this.ctx2.lineWidth = 5;
    this.ctx2.stroke();

  }
  bahia10N2() {
    //bahia 10 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(362, 0, 110, 18);

    this.ctx2.rect(362, 20, 110, 18);

    this.ctx2.rect(362, 40, 110, 18);

    this.ctx2.rect(362, 60, 110, 18);

    this.ctx2.rect(362, 80, 110, 18);

    //bahia 10 B

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(474, 0, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(474, 20, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(474, 40, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(474, 60, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(474, 80, 110, 18);

  }

  bahia9N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";
    this.ctx2.fillStyle = "red";

    this.ctx2.rect(599, 0, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(599, 20, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(599, 40, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(599, 60, 110, 18);

    this.ctx2.fillStyle = "red";
    this.ctx2.rect(599, 80, 110, 18);
  }

  bahia8N2() {
    // bahia 8 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";


    this.ctx2.rect(724, 0, 110, 18);


    this.ctx2.rect(724, 20, 110, 18);


    this.ctx2.rect(724, 40, 110, 18);


    this.ctx2.rect(724, 60, 110, 18);


    this.ctx2.rect(724, 80, 110, 18);
    //bahia 8 b


    this.ctx2.rect(836, 0, 110, 18);


    this.ctx2.rect(836, 20, 110, 18);


    this.ctx2.rect(836, 40, 110, 18);


    this.ctx2.rect(836, 60, 110, 18);


    this.ctx2.rect(836, 80, 110, 18);
  }

  bahia20N2() {
    //bahia 20 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(836, 120, 22, 55);

    this.ctx2.rect(860, 120, 22, 55);

    this.ctx2.rect(884, 120, 22, 55);

    this.ctx2.rect(908, 120, 22, 55);

    this.ctx2.rect(932, 120, 22, 55);

    //bahia 20 b
    this.ctx2.rect(836, 177, 22, 55);

    this.ctx2.rect(860, 177, 22, 55);

    this.ctx2.rect(884, 177, 22, 55);

    this.ctx2.rect(908, 177, 22, 55);

    this.ctx2.rect(932, 177, 22, 55);

  }

  bahia7N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    //reim 7 A
    this.ctx2.rect(836, 245, 22, 55);

    this.ctx2.rect(860, 245, 22, 55);

    this.ctx2.rect(884, 245, 22, 55);

    this.ctx2.rect(908, 245, 22, 55);

    this.ctx2.rect(932, 245, 22, 55);

    //bahia 7 B 
    this.ctx2.rect(836, 302, 22, 55);

    this.ctx2.rect(860, 302, 22, 55);

    this.ctx2.rect(884, 302, 22, 55);

    this.ctx2.rect(908, 302, 22, 55);

    this.ctx2.rect(932, 302, 22, 55);

  }

  bahia6N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";
    //bahia 6 A
    this.ctx2.rect(836, 370, 22, 55);

    this.ctx2.rect(860, 370, 22, 55);

    this.ctx2.rect(884, 370, 22, 55);

    this.ctx2.rect(908, 370, 22, 55);

    this.ctx2.rect(932, 370, 22, 55);

    //bahia 6 B
    this.ctx2.rect(836, 427, 22, 55);
    this.ctx2.rect(860, 427, 22, 55);
    this.ctx2.rect(884, 427, 22, 55);
    this.ctx2.rect(908, 427, 22, 55);
    this.ctx2.rect(932, 427, 22, 55);
  }

  bahia5N2() {
    //bahia 4 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.fillStyle = "black";
    this.ctx2.rect(836, 495, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(860, 495, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(884, 495, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(908, 495, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(932, 495, 22, 55);
    //bahia 4 B
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(836, 552, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(860, 552, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(884, 552, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(908, 552, 22, 55);
    this.ctx2.fillStyle = "black";
    this.ctx2.rect(932, 552, 22, 55);

  }

  bahia19N2() {
    //bahia 19 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(836, 620, 22, 55);
    this.ctx2.rect(860, 620, 22, 55);
    this.ctx2.rect(884, 620, 22, 55);
    this.ctx2.rect(908, 620, 22, 55);
    this.ctx2.rect(932, 620, 22, 55);
    //bahia 19 B

    this.ctx2.rect(836, 677, 22, 55);
    this.ctx2.rect(860, 677, 22, 55);
    this.ctx2.rect(884, 677, 22, 55);
    this.ctx2.rect(908, 677, 22, 55);
    this.ctx2.rect(932, 677, 22, 55);
  }

  bahia4N2() {
    //bahia 4 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(836, 750, 110, 18);
    this.ctx2.rect(836, 770, 110, 18);
    this.ctx2.rect(836, 790, 110, 18);
    this.ctx2.rect(836, 810, 110, 18);
    this.ctx2.rect(836, 830, 110, 18);
  }

  bahia3N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";


    this.ctx2.rect(711, 750, 110, 18);


    this.ctx2.rect(711, 770, 110, 18);


    this.ctx2.rect(711, 790, 110, 18);


    this.ctx2.rect(711, 810, 110, 18);


    this.ctx2.rect(711, 830, 110, 18);



    this.ctx2.rect(599, 750, 110, 18);

    this.ctx2.rect(599, 770, 110, 18);

    this.ctx2.rect(599, 790, 110, 18);

    this.ctx2.rect(599, 810, 110, 18);

    this.ctx2.rect(599, 830, 110, 18);
  }

  bahia2N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(474, 750, 110, 18);

    this.ctx2.rect(474, 770, 110, 18);

    this.ctx2.rect(474, 790, 110, 18);

    this.ctx2.rect(474, 810, 110, 18);

    this.ctx2.rect(474, 830, 110, 18);


    this.ctx2.rect(362, 750, 110, 18);
    this.ctx2.rect(362, 770, 110, 18);
    this.ctx2.rect(362, 790, 110, 18);
    this.ctx2.rect(362, 810, 110, 18);
    this.ctx2.rect(362, 830, 110, 18);
  }

  bahia1N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(237, 750, 110, 18);
    this.ctx2.rect(237, 770, 110, 18);
    this.ctx2.rect(237, 790, 110, 18);
    this.ctx2.rect(237, 810, 110, 18);
    this.ctx2.rect(237, 830, 110, 18);


    this.ctx2.rect(125, 750, 110, 18);
    this.ctx2.rect(125, 770, 110, 18);
    this.ctx2.rect(125, 790, 110, 18);
    this.ctx2.rect(125, 810, 110, 18);
    this.ctx2.rect(125, 830, 110, 18);
  }

  bahia21N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    //bahia 21 A
    this.ctx2.rect(0, 120, 22, 55);

    this.ctx2.rect(24, 120, 22, 55);

    this.ctx2.rect(48, 120, 22, 55);

    this.ctx2.rect(72, 120, 22, 55);

    this.ctx2.rect(96, 120, 22, 55);

    //bahia 21 b
    this.ctx2.rect(0, 177, 22, 55);

    this.ctx2.rect(24, 177, 22, 55);

    this.ctx2.rect(48, 177, 22, 55);

    this.ctx2.rect(72, 177, 22, 55);

    this.ctx2.rect(96, 177, 22, 55);
  }

  bahia13N2() {
    //reim 13 A
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(0, 245, 22, 55);

    this.ctx2.rect(24, 245, 22, 55);

    this.ctx2.rect(48, 245, 22, 55);

    this.ctx2.rect(72, 245, 22, 55);

    this.ctx2.rect(96, 245, 22, 55);

    //bahia 13 B 
    this.ctx2.rect(0, 302, 22, 55);

    this.ctx2.rect(24, 302, 22, 55);

    this.ctx2.rect(48, 302, 22, 55);

    this.ctx2.rect(72, 302, 22, 55);

    this.ctx2.rect(96, 302, 22, 55);
  }

  bahia14N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(0, 370, 22, 55);

    this.ctx2.rect(24, 370, 22, 55);

    this.ctx2.rect(48, 370, 22, 55);

    this.ctx2.rect(72, 370, 22, 55);

    this.ctx2.rect(96, 370, 22, 55);

    //bahia 14 B
    this.ctx2.rect(0, 427, 22, 55);
    this.ctx2.rect(24, 427, 22, 55);
    this.ctx2.rect(48, 427, 22, 55);
    this.ctx2.rect(72, 427, 22, 55);
    this.ctx2.rect(96, 427, 22, 55);
  }

  bahia15N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    //bahia 15 A
    this.ctx2.rect(0, 495, 22, 55);
    this.ctx2.rect(24, 495, 22, 55);
    this.ctx2.rect(48, 495, 22, 55);
    this.ctx2.rect(72, 495, 22, 55);
    this.ctx2.rect(96, 495, 22, 55);
    //bahia 15 B
    this.ctx2.rect(0, 552, 22, 55);
    this.ctx2.rect(24, 552, 22, 55);
    this.ctx2.rect(48, 552, 22, 55);
    this.ctx2.rect(72, 552, 22, 55);
    this.ctx2.rect(96, 552, 22, 55);
  }

  bahia16N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(0, 620, 22, 55);
    this.ctx2.rect(24, 620, 22, 55);
    this.ctx2.rect(48, 620, 22, 55);
    this.ctx2.rect(72, 620, 22, 55);
    this.ctx2.rect(96, 620, 22, 55);
  }
  bahia17N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(237, 245, 110, 18);


    this.ctx2.rect(237, 265, 110, 18);

    this.ctx2.rect(237, 285, 110, 18);

    this.ctx2.rect(237, 305, 110, 18);

    this.ctx2.rect(237, 325, 110, 18);
    this.ctx2.rect(237, 345, 110, 18);
    this.ctx2.rect(237, 365, 110, 18);
    this.ctx2.rect(237, 385, 110, 18);
    this.ctx2.rect(237, 405, 110, 18);
    this.ctx2.rect(237, 425, 110, 18);
    this.ctx2.rect(237, 445, 110, 18);
    this.ctx2.rect(237, 465, 110, 18);
  }

  bahia18N2() {
    this.ctx2.lineWidth = 1;
    this.ctx2.strokeStyle = "rgba(0,0,0,1)";

    this.ctx2.rect(362, 245, 110, 18);

    this.ctx2.rect(362, 265, 110, 18);

    this.ctx2.rect(362, 285, 110, 18);

    this.ctx2.rect(362, 305, 110, 18)
    this.ctx2.rect(362, 325, 110, 18);

    this.ctx2.rect(362, 345, 110, 18);

    this.ctx2.rect(362, 365, 110, 18);

    this.ctx2.rect(362, 385, 110, 18);

    this.ctx2.rect(362, 405, 110, 18);

    this.ctx2.rect(362, 425, 110, 18);
    this.ctx2.rect(362, 445, 110, 18);
    this.ctx2.rect(362, 465, 110, 18);

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

    this.ctx3.strokeStyle = "black";
    this.ctx3.stroke();
    this.ctx3.rect(0, 0, 110, 18);
    this.ctx3.rect(0, 20, 110, 18);
    this.ctx3.rect(0, 40, 110, 18);
    this.ctx3.rect(0, 60, 110, 18);
    this.ctx3.rect(0, 80, 110, 18);
  }

  bahia11N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    //bahia 11 A
    this.ctx3.rect(125, 0, 110, 18);

    this.ctx3.rect(125, 20, 110, 18);

    this.ctx3.rect(125, 40, 110, 18);

    this.ctx3.rect(125, 60, 110, 18);

    this.ctx3.rect(125, 80, 110, 18);

    //bahia 11 B

    this.ctx3.rect(237, 0, 110, 18);

    this.ctx3.rect(237, 20, 110, 18);

    this.ctx3.rect(237, 40, 110, 18);

    this.ctx3.rect(237, 60, 110, 18);

    this.ctx3.rect(237, 80, 110, 18);
  }
  lineaN3() {
    this.ctx3.beginPath();
    this.ctx3.moveTo(356, 0);
    this.ctx3.lineTo(356, 900);
    this.ctx3.strokeStyle = "red";
    this.ctx3.setLineDash([10, 10])
    this.ctx3.lineWidth = 5;
    this.ctx3.stroke();

  }
  bahia10N3() {
    //bahia 10 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(362, 0, 110, 18);

    this.ctx3.rect(362, 20, 110, 18);

    this.ctx3.rect(362, 40, 110, 18);

    this.ctx3.rect(362, 60, 110, 18);

    this.ctx3.rect(362, 80, 110, 18);

    //bahia 10 B

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(474, 0, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(474, 20, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(474, 40, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(474, 60, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(474, 80, 110, 18);

  }

  bahia9N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";
    this.ctx3.fillStyle = "red";

    this.ctx3.rect(599, 0, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(599, 20, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(599, 40, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(599, 60, 110, 18);

    this.ctx3.fillStyle = "red";
    this.ctx3.rect(599, 80, 110, 18);
  }

  bahia8N3() {
    // bahia 8 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";


    this.ctx3.rect(724, 0, 110, 18);


    this.ctx3.rect(724, 20, 110, 18);


    this.ctx3.rect(724, 40, 110, 18);


    this.ctx3.rect(724, 60, 110, 18);


    this.ctx3.rect(724, 80, 110, 18);
    //bahia 8 b


    this.ctx3.rect(836, 0, 110, 18);


    this.ctx3.rect(836, 20, 110, 18);


    this.ctx3.rect(836, 40, 110, 18);


    this.ctx3.rect(836, 60, 110, 18);


    this.ctx3.rect(836, 80, 110, 18);
  }

  bahia20N3() {
    //bahia 20 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(836, 120, 22, 55);

    this.ctx3.rect(860, 120, 22, 55);

    this.ctx3.rect(884, 120, 22, 55);

    this.ctx3.rect(908, 120, 22, 55);

    this.ctx3.rect(932, 120, 22, 55);

    //bahia 20 b
    this.ctx3.rect(836, 177, 22, 55);

    this.ctx3.rect(860, 177, 22, 55);

    this.ctx3.rect(884, 177, 22, 55);

    this.ctx3.rect(908, 177, 22, 55);

    this.ctx3.rect(932, 177, 22, 55);

  }

  bahia7N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    //reim 7 A
    this.ctx3.rect(836, 245, 22, 55);

    this.ctx3.rect(860, 245, 22, 55);

    this.ctx3.rect(884, 245, 22, 55);

    this.ctx3.rect(908, 245, 22, 55);

    this.ctx3.rect(932, 245, 22, 55);

    //bahia 7 B 
    this.ctx3.rect(836, 302, 22, 55);

    this.ctx3.rect(860, 302, 22, 55);

    this.ctx3.rect(884, 302, 22, 55);

    this.ctx3.rect(908, 302, 22, 55);

    this.ctx3.rect(932, 302, 22, 55);

  }

  bahia6N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";
    //bahia 6 A
    this.ctx3.rect(836, 370, 22, 55);

    this.ctx3.rect(860, 370, 22, 55);

    this.ctx3.rect(884, 370, 22, 55);

    this.ctx3.rect(908, 370, 22, 55);

    this.ctx3.rect(932, 370, 22, 55);

    //bahia 6 B
    this.ctx3.rect(836, 427, 22, 55);
    this.ctx3.rect(860, 427, 22, 55);
    this.ctx3.rect(884, 427, 22, 55);
    this.ctx3.rect(908, 427, 22, 55);
    this.ctx3.rect(932, 427, 22, 55);
  }

  bahia5N3() {
    //bahia 4 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.fillStyle = "black";
    this.ctx3.rect(836, 495, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(860, 495, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(884, 495, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(908, 495, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(932, 495, 22, 55);
    //bahia 4 B
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(836, 552, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(860, 552, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(884, 552, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(908, 552, 22, 55);
    this.ctx3.fillStyle = "black";
    this.ctx3.rect(932, 552, 22, 55);

  }

  bahia19N3() {
    //bahia 19 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(836, 620, 22, 55);
    this.ctx3.rect(860, 620, 22, 55);
    this.ctx3.rect(884, 620, 22, 55);
    this.ctx3.rect(908, 620, 22, 55);
    this.ctx3.rect(932, 620, 22, 55);
    //bahia 19 B

    this.ctx3.rect(836, 677, 22, 55);
    this.ctx3.rect(860, 677, 22, 55);
    this.ctx3.rect(884, 677, 22, 55);
    this.ctx3.rect(908, 677, 22, 55);
    this.ctx3.rect(932, 677, 22, 55);
  }

  bahia4N3() {
    //bahia 4 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(836, 750, 110, 18);
    this.ctx3.rect(836, 770, 110, 18);
    this.ctx3.rect(836, 790, 110, 18);
    this.ctx3.rect(836, 810, 110, 18);
    this.ctx3.rect(836, 830, 110, 18);
  }

  bahia3N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";


    this.ctx3.rect(711, 750, 110, 18);


    this.ctx3.rect(711, 770, 110, 18);


    this.ctx3.rect(711, 790, 110, 18);


    this.ctx3.rect(711, 810, 110, 18);


    this.ctx3.rect(711, 830, 110, 18);



    this.ctx3.rect(599, 750, 110, 18);

    this.ctx3.rect(599, 770, 110, 18);

    this.ctx3.rect(599, 790, 110, 18);

    this.ctx3.rect(599, 810, 110, 18);

    this.ctx3.rect(599, 830, 110, 18);
  }

  bahia2N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(474, 750, 110, 18);

    this.ctx3.rect(474, 770, 110, 18);

    this.ctx3.rect(474, 790, 110, 18);

    this.ctx3.rect(474, 810, 110, 18);

    this.ctx3.rect(474, 830, 110, 18);


    this.ctx3.rect(362, 750, 110, 18);
    this.ctx3.rect(362, 770, 110, 18);
    this.ctx3.rect(362, 790, 110, 18);
    this.ctx3.rect(362, 810, 110, 18);
    this.ctx3.rect(362, 830, 110, 18);
  }

  bahia1N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(237, 750, 110, 18);
    this.ctx3.rect(237, 770, 110, 18);
    this.ctx3.rect(237, 790, 110, 18);
    this.ctx3.rect(237, 810, 110, 18);
    this.ctx3.rect(237, 830, 110, 18);


    this.ctx3.rect(125, 750, 110, 18);
    this.ctx3.rect(125, 770, 110, 18);
    this.ctx3.rect(125, 790, 110, 18);
    this.ctx3.rect(125, 810, 110, 18);
    this.ctx3.rect(125, 830, 110, 18);
  }

  bahia21N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    //bahia 21 A
    this.ctx3.rect(0, 120, 22, 55);

    this.ctx3.rect(24, 120, 22, 55);

    this.ctx3.rect(48, 120, 22, 55);

    this.ctx3.rect(72, 120, 22, 55);

    this.ctx3.rect(96, 120, 22, 55);

    //bahia 21 b
    this.ctx3.rect(0, 177, 22, 55);

    this.ctx3.rect(24, 177, 22, 55);

    this.ctx3.rect(48, 177, 22, 55);

    this.ctx3.rect(72, 177, 22, 55);

    this.ctx3.rect(96, 177, 22, 55);
  }

  bahia13N3() {
    //reim 13 A
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(0, 245, 22, 55);

    this.ctx3.rect(24, 245, 22, 55);

    this.ctx3.rect(48, 245, 22, 55);

    this.ctx3.rect(72, 245, 22, 55);

    this.ctx3.rect(96, 245, 22, 55);

    //bahia 13 B 
    this.ctx3.rect(0, 302, 22, 55);

    this.ctx3.rect(24, 302, 22, 55);

    this.ctx3.rect(48, 302, 22, 55);

    this.ctx3.rect(72, 302, 22, 55);

    this.ctx3.rect(96, 302, 22, 55);
  }

  bahia14N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(0, 370, 22, 55);

    this.ctx3.rect(24, 370, 22, 55);

    this.ctx3.rect(48, 370, 22, 55);

    this.ctx3.rect(72, 370, 22, 55);

    this.ctx3.rect(96, 370, 22, 55);

    //bahia 14 B
    this.ctx3.rect(0, 427, 22, 55);
    this.ctx3.rect(24, 427, 22, 55);
    this.ctx3.rect(48, 427, 22, 55);
    this.ctx3.rect(72, 427, 22, 55);
    this.ctx3.rect(96, 427, 22, 55);
  }

  bahia15N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    //bahia 15 A
    this.ctx3.rect(0, 495, 22, 55);
    this.ctx3.rect(24, 495, 22, 55);
    this.ctx3.rect(48, 495, 22, 55);
    this.ctx3.rect(72, 495, 22, 55);
    this.ctx3.rect(96, 495, 22, 55);
    //bahia 15 B
    this.ctx3.rect(0, 552, 22, 55);
    this.ctx3.rect(24, 552, 22, 55);
    this.ctx3.rect(48, 552, 22, 55);
    this.ctx3.rect(72, 552, 22, 55);
    this.ctx3.rect(96, 552, 22, 55);
  }

  bahia16N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(0, 620, 22, 55);
    this.ctx3.rect(24, 620, 22, 55);
    this.ctx3.rect(48, 620, 22, 55);
    this.ctx3.rect(72, 620, 22, 55);
    this.ctx3.rect(96, 620, 22, 55);
  }
  bahia17N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(237, 245, 110, 18);


    this.ctx3.rect(237, 265, 110, 18);

    this.ctx3.rect(237, 285, 110, 18);

    this.ctx3.rect(237, 305, 110, 18);

    this.ctx3.rect(237, 325, 110, 18);
    this.ctx3.rect(237, 345, 110, 18);
    this.ctx3.rect(237, 365, 110, 18);
    this.ctx3.rect(237, 385, 110, 18);
    this.ctx3.rect(237, 405, 110, 18);
    this.ctx3.rect(237, 425, 110, 18);
    this.ctx3.rect(237, 445, 110, 18);
    this.ctx3.rect(237, 465, 110, 18);
  }

  bahia18N3() {
    this.ctx3.lineWidth = 1;
    this.ctx3.strokeStyle = "rgba(0,0,0,1)";

    this.ctx3.rect(362, 245, 110, 18);

    this.ctx3.rect(362, 265, 110, 18);

    this.ctx3.rect(362, 285, 110, 18);

    this.ctx3.rect(362, 305, 110, 18)
    this.ctx3.rect(362, 325, 110, 18);

    this.ctx3.rect(362, 345, 110, 18);

    this.ctx3.rect(362, 365, 110, 18);

    this.ctx3.rect(362, 385, 110, 18);

    this.ctx3.rect(362, 405, 110, 18);

    this.ctx3.rect(362, 425, 110, 18);
    this.ctx3.rect(362, 445, 110, 18);
    this.ctx3.rect(362, 465, 110, 18);

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

    this.ctx3.fillStyle = "black";
    this.ctx3.rect(522, 400, 22, 80);

    this.ctx3.fillStyle = "green";
    this.ctx3.rect(546, 400, 22, 80);

    this.ctx3.fillStyle = "black";
    this.ctx3.rect(570, 400, 22, 80);

    this.ctx3.fillStyle = "green";
    this.ctx3.rect(608, 378, 22, 80);

    this.ctx3.fillStyle = "black";
    this.ctx3.rect(608, 270, 22, 55);
    this.ctx3.stroke();
  }
}
