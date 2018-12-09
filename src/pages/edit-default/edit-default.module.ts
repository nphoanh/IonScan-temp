import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDefaultPage } from './edit-default';

@NgModule({
  declarations: [
    EditDefaultPage,
  ],
  imports: [
    IonicPageModule.forChild(EditDefaultPage),
  ],
})
export class EditDefaultPageModule {}
