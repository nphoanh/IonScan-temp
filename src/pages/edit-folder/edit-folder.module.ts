import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditFolderPage } from './edit-folder';

@NgModule({
  declarations: [
    EditFolderPage,
  ],
  imports: [
    IonicPageModule.forChild(EditFolderPage),
  ],
})
export class EditFolderPageModule {}
