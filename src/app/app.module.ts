import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPage } from '../pages/reset/reset';
import { AboutPage } from '../pages/about/about';
import { IdentityPage } from '../pages/identity/identity';
import { PassportPage } from '../pages/passport/passport';
import { ExportPage } from '../pages/export/export';
import { ImagePage } from '../pages/image/image';
import { DocumentPage } from '../pages/document/document';
import { AddFolderPage } from '../pages/add-folder/add-folder';
import { EditFolderPage } from '../pages/edit-folder/edit-folder';
import { FolderPage } from '../pages/folder/folder';
import { EditImagePage } from '../pages/edit-image/edit-image';
import { ImageDocumentPage } from '../pages/image-document/image-document';
import { ImagePassportPage } from '../pages/image-passport/image-passport';
import { CropPassportPage } from '../pages/crop-passport/crop-passport';
import { InfoPassportPage } from '../pages/info-passport/info-passport';
import { ImageIdentityPage } from '../pages/image-identity/image-identity';
import { InfoDocumentPage } from '../pages/info-document/info-document';
import { InfoIdentityPage } from '../pages/info-identity/info-identity';
import { AddImagePassportPage } from '../pages/add-image-passport/add-image-passport';
import { AddImageIdentityPage } from '../pages/add-image-identity/add-image-identity';
import { AddImageDocumentPage } from '../pages/add-image-document/add-image-document';
import { IdentityBackPage } from '../pages/identity-back/identity-back';
import { ImageIdentityBackPage } from '../pages/image-identity-back/image-identity-back';
import { CropDocumentPage } from '../pages/crop-document/crop-document';
import { CropIdentityPage } from '../pages/crop-identity/crop-identity';
import { CropIdentityBackPage } from '../pages/crop-identity-back/crop-identity-back';
import { CropEditPage } from '../pages/crop-edit/crop-edit';
import { CropImagePage } from '../pages/crop-image/crop-image';
import { FolderPassPage } from '../pages/folder-pass/folder-pass';
import { FolderIdPage } from '../pages/folder-id/folder-id';
import { FolderDocPage } from '../pages/folder-doc/folder-doc';
import { CropDefaultPage } from '../pages/crop-default/crop-default';
import { EditDefaultPage } from '../pages/edit-default/edit-default';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../service/auth.service';
import { CameraPreview } from '@ionic-native/camera-preview';
import { SQLite } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera } from '@ionic-native/camera';
import { NgProgressModule } from '@ngx-progressbar/core';

@NgModule({
  declarations: [
  MyApp,
  HomePage,
  LoginPage,
  SignupPage,
  ResetPage,
  AboutPage,
  IdentityPage,
  PassportPage,
  AddFolderPage,
  EditFolderPage,
  ImagePassportPage,
  ImageIdentityPage,
  InfoPassportPage,
  InfoIdentityPage,
  FolderPage,
  AddImagePassportPage,
  AddImageIdentityPage,
  ExportPage,
  IdentityBackPage,
  ImageIdentityBackPage,
  ImagePage,
  DocumentPage,
  ImageDocumentPage,
  InfoDocumentPage,
  AddImageDocumentPage,
  EditImagePage,
  CropPassportPage,
  CropDocumentPage,
  CropIdentityPage,
  CropIdentityBackPage,
  CropEditPage,
  CropImagePage,
  FolderPassPage,
  FolderIdPage,
  FolderDocPage,
  CropDefaultPage,
  EditDefaultPage
  ],
  imports: [
  BrowserModule,
  HttpClientModule,
  NgProgressModule.forRoot(),
  IonicModule.forRoot(MyApp),
  AngularFireModule.initializeApp(FIREBASE_CONFIG),
  AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  MyApp,
  HomePage,
  LoginPage,
  SignupPage,
  ResetPage,
  AboutPage,
  IdentityPage,
  PassportPage,
  AddFolderPage,
  EditFolderPage,
  ImagePassportPage,
  ImageIdentityPage,
  InfoPassportPage,
  InfoIdentityPage,
  FolderPage,
  AddImagePassportPage,
  AddImageIdentityPage,
  ExportPage,
  IdentityBackPage,
  ImageIdentityBackPage,
  ImagePage,
  DocumentPage,
  ImageDocumentPage,
  InfoDocumentPage,
  AddImageDocumentPage,
  EditImagePage,
  CropPassportPage,
  CropDocumentPage,
  CropIdentityPage,
  CropIdentityBackPage,
  CropEditPage,
  CropImagePage,
  FolderPassPage,
  FolderIdPage,
  FolderDocPage,
  CropDefaultPage,
  EditDefaultPage
  ],
  providers: [
  StatusBar,
  SplashScreen,
  Toast,
  AuthService,
  CameraPreview,
  SQLite,
  SocialSharing,
  FileOpener,
  File,
  Camera,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
