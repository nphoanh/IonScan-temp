import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';

import { CropIdentityPage } from '../crop-identity/crop-identity';

@IonicPage()
@Component({
	selector: 'page-identity',
	templateUrl: 'identity.html',
})
export class IdentityPage {

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private cameraPreview: CameraPreview
		) {
	} 

	ionViewDidLoad() {
		this.initializeCamera();
	}

	initializeCamera(){
		const cameraPreviewOpts: CameraPreviewOptions = {
			x: 0,
			y: 0,
			width: window.screen.width,
			height: window.screen.height,
			camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
			toBack: true,
			tapPhoto: false,
			tapToFocus: true,
			previewDrag: false
		};
		this.cameraPreview.startCamera(cameraPreviewOpts).then(
			(res) => {
				console.log(res)
			},
			(err) => {
				console.log(err)
			});
	}

	takePicture(){        
		const pictureOpts: CameraPreviewPictureOptions = {
			width: window.screen.width,
			height: window.screen.height,
			quality: 100
		}
		this.cameraPreview.takePicture(pictureOpts).then((imageData) => {  
			var rect = <HTMLDivElement> document.getElementById('rect');
			var rect_coords = rect.getBoundingClientRect();
			var x_coord = rect_coords.left, y_coord = rect_coords.top;
			var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;
			this.crop(imageData, rect_width, rect_height, x_coord, y_coord, cropped_img_base64 => {
				this.navCtrl.push(CropIdentityPage, {pictureFront:cropped_img_base64});
				this.cameraPreview.stopCamera();
			});
		}, (err) => {
			console.log(err);
		});
	}

	crop(imageData, rect_width, rect_height, x_coord, y_coord, callback) {
		var image = new Image();
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		image.src = 'data:image/png;base64,' + imageData;
		image.onload = function() {
			var x_axis_scale = image.width / window.screen.width
			var y_axis_scale = image.height / window.screen.height
			var x_coord_int = x_coord * x_axis_scale;
			var y_coord_int = y_coord * y_axis_scale;
			var rect_width_int = rect_width * x_axis_scale;
			var rect_height_int = rect_height * y_axis_scale
			canvas.width = rect_width_int;
			canvas.height = rect_height_int;
			ctx.drawImage(image, x_coord_int, y_coord_int, rect_width_int, rect_height_int, 0, 0, rect_width_int, rect_height_int);   
			var cropped_img_base64 = canvas.toDataURL();
			callback(cropped_img_base64);
			return cropped_img_base64;
		};
	};

	flashModeOn(){
		var button_flash_on = document.getElementById('button_flash_on');
		var button_flash_off = document.getElementById('button_flash_off');
		button_flash_on.style.visibility = "hidden";
		button_flash_off.style.visibility = "";
		var flash_mode = 'on';
		this.cameraPreview.setFlashMode(flash_mode);
	}

	flashModeOff(){
		var button_flash_on = document.getElementById('button_flash_on');
		var button_flash_off = document.getElementById('button_flash_off');
		button_flash_on.style.visibility = "";
		button_flash_off.style.visibility = "hidden";
		var flash_mode = 'off';
		this.cameraPreview.setFlashMode(flash_mode);
	}

}

