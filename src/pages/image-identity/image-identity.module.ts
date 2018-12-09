import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageIdentityPage } from './image-identity';

@NgModule({
  declarations: [
    ImageIdentityPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageIdentityPage),
  ],
})
export class ImageIdentityPageModule {}
