import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdentityBackPage } from './identity-back';

@NgModule({
  declarations: [
    IdentityBackPage,
  ],
  imports: [
    IonicPageModule.forChild(IdentityBackPage),
  ],
})
export class IdentityBackPageModule {}
