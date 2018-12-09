import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { Toast } from '@ionic-native/toast';

import { InfoIdentityPage } from '../info-identity/info-identity';

declare var cv: any;

@IonicPage()
@Component({
	selector: 'page-image-identity-back',
	templateUrl: 'image-identity-back.html',
})
export class ImageIdentityBackPage {

	pictureFront = this.navParams.get('pictureFront');
	pictureBack = this.navParams.get('pictureBack');
	imagename = this.navParams.get("imagename");
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	thisDate: String = new Date().toISOString();
	images:any = [];
	image = { name:"", date:this.thisDate, path:"", base64:"", type:"image/png", upload:0 };  
	sortableContour = [];
	hide : boolean = false;

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private file: File,
		private sqlite: SQLite,
		private auth: AuthService,
		private toast: Toast,
		) {
	}

	showDiv(){
		this.hide = true;
	}

	hideDiv(){
		this.hide = false;
	}

	ionViewWillEnter() {
		this.initialize();
	}    

	initialize() {
		let src = cv.imread('imgIDBack');
		cv.imshow('canvasOutputIDBack', src);
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
		this.file.writeFile(folderPath, fileName, DataBlob).catch(e => console.log('File didn\'t save: ' + e.message));       
	}    

	saveImage(){
		let canvas = document.getElementById('canvasOutputIDBack') as HTMLCanvasElement;
		this.pictureBack = canvas.toDataURL();  
		let base = this.pictureBack.substr(this.pictureBack.lastIndexOf(',')+1);
		let nameFile = this.image.name + '.' + 'png';
		if (this.data != null) { 
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Chứng minh thư' + '.' + nameEmail;                        
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {                
				db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?,3)', [this.image.name,this.image.date,folderPath,this.pictureBack,this.image.type,this.image.upload]).then(res => {
					this.savebase64AsFile(folderPath, nameFile, base, this.image.type); 
					this.navCtrl.push(InfoIdentityPage,{
						pictureFront:this.pictureFront,
						pictureBack:this.pictureBack,
						imagename:this.imagename
					}); 
				}).catch(e => { this.toast.show('Trùng tên ảnh', '5000', 'center').subscribe(toast => console.log(toast))});                   
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));                     
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Chứng minh thư' + '.' + namePhone;
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {                
				db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?,3)', [this.image.name,this.image.date,folderPath,this.pictureBack,this.image.type,this.image.upload]).then(res => {
					this.savebase64AsFile(folderPath, nameFile, base, this.image.type); 
					this.navCtrl.push(InfoIdentityPage,{
						pictureFront:this.pictureFront,
						pictureBack:this.pictureBack,
						imagename:this.imagename
					}); 
				}).catch(e => { this.toast.show('Trùng tên ảnh', '5000', 'center').subscribe(toast => console.log(toast))});                   
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));   
		}                  
	}
	
	rotateRight() {
		let src = cv.imread('imgIDBack');
		let dsize = new cv.Size(src.rows, src.cols);         
		let center = new cv.Point(src.rows/2, src.rows/2); 
		let M = cv.getRotationMatrix2D(center, -90, 1);
		cv.warpAffine(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
		cv.imshow('canvasOutputIDBack', src);
		let canvasOutput = document.getElementById('canvasOutputIDBack') as HTMLCanvasElement;
		let picture = document.getElementById("imgIDBack") as HTMLImageElement;       
		picture.src = canvasOutput.toDataURL();
		src.delete(); M.delete();
	}

	rotateLeft() {
		let src = cv.imread('imgIDBack');
		let dsize = new cv.Size(src.rows, src.cols);
		let center = new cv.Point(src.cols/2, src.cols/2); 
		let M = cv.getRotationMatrix2D(center, 90, 1);
		cv.warpAffine(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
		cv.imshow('canvasOutputIDBack', src);
		var canvasOutput = document.getElementById('canvasOutputIDBack') as HTMLCanvasElement;
		let picture = document.getElementById("imgIDBack") as HTMLImageElement;
		picture.src = canvasOutput.toDataURL();
		src.delete(); M.delete();
	} 

	origin(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		light.setAttribute("style", "border: none;");
		origin.setAttribute("style", "border: 1px solid black;");
		gray.setAttribute("style", "border: none;");
		bw.setAttribute("style", "border: none;");
		let src = cv.imread('imgIDBack');
		cv.imshow('canvasOutputIDBack', src);
		src.delete();
	}

	light(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		origin.setAttribute("style", "border: none;");
		light.setAttribute("style", "border: 1px solid black;");
		gray.setAttribute("style", "border: none;");
		bw.setAttribute("style", "border: none;");
		let src = cv.imread('imgIDBack');
		let dst = new cv.Mat();
		let M = cv.Mat.eye(2, 2, cv.CV_32FC1);
		let anchor = new cv.Point(-1, -1);
		cv.filter2D(src, dst, cv.CV_8UC3, M, anchor, 0, cv.BORDER_DEFAULT);
		cv.imshow('canvasOutputIDBack', dst);
		src.delete(); dst.delete(); M.delete();
	}

	gray(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		origin.setAttribute("style", "border: none;");
		gray.setAttribute("style", "border: 1px solid black;");
		light.setAttribute("style", "border: none;");
		bw.setAttribute("style", "border: none;");
		let src = cv.imread('imgIDBack');
		let dst = new cv.Mat();
		cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
		cv.imshow('canvasOutputIDBack', dst);
		src.delete(); dst.delete(); 
	}

	bw(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		origin.setAttribute("style", "border: none;");
		bw.setAttribute("style", "border: 1px solid black;");
		light.setAttribute("style", "border: none;");
		gray.setAttribute("style", "border: none;");
		let src = cv.imread('imgIDBack');
		let dst = new cv.Mat();
		cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
		cv.adaptiveThreshold(src, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 12);
		cv.imshow('canvasOutputIDBack', dst);
		src.delete(); dst.delete(); 
	}
}
