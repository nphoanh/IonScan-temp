import { Component } from '@angular/core';
import { NavController, MenuController, Platform  } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

import { FolderPage } from '../folder/folder';
import { AddFolderPage } from '../add-folder/add-folder';
import { EditFolderPage } from '../edit-folder/edit-folder';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

  data = this.auth.getEmail();
  dataPhone = this.auth.getPhone();
  folders:any = [];
  totalFolder = 0;
  folder = { name:""};
  thisDate: String = new Date().toISOString();
  path = this.file.externalRootDirectory + 'IonScan';
  totalImgPass = 0;
  totalImgID = 0;
  totalImgDoc = 0;

  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    private auth: AuthService,
    private file: File,    
    public menuCtrl:MenuController,  
    private platform: Platform
    ) { 
    this.menuCtrl.enable(true, 'myMenu');
  }

  ionViewWillEnter() {
    this.getData();    
  }

  getData(){    
    if (this.data != null) {
      let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
      let nameDB = nameEmail + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {   
        /*db.executeSql('DROP TABLE IF EXISTS folder', {} as any)
        .then(res => console.log('Deleted Folder table'))
        .catch(e => console.log(e));
        db.executeSql('DROP TABLE IF EXISTS image', {} as any)
        .then(res => console.log('Deleted Image table'))
        .catch(e => console.log(e)); */    
        db.executeSql('SELECT * FROM folder ORDER BY folderid DESC', {} as any)
        .then(res => {
          this.folders = [];
          for(var i=0; i<res.rows.length; i++) {
            this.folders.push({
              folderid:res.rows.item(i).folderid,
              name:res.rows.item(i).name,
              date:res.rows.item(i).date,
              type:res.rows.item(i).type,
              display:res.rows.item(i).display
            })
          }
        }).catch(e => console.log('Select nothing from Folder table: ' + e.message));
        db.executeSql('SELECT COUNT(folderid) AS totalFolder FROM folder WHERE display="yes"', {} as any)
        .then(res => {
          if(res.rows.length>0) {
            this.totalFolder = parseInt(res.rows.item(0).totalFolder);
          }
        }).catch(e => console.log('Count nothing from Folder table: ' + e.message));                         
      }).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
    }

    else {
      let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
      let nameDBPhone = 'u' + namePhone;
      let nameDB = nameDBPhone + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM folder ORDER BY folderid DESC', {} as any)
        .then(res => {
          this.folders = [];
          for(var i=0; i<res.rows.length; i++) {
            this.folders.push({
              folderid:res.rows.item(i).folderid,
              name:res.rows.item(i).name,
              date:res.rows.item(i).date,
              type:res.rows.item(i).type,
              display:res.rows.item(i).display
            })
          }
        }).catch(e => console.log('Select nothing from Folder table: ' + e.message));
        db.executeSql('SELECT COUNT(folderid) AS totalFolder FROM folder WHERE display="yes"', {} as any)
        .then(res => {
          if(res.rows.length>0) {
            this.totalFolder = parseInt(res.rows.item(0).totalFolder);
          }
        }).catch(e => console.log('Count nothing from Folder table: ' + e.message));         
      }).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
    }
  }

  addFolder() {
    this.navCtrl.push(AddFolderPage);
  }

  editFolder(folderid,name) {
    this.navCtrl.push(EditFolderPage, {
      folderid:folderid,
      foldername:name
    });
  }

  moveToFolder(folderid,name){
    this.navCtrl.push(FolderPage, {
      folderid:folderid,      
      foldername:name
    });
  }

  deleteFolder(folderid) {
    this.platform.ready().then(() => {
      if (this.data != null) {
        let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
        let nameDB = nameEmail + '.db';
        this.sqlite.create({
          name: nameDB,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT name FROM folder WHERE folderid=?', [folderid])
          .then(res => {
            if(res.rows.length > 0) {            
              this.folder.name = res.rows.item(0).name;
            }          
            let name = this.folder.name + '.' + nameEmail;
            this.file.removeRecursively(this.path, name).catch(e => console.log('Folder didn\'t remove in device: ' + e.message));          
          }).catch(e => console.log('Folder didn\'t remove: ' + e.message));

          db.executeSql('DELETE FROM folder WHERE folderid=?', [folderid]).then(res => { 
            this.getData();        
          }).catch(e => console.log('Folder didn\'t remove in table: ' + e.message));
        }).catch(e => console.log('SQLite didn\'t create: ' + e.message));
      }
      else {
        let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
        let nameDBPhone = 'u' + namePhone;
        let nameDB = nameDBPhone + '.db';
        this.sqlite.create({
          name: nameDB,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT name FROM folder WHERE folderid=?', [folderid])
          .then(res => {
            if(res.rows.length > 0) {            
              this.folder.name = res.rows.item(0).name;
            }          
            let name = this.folder.name + '.' + nameDB;
            this.file.removeRecursively(this.path, name).catch(e => console.log('Folder didn\'t remove in device: ' + e.message));          
          }).catch(e => console.log('Folder didn\'t remove: ' + e.message));
          db.executeSql('DELETE FROM folder WHERE folderid=?', [folderid]).then(res => { 
            this.getData();        
          }).catch(e => console.log('Folder didn\'t remove in table: ' + e.message));
        }).catch(e => console.log('SQLite didn\'t create: ' + e.message));
      }
    }).catch(e => console.log(e));   
  }

}
