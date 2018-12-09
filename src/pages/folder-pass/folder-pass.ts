import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform  } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

import { CropDefaultPage } from '../crop-default/crop-default';

@IonicPage()
@Component({
	selector: 'page-folder-pass',
	templateUrl: 'folder-pass.html',
})
export class FolderPassPage {

	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	totalImage = 0;
	images: any = [];
	image = { name:"", path:"" }; 

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		public alertCtrl: AlertController,
		private platform: Platform
		) {
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
				db.executeSql('SELECT * FROM image WHERE folderid=2 ORDER BY imageid DESC', {} as any).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
						})
					}					
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));				
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=2', {} as any).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Image table: ' + e.message));
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
				db.executeSql('SELECT * FROM image WHERE folderid=2 ORDER BY imageid DESC', {} as any).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
						})
					}					
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));				
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=2', {} as any).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Image table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	deleteImage(imageid){
		this.platform.ready().then(() => {
			if (this.data != null) {
				let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
				let nameDB = nameEmail + '.db';			
				let prompt = this.alertCtrl.create({
					title: 'Bạn có đồng ý xóa?',
					buttons: [
					{ text: 'Hủy',
					handler: data => { console.log('Cancel clicked'); }
				},
				{ text: 'OK',
				handler: data => {
					this.sqlite.create({
						name: nameDB,
						location: 'default'
					}).then((db: SQLiteObject) => {		
						db.executeSql('SELECT name, path FROM image WHERE imageid=?', [imageid])
						.then(res => {
							if(res.rows.length > 0) {
								this.image.name = res.rows.item(0).name;
								this.image.path = res.rows.item(0).path;						
							}		         
							let name = this.image.name + '.' + 'png';	
							this.file.removeFile(this.image.path, name).catch(e => console.log('Image didn\'t remove in device: ' + e.message));          						
							db.executeSql('DELETE FROM image WHERE imageid=?', [imageid]).then(res => { 
								this.getData();        
							}).catch(e => console.log('Image didn\'t remove in table: ' + e.message));
						}).catch(e => console.log('Image didn\'t select: ' + e.message));	
					}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
				}}]
			});prompt.present();				
			}
			else {
				let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
				let nameDBPhone = 'u' + namePhone;
				let nameDB = nameDBPhone + '.db';
				let prompt = this.alertCtrl.create({
					title: 'Bạn có đồng ý xóa?',
					buttons: [
					{ text: 'Hủy',
					handler: data => { console.log('Cancel clicked'); }
				},
				{ text: 'OK',
				handler: data => {
					this.sqlite.create({
						name: nameDB,
						location: 'default'
					}).then((db: SQLiteObject) => {		
						db.executeSql('SELECT name, path FROM image WHERE imageid=?', [imageid])
						.then(res => {
							if(res.rows.length > 0) {
								this.image.name = res.rows.item(0).name;
								this.image.path = res.rows.item(0).path;						
							}		         
							let name = this.image.name + '.' + 'png';	
							this.file.removeFile(this.image.path, name).catch(e => console.log('Image didn\'t remove in device: ' + e.message));          						
							db.executeSql('DELETE FROM image WHERE imageid=?', [imageid]).then(res => { 
								this.getData();        
							}).catch(e => console.log('Image didn\'t remove in table: ' + e.message));
						}).catch(e => console.log('Image didn\'t select: ' + e.message));	
					}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
				}}]
			});prompt.present();
			}
		}).catch(e => console.log(e)); 
	}

	editImage(imageid,name,path,base64){
		this.navCtrl.push(CropDefaultPage,{
			imageid:imageid,
			imagename:name,
			path:path,
			base64:base64 
		});
	}	
}
