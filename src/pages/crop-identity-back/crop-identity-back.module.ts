import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropIdentityBackPage } from './crop-identity-back';

@NgModule({
  declarations: [
    CropIdentityBackPage,
  ],
  imports: [
    IonicPageModule.forChild(CropIdentityBackPage),
  ],
})
export class CropIdentityBackPageModule {}
