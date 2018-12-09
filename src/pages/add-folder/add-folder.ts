import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
	selector: 'page-add-folder',
	templateUrl: 'add-folder.html',
})
export class AddFolderPage {
	
	thisDate: String = new Date().toISOString();
	folder = { name:"", date:this.thisDate, type:"", display:"yes" };
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	

	constructor(public navCtrl: NavController, 
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		private toast: Toast,
		private platform: Platform
		) {
	}

	saveFolder() {
		this.platform.ready().then(() => { 
			if (this.data != null) { 
				let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
				let nameDB = nameEmail + '.db';
				let path = this.file.externalRootDirectory + 'IonScan';
				if (this.folder.name=='' && this.folder.type=='') {
					this.toast.show('Tên và loại thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast));
				}
				if (this.folder.name=='' && this.folder.type!='') {
					this.toast.show('Tên thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast))
				}
				if (this.folder.name!='' && this.folder.type=='') {
					this.toast.show('Loại thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast))
				}	
				if (this.folder.name!='' && this.folder.type!='') {
					this.sqlite.create({
						name: nameDB,
						location: 'default'
					}).then((db: SQLiteObject) => {
						db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?,?)',[this.folder.name,this.folder.date,this.folder.type,this.folder.display]).then(res => {					
							let name = this.folder.name + '.' + nameEmail;
							this.file.createDir(path, name, false).catch(e => { this.toast.show('Trùng tên thư mục', '5000', 'center').subscribe(toast => console.log(toast))});
							this.navCtrl.popToRoot();
						}).catch(e => console.log('Folder didn\'t add to table: ' + e.message));					
					}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
				}
			}
			else {
				let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
				let nameDBPhone = 'u' + namePhone;
				let nameDB = nameDBPhone + '.db';
				let path = this.file.externalRootDirectory + 'IonScan';
				if (this.folder.name=='' && this.folder.type=='') {
					this.toast.show('Tên và loại thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast));
				}
				if (this.folder.name=='' && this.folder.type!='') {
					this.toast.show('Tên thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast))
				}
				if (this.folder.name!='' && this.folder.type=='') {
					this.toast.show('Loại thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast))
				}	
				if (this.folder.name!='' && this.folder.type!='') {
					this.sqlite.create({
						name: nameDB,
						location: 'default'
					}).then((db: SQLiteObject) => {
						db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?,?)',[this.folder.name,this.folder.date,this.folder.type,this.folder.display]).then(res => {					
							let name = this.folder.name + '.' + nameDBPhone;
							this.file.createDir(path, name, false).catch(e => { this.toast.show('Trùng tên thư mục', '5000', 'center').subscribe(toast => console.log(toast))});
							this.navCtrl.popToRoot();
						}).catch(e => console.log('Folder didn\'t add to table: ' + e.message));					
					}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
				}
			}
		}).catch(e => console.log(e));  		
	}
	
}
