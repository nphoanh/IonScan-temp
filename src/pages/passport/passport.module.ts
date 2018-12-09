import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassportPage } from './passport';

@NgModule({
  declarations: [
    PassportPage,
  ],
  imports: [
    IonicPageModule.forChild(PassportPage),
  ],
})
export class PassportPageModule {}
