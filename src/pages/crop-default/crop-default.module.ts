import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropDefaultPage } from './crop-default';

@NgModule({
  declarations: [
    CropDefaultPage,
  ],
  imports: [
    IonicPageModule.forChild(CropDefaultPage),
  ],
})
export class CropDefaultPageModule {}
