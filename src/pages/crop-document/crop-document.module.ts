import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropDocumentPage } from './crop-document';

@NgModule({
  declarations: [
    CropDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(CropDocumentPage),
  ],
})
export class CropDocumentPageModule {}
