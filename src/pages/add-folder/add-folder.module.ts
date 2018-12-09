import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFolderPage } from './add-folder';

@NgModule({
  declarations: [
    AddFolderPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFolderPage),
  ],
})
export class AddFolderPageModule {}
