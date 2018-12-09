import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddImageDocumentPage } from './add-image-document';

@NgModule({
  declarations: [
    AddImageDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(AddImageDocumentPage),
  ],
})
export class AddImageDocumentPageModule {}
