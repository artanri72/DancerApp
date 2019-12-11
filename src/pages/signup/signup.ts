import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, ToastController, Events } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  user: UserOptions = { name: '',email: '', password: '',confirmPassword:'' };
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userData: UserData, 
    public toastCtrl: ToastController,
    public events: Events ) {}

  onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid && (this.user.password == this.user.confirmPassword)) {
      this.userData.signup(this.user).subscribe((res: any) => {
        if(res.token) {
          this.presentToast('registered successfully')
          this.navCtrl.push(LoginPage);
        } else {
          this.presentToast(res.error.message)
        }
      },
      (err) => {
        this.presentToast("failed signup")
        console.log(err)
      });
    }
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  
}
