import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditImagePage } from './edit-image';

@NgModule({
  declarations: [
    EditImagePage,
  ],
  imports: [
    IonicPageModule.forChild(EditImagePage),
  ],
})
export class EditImagePageModule {}
