import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { Toast } from '@ionic-native/toast';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
	selector: 'page-reset',
	templateUrl: 'reset.html',
})
export class ResetPage {

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

	async resetPwd(user) {
		try {
			await this.afAuth.auth.sendPasswordResetEmail(user.email).then(e => {
				this.toast.show('Đã gửi email để đặt lại mật khẩu', '5000', 'center').subscribe(toast => console.log(toast));
				this.navCtrl.push(LoginPage);
			}).catch(e => this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast)));	
		}
		catch(e) {
			this.toast.show(e.message, '5000', 'center').subscribe(toast => console.log(toast));	
		}
	}


}