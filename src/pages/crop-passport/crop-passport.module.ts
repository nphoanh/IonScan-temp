import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropPassportPage } from './crop-passport';

@NgModule({
  declarations: [
    CropPassportPage,
  ],
  imports: [
    IonicPageModule.forChild(CropPassportPage),
  ],
})
export class CropPassportPageModule {}
