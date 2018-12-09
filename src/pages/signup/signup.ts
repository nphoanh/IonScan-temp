import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Toast } from '@ionic-native/toast';

import { LoginPage } from '../login/login';
 
@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {

	user = {} as User;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private afAuth: AngularFireAuth,
		private toast: Toast,
		public menuCtrl:MenuController
		) {		
		this.menuCtrl.enable(false, 'myMenu');
	}

	async signup(user: User) {
		try {
			await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then(e => {
				let users = firebase.auth().currentUser;
				users.sendEmailVerification().then(e => {						
					this.toast.show('Đã gửi email xác thực', '5000', 'center').subscribe(toast => console.log(toast));
					this.navCtrl.push(LoginPage);
				}).catch(e => this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast)));	
			}).catch(e => this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast)));	
		}
		catch(e) {
			this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast));	
		}
	}

}
