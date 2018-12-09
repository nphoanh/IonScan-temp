import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageDocumentPage } from './image-document';

@NgModule({
  declarations: [
    ImageDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageDocumentPage),
  ],
})
export class ImageDocumentPageModule {}
