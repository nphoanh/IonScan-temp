import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgProgress } from '@ngx-progressbar/core';
  
import { ExportPage } from '../export/export';
import { AddImagePassportPage } from '../add-image-passport/add-image-passport';
import { AddImageIdentityPage } from '../add-image-identity/add-image-identity';
import { AddImageDocumentPage } from '../add-image-document/add-image-document';
import { CropImagePage } from '../crop-image/crop-image';
import { CropEditPage } from '../crop-edit/crop-edit';

@IonicPage()
@Component({
	selector: 'page-folder',
	templateUrl: 'folder.html',
})
export class FolderPage {

	datas: any;
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	totalImage = 0;
	images:any = [];
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", upload:0, folderid:"" }; 
	folder = { folderid:0, name:"", date:"", type:"", display:"" };
	foldername = this.navParams.get('foldername');
	folderid = this.navParams.get('folderid');
	path = this.file.externalRootDirectory + 'IonScan';
	photo = { albumId: '', id: '', title: '', url: '', thumbnailUrl: ''};

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		private camera: Camera,
		private toast: Toast,
		public httpClient: HttpClient,
		public progress: NgProgress,
		) {
	}

	ionViewWillEnter() {
		this.getData(this.navParams.get("folderid"));
	}


/*	getImage(){		
		this.progress.start();
		this.httpClient.get("http://192.168.1.201:3000/images")
		.subscribe(data => {
			console.log(data);
			this.progress.complete();
		}, error => {
			console.log(error);
			this.progress.complete();
		});
	}*/

	getData(folderid){    
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {    
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid]).then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;	
		 				this.folder.display = res.rows.item(0).display;					
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));
				db.executeSql('SELECT * FROM image WHERE folderid=? ORDER BY imageid DESC', [folderid]).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							upload:res.rows.item(i).upload,
							folderid:res.rows.item(i).folderid})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));				
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=? ', [folderid]).then(res => {
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
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid]).then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;
						this.folder.display = res.rows.item(0).display;						
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));
				db.executeSql('SELECT * FROM image WHERE folderid=? ORDER BY imageid DESC', [folderid]).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							upload:res.rows.item(i).upload,
							folderid:res.rows.item(i).folderid})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=? ', [folderid]).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Folder table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	addImage(){
		if (this.folder.type=="Hộ chiếu") {
			this.navCtrl.push(AddImagePassportPage,{
				folderid:this.folderid,
				foldername:this.foldername
			});			
		}
		else if(this.folder.type=="Tài liệu") {
			this.navCtrl.push(AddImageDocumentPage,{
				folderid:this.folderid,
				foldername:this.foldername
			});	
		}
		else {
			this.navCtrl.push(AddImageIdentityPage,{
				folderid:this.folderid,
				foldername:this.foldername
			});
		}
	}	
	
	deleteImage(imageid){
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid])
				.then(res => {
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
					let name = this.image.name + '.' + 'png';
					this.file.removeFile(this.image.path, name).catch(e => console.log('Image didn\'t remove in device: ' + e.message));          
				}).catch(e => console.log('Image didn\'t remove: ' + e.message));
				db.executeSql('DELETE FROM image WHERE imageid=?', [imageid]).then(res => { 
					this.getData(this.folderid);        
				}).catch(e => console.log('Image didn\'t remove in table: ' + e.message));
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
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid])
				.then(res => {
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
					let name = this.image.name + '.' + 'png';
					this.file.removeFile(this.image.path, name).catch(e => console.log('Image didn\'t remove in device: ' + e.message));          
				}).catch(e => console.log('Image didn\'t remove: ' + e.message));
				db.executeSql('DELETE FROM image WHERE imageid=?', [imageid]).then(res => { 
					this.getData(this.folderid);        
				}).catch(e => console.log('Folder didn\'t remove in table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	exportImage(imageid,base64) {
		this.navCtrl.push(ExportPage,{imageid:imageid});
	}

	closeButton(fab: FabContainer){
		fab.close();
	}

	uploadImage(imageid) {
		this.progress.start();
		const httpOptions = {
			headers: new HttpHeaders({
				'content-type':  'application/json',
				'authorization': 'my-auth-token'
			})
		};
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid]).then(res => {
					if(res.rows.length > 0) {
						this.image.imageid = res.rows.item(0).imageid;
						this.image.name = res.rows.item(0).name;
						this.image.path = res.rows.item(0).path;	
						this.image.base64 = res.rows.item(0).base64;						
					}			
					let postData = {	
						'imageName' : this.image.name,
						'base64' : this.image.base64
					}
					this.httpClient.post("https://jsonplaceholder.typicode.com/photos", postData, httpOptions)
					.subscribe(data => {
						this.progress.complete();
						this.toast.show('Tải ảnh thành công', '5000', 'center').subscribe(toast => console.log(toast));
						db.executeSql('UPDATE image SET upload=? WHERE imageid=?',[1,imageid]).catch(e => console.log('Image didn\'t upload in table: ' + e.message));					
						this.getData(this.folderid);
					}, error => {
						this.progress.complete();
						console.log(error);
						this.toast.show(error, '5000', 'center').subscribe(toast => console.log(toast));				
					});		
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));		  				
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
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid]).then(res => {
					if(res.rows.length > 0) {
						this.image.imageid = res.rows.item(0).imageid;
						this.image.name = res.rows.item(0).name;
						this.image.base64 = res.rows.item(0).base64;						
					}			
					let postData = {
						"imageName": this.image.name,
						"base64": this.image.base64
					}
					this.httpClient.post("https://jsonplaceholder.typicode.com/photos", postData, httpOptions)
					.subscribe(data => {
						this.progress.complete();
						this.toast.show('Tải ảnh thành công', '5000', 'center').subscribe(toast => console.log(toast));
						db.executeSql('UPDATE image SET upload=? WHERE imageid=?',[1,imageid]).catch(e => console.log('Image didn\'t upload in table: ' + e.message));					
						this.getData(this.folderid);
					}, error => {
						this.progress.complete();
						this.toast.show(error, '5000', 'center').subscribe(toast => console.log(toast));				
					});		
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));		
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	pickImage() {
		this.progress.start();
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.PNG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			correctOrientation: true
		}
		this.camera.getPicture(options).then((imageData) => {
			let base64 = 'data:image/jpeg;base64,' + imageData;
			this.navCtrl.push(CropImagePage,{
				picture:base64,
				folderid:this.folderid,
				foldername:this.foldername
			});
		this.progress.complete();
		}, (err) => {
			console.log('Image didn\'t pick: ' + err);
			this.progress.complete();
		});
	}

	editImage(imageid,name,path,base64){
		this.navCtrl.push(CropEditPage,{
			imageid:imageid,
			imagename:name,
			path:path,
			base64:base64 
		});
	}

}
