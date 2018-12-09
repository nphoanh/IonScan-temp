import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, Platform } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Toast } from '@ionic-native/toast';
import { File } from '@ionic-native/file';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NgProgress } from '@ngx-progressbar/core';

import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { ResetPage } from '../reset/reset';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  user = {} as User;
  signin: string = "Email";
  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  folders: any = [];
  totalFolder = 0;
  folder = { name:"" };
  thisDate: String = new Date().toISOString();

  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private toast: Toast,
    public menuCtrl:MenuController,   
    private file: File,  
    private sqlite: SQLite,
    public progress: NgProgress,
    private platform: Platform
    ) {
    this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewWillEnter() {
    this.createRootFolder();
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        console.log(response);
      },
      'expired-callback': function() {
      }
    });
  }

  createRootFolder(){
    this.platform.ready().then(() => {
      this.file.createDir(this.file.externalRootDirectory, 'IonScan', false).catch(e => console.log('Folder IonScan didn\'t create: ' + e.message));
    }).catch(e => console.log(e));   
  }

  async loginPhone(user){      
    try {
      if(user.phone==null) {
        this.toast.show('Không được để trống số điện thoại', '5000', 'center').subscribe(toast => console.log(toast));
      }
      else {
        const appVerifier = this.recaptchaVerifier;
        let cutString = user.phone.substr(user.phone.indexOf('0')+1); 
        let numberPhone = '+84' + cutString;   
        let namePhone = numberPhone.substr(numberPhone.lastIndexOf('+')+1);
        let nameDBPhone = 'u' + namePhone;
        let nameDB = nameDBPhone + '.db';
        let identityFolder = 'Chứng minh thư' + '.' + nameDBPhone;
        let passportFolder = 'Hộ chiếu' + '.' + nameDBPhone;
        let documentFolder = 'Tài liệu' + '.' + nameDBPhone;
        let pdfFolder = 'Pdf' + '.' + nameDBPhone;
        await firebase.auth().signInWithPhoneNumber(numberPhone, appVerifier).then(confirmationResult => {             
          this.progress.start();
          let prompt = this.alertCtrl.create({
            title: 'Nhập mã xác thực',
            inputs: [{ name: 'confirmationCode', placeholder: 'Mã xác thực' }],
            buttons: [
            { text: 'Hủy',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Gửi',
          handler: data => {
            confirmationResult.confirm(data.confirmationCode)
            .then(result => {
              this.sqlite.create({ 
                name: nameDB,
                location: 'default'
              }).then((db: SQLiteObject) => {
                db.executeSql('CREATE TABLE IF NOT EXISTS folder(folderid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, date TEXT, type TEXT, display TEXT DEFAULT "yes", UNIQUE(name))', {} as any).catch(e => console.log('Folder table didn\'t create: ' + e.message));
                db.executeSql('CREATE TABLE IF NOT EXISTS image(imageid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, path TEXT, base64 TEXT, type TEXT DEFAULT "image/png", upload INTEGER DEFAULT 0, folderid, UNIQUE(name), FOREIGN KEY(folderid) REFERENCES folder (folderid))', {} as any).catch(e => console.log('Image table didn\'t create: ' + e.message));
                db.executeSql('INSERT INTO folder VALUES (3,"Chứng minh thư",?,"Chứng minh thư","no")', [this.thisDate]).catch(e => console.log('Identity didn\'t add to table: ' + e.message));
                db.executeSql('INSERT INTO folder VALUES (2,"Hộ chiếu",?,"Hộ chiếu","no")', [this.thisDate]).catch(e => console.log('Passport didn\'t add to table: ' + e.message));
                db.executeSql('INSERT INTO folder VALUES (1,"Tài liệu",?,"Tài liệu","no")', [this.thisDate]).catch(e => console.log('Document didn\'t add to table: ' + e.message));
                this.platform.ready().then(() => {
                  let path = this.file.externalRootDirectory + 'IonScan';
                  this.file.createDir(path, identityFolder, false).catch(e => console.log('Identity didn\'t add to device: ' + e.message));
                  this.file.createDir(path, passportFolder, false).catch(e => console.log('Passport didn\'t add to device: ' + e.message));
                  this.file.createDir(path, documentFolder, false).catch(e => console.log('Passport didn\'t add to device: ' + e.message));
                  this.file.createDir(path, pdfFolder, false).catch(e => console.log('Pdf didn\'t add to device: ' + e.message));             
                }).catch(e => console.log(e));   
              }).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
              this.navCtrl.setRoot(HomePage);
            }).catch(error => {this.toast.show(error, '5000', 'center').subscribe(toast => {console.log(toast);})
          });
          }}]
        });this.progress.complete();
          prompt.present();
        }).catch(e => console.log('Sign in did not success: ' + e.message));   
      }       
    }
    catch(e) {
      this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast));  
    }
  }

  async login(user: User) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).then(e => {
        let users = firebase.auth().currentUser;
        let emails = user.email;
        let emailLower = emails.toLowerCase();
        let nameEmail = emailLower.substr(0,emailLower.lastIndexOf('@'));
        let nameDB = nameEmail + '.db';
        let identityFolder = 'Chứng minh thư' + '.' + nameEmail;
        let passportFolder = 'Hộ chiếu' + '.' + nameEmail;
        let documentFolder = 'Tài liệu' + '.' + nameEmail;
        let pdfFolder = 'Pdf' + '.' + nameEmail;
        if (users.emailVerified == true && emailLower == users.email) {
          this.sqlite.create({
            name: nameDB,
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS folder(folderid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, date TEXT, type TEXT, display TEXT DEFAULT "yes", UNIQUE(name))', {} as any).catch(e => console.log('Folder table didn\'t create: ' + e.message));
            db.executeSql('CREATE TABLE IF NOT EXISTS image(imageid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, path TEXT, base64 TEXT, type TEXT DEFAULT "image/png", upload INTEGER DEFAULT 0, folderid, UNIQUE(name), FOREIGN KEY(folderid) REFERENCES folder (folderid))', {} as any).catch(e => console.log('Image table didn\'t create: ' + e.message));
            db.executeSql('INSERT INTO folder VALUES (3,"Chứng minh thư",?,"Chứng minh thư","no")', [this.thisDate]).catch(e => console.log('Identity didn\'t add to table: ' + e.message));
            db.executeSql('INSERT INTO folder VALUES (2,"Hộ chiếu",?,"Hộ chiếu","no")', [this.thisDate]).catch(e => console.log('Passport didn\'t add to table: ' + e.message));
            db.executeSql('INSERT INTO folder VALUES (1,"Tài liệu",?,"Tài liệu","no")', [this.thisDate]).catch(e => console.log('Document didn\'t add to table: ' + e.message));
            this.platform.ready().then(() => {
              let path = this.file.externalRootDirectory + 'IonScan';
              this.file.createDir(path, identityFolder, false).catch(e => console.log('Identity didn\'t add to device: ' + e.message));
              this.file.createDir(path, passportFolder, false).catch(e => console.log('Passport didn\'t add to device: ' + e.message));
              this.file.createDir(path, documentFolder, false).catch(e => console.log('Passport didn\'t add to device: ' + e.message));
              this.file.createDir(path, pdfFolder, false).catch(e => console.log('Pdf didn\'t add to device: ' + e.message));             
            }).catch(e => console.log(e)); 
          }).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
          this.navCtrl.setRoot(HomePage);
        }
        if (users.emailVerified == false && emailLower == users.email) {
          this.toast.show('Email chưa được xác thực', '5000', 'center').subscribe(toast => { console.log(toast);})
        }
      }).catch(e => this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast)));       
    }
    catch(e) {
      this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast));  
    }
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  resetPwd() {
    this.navCtrl.push(ResetPage);
  }

}