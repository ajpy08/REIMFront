import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
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
  }

  // =================== N I V E L  [ 1 ]====================================
  bahia12(): void {
    //Bahia 12 
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 80, 110, 18);
  }

  bahia11(): void {
    //bahia 11 A
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 80, 110,18);

    //bahia 11 B

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 80, 110, 18);
  }

  bahia10() {
    //bahia 10 A
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 80, 110, 18);

    //bahia 10 B

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 80, 110, 18);

  }

  bahia9() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 80, 110, 18);
  }

  bahia8() {
    // bahia 8 A
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(724, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(724, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(724, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(724, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(724, 80, 110, 18);
    //bahia 8 b

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 0, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 20, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 40, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 60, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 80, 110, 18);
  }

  gahia20() {
    //bahia 20 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 120, 22, 55);

    //bahia 20 b
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 177, 22, 55);

  }

  bahia7() {

    //reim 7 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 245, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 245, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 245, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 245, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 245, 22, 55);

    //bahia 7 B 
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 302, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 302, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 302, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 302, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 302, 22, 55);

  }

  bahia6() {
    //bahia 6 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 370, 22, 55);

    //bahia 6 B
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 427, 22, 55);
  }

  bahia5() {
    //bahia 4 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 495, 22, 55);
    //bahia 4 B
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 552, 22, 55);

  }

  bahia19() {
    //bahia 19 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 620, 22, 55);
    //bahia 19 B

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(836, 677, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(860, 677, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(884, 677, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(908, 677, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(932, 677, 22, 55);
  }

  bahia4() {
    //bahia 4 A
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 750, 110, 18);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(836, 770, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 790, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 810, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(836, 830, 110, 18);
  }

  bahia3() {

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(711, 750, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(711, 770, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(711, 790, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(711, 810, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(711, 830, 110, 18);


    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 750, 110, 18)
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 770, 110, 18)
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 790, 110, 18)
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 810, 110, 18)
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(599, 830, 110, 18)
  }

  bahia2() {

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 750, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 770, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 790, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 810, 110, 18);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(474, 830, 110, 18);


    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 750, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 770, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 790, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 810, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(362, 830, 110, 18);
  }

  bahia1() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 750, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 770, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 790, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 810, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(237, 830, 110, 18);


    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 750, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 770, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 790, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 810, 110, 18);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(125, 830, 110, 18);
  }

  bahia21(){
    //bahia 21 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 120, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 120, 22, 55);

    //bahia 21 b
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 177, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 177, 22, 55);
  }

  bahia13() {
        //reim 13 A
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 245, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(24, 245, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(48, 245, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(72, 245, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(96, 245, 22, 55);
    
        //bahia 13 B 
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 302, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(24, 302, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(48, 302, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(72, 302, 22, 55);
    
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(96, 302, 22, 55);
  }

  bahia14(){
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 370, 22, 55);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 370, 22, 55);

    //bahia 14 B
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 427, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 427, 22, 55);
  }

  bahia15() {
    //bahia 15 A
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 495, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 495, 22, 55);
    //bahia 15 B
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 552, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 552, 22, 55);
  }

  bahia16(){
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(24, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(48, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(72, 620, 22, 55);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(96, 620, 22, 55);
  }
bahia17(){
  this.ctx.fillStyle = "red";
  this.ctx.fillRect(237, 245, 110, 18);

  this.ctx.fillStyle = "red";
  this.ctx.fillRect(237, 20, 110, 18);

  this.ctx.fillStyle = "red";
  this.ctx.fillRect(237, 40, 110, 18);

  this.ctx.fillStyle = "red";
  this.ctx.fillRect(237, 60, 110, 18);

  this.ctx.fillStyle = "red";
  this.ctx.fillRect(237, 80, 110, 18);
}

}
