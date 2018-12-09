import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as jsPDF from 'jspdf';
import { FileOpener } from '@ionic-native/file-opener';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-info-document',
	templateUrl: 'info-document.html',
})
export class InfoDocumentPage {

	message: string = null;
	subject: string = null;
	link: string = null;
	picture = this.navParams.get("picture");
	imagename = this.navParams.get("imagename");
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	path = this.file.externalRootDirectory + 'IonScan' + '/' + 'Pdf' + '.';
	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private auth: AuthService,
		private socialSharing: SocialSharing,
		private fileOpener: FileOpener,
		private file: File,
		) {
	}

	shareImage(){
		this.socialSharing.share(this.message,this.subject,this.picture,this.link).catch((e) => console.log("Share unsuccess: " +e));
	}

	sharePdf(){
		var imgData = this.picture;
		var doc = new jsPDF();
		doc.addImage(imgData, 'PNG', 10, 10);
		let pdfOutput = doc.output();
		let buffer = new ArrayBuffer(pdfOutput.length);
		let array = new Uint8Array(buffer);
		for (var i = 0; i < pdfOutput.length; i++) { 
			array[i] = pdfOutput.charCodeAt(i);
		}
		let namePdf = this.imagename + '.' + 'pdf';	

		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let pathPdf = this.path + nameEmail;
			let filePdf = pathPdf + '/' + 	namePdf;
			this.file.writeFile(pathPdf, namePdf, buffer).then( e => {
				this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message));       	
			}).catch(err => this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message)));       	
		}
		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let pathPdf = this.path + nameDBPhone;
			let filePdf = pathPdf + '/' + 	namePdf;
			this.file.writeFile(pathPdf, namePdf, buffer).then( e => {
				this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message));       	
			}).catch(err => this.fileOpener.open(filePdf, 'application/pdf').catch(e => console.log('File didn\'t open: ' + e.message)));       	
		}
	}

}
