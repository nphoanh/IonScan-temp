import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropEditPage } from './crop-edit';

@NgModule({
  declarations: [
    CropEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CropEditPage),
  ],
})
export class CropEditPageModule {}
