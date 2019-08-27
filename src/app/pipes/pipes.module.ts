import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { FotosPipe } from './fotos.pipe';


@NgModule({
  imports: [],
  declarations: [
    ImagenPipe,
    FotosPipe
  ],
  exports: [
    ImagenPipe,
    FotosPipe
  ]
})
export class PipesModule { }
