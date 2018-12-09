import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropIdentityPage } from './crop-identity';

@NgModule({
  declarations: [
    CropIdentityPage,
  ],
  imports: [
    IonicPageModule.forChild(CropIdentityPage),
  ],
})
export class CropIdentityPageModule {}
