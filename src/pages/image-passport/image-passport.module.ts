import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagePassportPage } from './image-passport';

@NgModule({
  declarations: [
    ImagePassportPage,
  ],
  imports: [
    IonicPageModule.forChild(ImagePassportPage),
  ],
})
export class ImagePassportPageModule {}
