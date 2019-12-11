import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;
  password: string;

  constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData) {

  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    let alert = this.alertCtrl.create({
      title: 'Change Password',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'password',
      value: this.password,
      type: 'password',
      placeholder: 'password'
    });
    alert.addInput({
      name: 'conformpassword',
      type: 'password',
      value: this.password,
      placeholder: 'conformpassword'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot('LoginPage');
  }

}
