import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as jsPDF from 'jspdf';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
	selector: 'page-export',
	templateUrl: 'export.html',
})
export class ExportPage {
 
	message: string = null;
	subject: string = null;
	link: string = null;
	imageid = this.navParams.get('imageid');	
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", folderid:"" }; 
	path = this.file.externalRootDirectory + 'IonScan' + '/' + 'Pdf' + '.';
	picture: any;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,		
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		private socialSharing: SocialSharing,
		private fileOpener: FileOpener,
		) {
	}

	ionViewDidLoad() {
		this.getData(this.navParams.get("imageid"));
	}

	getData(imageid){    
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
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}		
					this.picture = this.image.base64;
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
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}	
					this.picture = this.image.base64;
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	shareImage(){
		this.socialSharing.share(this.message,this.subject,this.image.base64,this.link).catch((e) => console.log("Share unsuccess: " +e));
	}

	sharePdf(){
		var imgData = this.image.base64;
		var doc = new jsPDF();
		doc.addImage(imgData, 'PNG', 10, 10);
		let pdfOutput = doc.output();
		let buffer = new ArrayBuffer(pdfOutput.length);
		let array = new Uint8Array(buffer);
		for (var i = 0; i < pdfOutput.length; i++) { 
			array[i] = pdfOutput.charCodeAt(i);
		}
		let namePdf = this.image.name + '.' + 'pdf';	

		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let pathPdf = this.path + nameEmail;
			let filePdf = pathPdf + '/' + 	namePdf;
			this.file.writeFile(pathPdf, namePdf, buffer,{replace:true}).then( e => {
				this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message));       	
			}).catch(err => this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message)));       	
		}
		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let pathPdf = this.path + nameDBPhone;
			let filePdf = pathPdf + '/' + 	namePdf;
			this.file.writeFile(pathPdf, namePdf, buffer,{replace:true}).then( e => {
				this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message));       	
			}).catch(err => this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message)));       	
		}
	}
}