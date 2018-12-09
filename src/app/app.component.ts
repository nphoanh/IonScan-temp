import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../service/auth.service';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { IdentityPage } from '../pages/identity/identity';
import { PassportPage } from '../pages/passport/passport';
import { DocumentPage } from '../pages/document/document';
import { FolderPassPage } from '../pages/folder-pass/folder-pass';
import { FolderIdPage } from '../pages/folder-id/folder-id';
import { FolderDocPage } from '../pages/folder-doc/folder-doc';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  folderPage: Array<{title: string, component: any}>;
  aboutPage: Array<{title: string, component: any}>;
  pages: Array<{title: string, component: any}>;
  subfolders: Array<{title: string, component: any}>;
  shownGroup = null;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private auth: AuthService,
    private menu: MenuController
    ) {
    this.initializeApp();

    this.folderPage = [
    { title: 'Lưu trữ', component: HomePage }
    ];

    this.aboutPage = [
    { title: 'Về chúng tôi', component: AboutPage }
    ];

    this.pages = [
    { title: 'Chứng minh thư', component: IdentityPage },
    { title: 'Hộ chiếu', component: PassportPage },
    { title: 'Tài liệu', component: DocumentPage }
    ];

    this.subfolders = [
    { title: 'Chứng minh thư', component: FolderIdPage },
    { title: 'Hộ chiếu', component: FolderPassPage },
    { title: 'Tài liệu', component: FolderDocPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#9ec7f6');
      this.splashScreen.hide();
      this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user && user.emailVerified==true) {
            this.rootPage = HomePage;
          } else {
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
        );
    });
  }

  login() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(HomePage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

}