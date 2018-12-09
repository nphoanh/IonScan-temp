import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
	selector: 'page-edit-folder',
	templateUrl: 'edit-folder.html',
})
export class EditFolderPage {

	folder = { folderid:0, name:"" };
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	foldername = this.navParams.get('foldername');
	path = this.file.externalRootDirectory + 'IonScan';

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		private toast: Toast,
		private platform: Platform
		) {
		this.getCurrentFolder(navParams.get("folderid"));
	}

	getCurrentFolder(folderid) {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid])
				.then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;					
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));
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
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid])
				.then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;					
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
		}
	}

	updateFolder(folderid) {
		this.platform.ready().then(() => {
			if (this.data != null) {
				let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
				let nameDB = nameEmail + '.db'; 
				let name = this.folder.name + '.' + nameEmail;
				let oldName = this.foldername + '.' + nameEmail;			
				this.sqlite.create({
					name: nameDB,
					location: 'default'
				}).then((db: SQLiteObject) => {
					db.executeSql('UPDATE folder SET name=? WHERE folderid=?',[this.folder.name,this.folder.folderid]).then(res => {
						if (this.folder.name!=null) {
							this.file.copyDir(this.path, oldName, this.path, name).catch(e => console.log('Folder didn\'t copy: ' + e.message));
							this.file.removeRecursively(this.path, oldName).catch(e => console.log('Folder didn\'t remove: ' + e.message));
							this.navCtrl.popToRoot();
						}
						else {
							this.toast.show('Tên thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast))
						}
					}).catch(e => console.log('Folder didn\'t update: ' + e.message));					  								
				}).catch(e => console.log('SQLite didn\'t create: ' + e.message));	
			}
			else {
				let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
				let nameDBPhone = 'u' + namePhone;
				let nameDB = nameDBPhone + '.db';
				let name = this.folder.name + '.' + namePhone;
				let oldName = this.foldername + '.' + namePhone;
				this.sqlite.create({
					name: nameDB,
					location: 'default'
				}).then((db: SQLiteObject) => {			
					db.executeSql('UPDATE folder SET name=? WHERE folderid=?',[this.folder.name,this.folder.folderid]).then(res => {
						if (this.folder.name!=null) {
							this.file.copyDir(this.path, oldName, this.path, name).catch(e => console.log('Folder didn\'t copy: ' + e.message));
							this.file.removeRecursively(this.path, oldName).catch(e => console.log('Folder didn\'t remove: ' + e.message));
							this.navCtrl.popToRoot();
						}
						else {
							this.toast.show('Tên thư mục không được để trống', '5000', 'center').subscribe(toast => console.log(toast))
						}
					}).catch(e => console.log('Folder didn\'t update: ' + e.message));					  								
				}).catch(e => console.log('SQLite didn\'t create: ' + e.message));	
			}
		}).catch(e => console.log(e));   
	}
}
