import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, AlertController, ToastController, LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { name: '', password: 'batman',email: 'test@user.com',confirmPassword: '' };
  submitted = false;
  fbUserData = null;
  googleUserData = null;
  bTest = false;
  loading_ctrl = null;
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  currentUser: any;

  constructor(
    public navCtrl: NavController,
    public forgotPasswordCtrl: AlertController,
    public userData: UserData,
    public toastCtrl: ToastController,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    public loadingCtrl: LoadingController,
    public events: Events,
    public storage: Storage
    ) { }

  onLogin(form: NgForm) {
    this.submitted = true;
    this.showPlayLoader(10000)
    if (this.bTest) {
      this.userData.setUserToken("res.token");
      this.navCtrl.push(TabsPage);
      return;
    }

    if (form.valid) {
      //this.userData.login(this.login.name);
      this.userData.login(this.login).subscribe((res: any) => {
        console.log('-----> ', res);
        if(res.token) {
          this.loading_ctrl.dismiss();
          this.presentToast('login successfully');
          this.userData.setUserToken(res.token);
          this.setCurrentUserData(res.token);
          this.events.publish('user:login');
          this.navCtrl.push(TabsPage);
        } else {
          this.presentToast(res.error.message)
        }
      },
      (err) => {
        this.presentToast("Wrong email and/or password")
        console.log(err)
      });
    }
  }

  setCurrentUserData(userToken: string) {
    this.userData.getCurrentUser(userToken).subscribe((res: any) => {
      var keys = Object.keys(res);
      if(keys.length > 0) {
        this.currentUser = res;
        this.userData.setUserData(this.currentUser);
      }else {
        console.log('no userData');
      }
    },
    (err) => {
      console.log(err)
    });
  }

  socialLogin(type) {
    if(type == "google") {
      this.showPlayLoader(10000)
      this.googlePlus.login({})
      .then(res => {
        this.loading_ctrl.dismiss();
        this.googleUserData = {
          google: res.userId,
          email: res.email,
          picture: res.imageUrl,
          name: res.displayName
        }
        this.userData.socialLogin(this.googleUserData, 'google').subscribe((res:any) => {
          if(res.token) {
            this.presentToast('google login successfully');
            this.events.publish('user:login');
            this.userData.setUserToken(res.token);
            this.navCtrl.push(TabsPage);
          } else {
            this.presentToast(res.error.message);
          }
        },
        (err) => {
          this.presentToast("Wrong email and / or password")
          console.log(err)
        })
      })
      .catch(err => console.error(err));
    } else if(type == "facebook") {
      this.showPlayLoader(10000)
      this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
        this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
        .then(profile => {
          this.loading_ctrl.dismiss();
          this.fbUserData = {
            email: profile['email'],
            first_name: profile['first_name'],
            picture: profile['picture_large']['data']['url'],
            username: profile['name'],
            userID: response.authResponse.userID
          }
          this.userData.socialLogin(this.fbUserData, 'facebook').subscribe((res: any) => {
            if(res.token) {
              this.presentToast('facebook login successfully');
              this.events.publish('user:login');
              this.userData.setUserToken(res.token);
              this.navCtrl.push(TabsPage);
            } else {
              this.presentToast(res.error.message)
            }
          },
          (err) => {
            this.presentToast("Wrong email and/or password")
            console.log(err)
          });

        })
        .catch(err => {
          if(err) {
            this.presentToast("Failed social login")
          }
        });
      })
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  forgotPassword() {
    let prompt = this.forgotPasswordCtrl.create({
      title: 'Forgot Password',
      message: "Enter a email to get new password",
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
        {
          name: 'new_password',
          placeholder: 'new password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked', data);
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log('Saved clicked',data);
          }
        }
      ]
    });
    prompt.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  showPlayLoader(time) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...',
      duration: time
    });
    this.loading_ctrl = loading;
    loading.present();
  }

}
