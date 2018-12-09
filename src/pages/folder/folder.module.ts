import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FolderPage } from './folder';

@NgModule({
  declarations: [
    FolderPage,
  ],
  imports: [
    IonicPageModule.forChild(FolderPage),
  ],
})
export class FolderPageModule {}
