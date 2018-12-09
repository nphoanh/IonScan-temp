import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ImagePage } from '../image/image';

declare var cv: any;

@IonicPage()
@Component({
	selector: 'page-crop-image',
	templateUrl: 'crop-image.html',
})
export class CropImagePage {

	picturePick = this.navParams.get('picture');
	folderid = this.navParams.get('folderid');
	foldername = this.navParams.get('foldername');
	sortableContour = [];
	largest_contour_index = 0;
	largest_area=0;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams
		) {
	}

	ionViewWillEnter() {
		this.draw();
	}

	draw() {
		let image = cv.imread('imageCropPick');
		let gray = new cv.Mat();
		let edge = new cv.Mat();
		cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);
		let ksize = new cv.Size(5, 5);
		cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);
		cv.Canny(gray, edge, 75, 200, 3, false);
		let M = cv.Mat.ones(3, 3, cv.CV_8U);
		let anchor = new cv.Point(-1, -1);
		cv.dilate(edge, edge, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
		let contours = new cv.MatVector();
		let hierarchy = new cv.Mat();
		cv.findContours(edge, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
		for (let i = 0; i < contours.size(); i++) {
			let cnt = contours.get(i);
			let a=cv.contourArea(cnt,false); 
			if(a>this.largest_area){
				this.largest_area=a;
				this.largest_contour_index=i;              				
			}  			   
		}
		let color = new cv.Scalar(255,255,0);
		cv.drawContours(image, contours, this.largest_contour_index, color, 3, cv.LINE_8, hierarchy, 100);		   		
		cv.imshow('canvasOutputCropPick', image);
		image.delete(); gray.delete(); edge.delete(); M.delete(); contours.delete(); hierarchy.delete();
	}

	crop() {
		let image = cv.imread('imageCropPick');
		let gray = new cv.Mat();
		let edge = new cv.Mat();
		let finalDest = new cv.Mat();
		cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);
		let ksize = new cv.Size(5, 5);
		cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);
		cv.Canny(gray, edge, 75, 200, 3, false);
		let M = cv.Mat.ones(3, 3, cv.CV_8U);
		let anchor = new cv.Point(-1, -1);
		cv.dilate(edge, edge, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
		let contours = new cv.MatVector();
		let hierarchy = new cv.Mat();
		cv.findContours(edge, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
		let sortableContours = this.sortableContour;
		for (let i = 0; i < contours.size(); i++) {
			let cnt = contours.get(i);
			let area = cv.contourArea(cnt, false);
			let perim = cv.arcLength(cnt, false);
			this.sortableContour.push({ areaSize: area, perimiterSize: perim, contour: cnt });
		}
		sortableContours = sortableContours.sort((item1, item2) => { return (item1.areaSize > item2.areaSize) ? -1 : (item1.areaSize < item2.areaSize) ? 1 : 0; }).slice(0, 5);
		let approx = new cv.Mat();
		cv.approxPolyDP(sortableContours[0].contour, approx, .05 * sortableContours[0].perimiterSize, true);
		let foundContour = null;
		if (approx.rows == 4) {
			console.log('Found a 4-corner approx');
			foundContour = approx;
		}
		else{
			console.log('No 4-corner large contour!');
			return;
		}
		let corner1 = new cv.Point(foundContour.data32S[0], foundContour.data32S[1]);
		let corner2 = new cv.Point(foundContour.data32S[2], foundContour.data32S[3]);
		let corner3 = new cv.Point(foundContour.data32S[4], foundContour.data32S[5]);
		let corner4 = new cv.Point(foundContour.data32S[6], foundContour.data32S[7]);
		let cornerArray = [{ corner: corner1 }, { corner: corner2 }, { corner: corner3 }, { corner: corner4 }];
		cornerArray.sort((item1, item2) => { return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0; }).slice(0, 5);
		let tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
		let tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
		let bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
		let br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
		let widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
		let widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
		let theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
		let heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
		let heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
		let theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;
		let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1]); //
		let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y]);
		let dsize = new cv.Size(theWidth, theHeight);
		let N = cv.getPerspectiveTransform(srcCoords, finalDestCoords)
		cv.warpPerspective(image, finalDest, N, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());       
		cv.imshow('canvasOutputCropPick', finalDest);
		let canvas = document.getElementById('canvasOutputCropPick') as HTMLCanvasElement;
		this.picturePick =  canvas.toDataURL();			
		image.delete(); gray.delete(); edge.delete(); M.delete(); contours.delete(); hierarchy.delete(); 
		finalDest.delete(); approx.delete(); finalDestCoords.delete(); srcCoords.delete();
	}

	saveImage(){
		this.navCtrl.push(ImagePage,{
			picture:this.picturePick,
			folderid:this.folderid,
			foldername:this.foldername
		});
	}
}
