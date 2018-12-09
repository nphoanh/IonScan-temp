import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-add-image-identity',
	templateUrl: 'add-image-identity.html',
})
export class AddImageIdentityPage {

	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	totalImage = 0;
	images:any = [];
	folderid = this.navParams.get("folderid");
	foldername = this.navParams.get('foldername');
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", upload:0, folderid:"" }; 

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
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
				db.executeSql('SELECT * FROM image WHERE folderid=3 ORDER BY imageid DESC', {} as any).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,							
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							folderid:res.rows.item(i).folderid
						})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=3', {} as any).then(res => {
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
				db.executeSql('SELECT * FROM image WHERE folderid=3 ORDER BY imageid DESC', {} as any).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,							
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							folderid:res.rows.item(i).folderid
						})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=3', {} as any).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Image table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	b64toBlob(b64Data, contentType, sliceSize) {
		var contentType = contentType || '';
		var sliceSize = sliceSize || 512;
		var byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
		var byteArrays = [];
		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		return new Blob(byteArrays, {type: contentType});
	}

	savebase64AsFile(folderPath, fileName, base64, contentType){
		var DataBlob = this.b64toBlob(base64,contentType,512);
		this.platform.ready().then(() => {
			this.file.writeFile(folderPath, fileName, DataBlob).catch(e => console.log('File didn\'t create: ' + e.message));		  
		}).catch(e => console.log(e));  
	}    

	moveImage(imageid){
		this.platform.ready().then(() => {
			if (this.data != null) {
				let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
				let nameDB = nameEmail + '.db';
				let folderPathNew = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameEmail;                        		
				let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Chứng minh thư' + '.' + nameEmail;                        			
				this.sqlite.create({
					name: nameDB,
					location: 'default'
				}).then((db: SQLiteObject) => {				
					db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid]).then(res => {
						if(res.rows.length > 0) {
							this.image.imageid = res.rows.item(0).imageid;
							this.image.name = res.rows.item(0).name;
							this.image.date = res.rows.item(0).date;
							this.image.path = res.rows.item(0).path;
							this.image.base64 = res.rows.item(0).base64;
							this.image.type = res.rows.item(0).type;
							this.image.upload = res.rows.item(0).upload;
							this.image.folderid = res.rows.item(0).folderid;						
						}						
						let nameFile = this.image.name + '.' + 'png';
						let base = this.image.base64.substr(this.image.base64.lastIndexOf(',')+1);    
						this.file.removeFile(folderPath, nameFile).catch(e => console.log('File didn\'t remove: ' + e.message));		  				
						this.savebase64AsFile(folderPathNew, nameFile, base, this.image.type); 
					}).catch(e => console.log('Select nothing from Image table: ' + e.message));		  				

					db.executeSql('UPDATE image SET path=?,folderid=? WHERE imageid=?',[folderPathNew,this.folderid,imageid]).catch(e => console.log('Image didn\'t update: ' + e.message));
				}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
				this.navCtrl.pop();
			}
			else {
				let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
				let nameDBPhone = 'u' + namePhone;
				let nameDB = nameDBPhone + '.db';
				let folderPathNew = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameDBPhone;                        
				let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Chứng minh thư' + '.' + nameDBPhone;                        
				this.sqlite.create({
					name: nameDB,
					location: 'default'
				}).then((db: SQLiteObject) => {				
					db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid]).then(res => {
						if(res.rows.length > 0) {
							this.image.imageid = res.rows.item(0).imageid;
							this.image.name = res.rows.item(0).name;
							this.image.date = res.rows.item(0).date;
							this.image.path = res.rows.item(0).path;
							this.image.base64 = res.rows.item(0).base64;
							this.image.type = res.rows.item(0).type;
							this.image.upload = res.rows.item(0).upload;
							this.image.folderid = res.rows.item(0).folderid;						
						}						
						let nameFile = this.image.name + '.' + 'png';
						let base = this.image.base64.substr(this.image.base64.lastIndexOf(',')+1);    
						this.file.removeFile(folderPath, nameFile).catch(e => console.log('File didn\'t remove: ' + e.message));		  				
						this.savebase64AsFile(folderPathNew, nameFile, base, this.image.type); 
					}).catch(e => console.log('Select nothing from Image table: ' + e.message));		  				

					db.executeSql('UPDATE image SET path=?,folderid=? WHERE imageid=?',[folderPathNew,this.folderid,imageid]).catch(e => console.log('Image didn\'t update: ' + e.message));
				}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
				this.navCtrl.pop();
			}
		}).catch(e => console.log(e));  
	}
}
