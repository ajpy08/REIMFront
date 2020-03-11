import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { FotosPipe } from './fotos.pipe';
import { ZipPipePipe } from './zip-pipe.pipe';


@NgModule({
  imports: [],
  declarations: [
    ImagenPipe,
    FotosPipe,
    ZipPipePipe
  ],
  exports: [
    ImagenPipe,
    FotosPipe
  ],
  providers: [
    FotosPipe
  ]
})
export class PipesModule { }
