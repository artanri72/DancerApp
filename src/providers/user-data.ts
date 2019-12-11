import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CONFIG } from '../config/config';
import { Observable } from 'rxjs/observable'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  endpoint: string = CONFIG.apiEndpoint;

  constructor(
    public events: Events,
    public storage: Storage,
    public http: Http
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(user: any) {
    // this.storage.set(this.HAS_LOGGED_IN, true);
    // this.setUsername(user);
    // this.events.publish('user:login');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.endpoint + 'api/signin', user, options)
      .map(res => res.json())

  };

  signup(user: any):Observable<any> {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(user.name);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.endpoint + 'api/signup', user, options)
      .map(res => res.json())

  };

  socialLogin(user: any, accType: string):Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    if(accType == 'facebook') {
      return this.http.post(this.endpoint + 'auth/facebook/mobile', user, options)
      .map(res => res.json())
    } else if(accType == 'google') {
      console.log('google login...',JSON.stringify(user))
      return this.http.post(this.endpoint + 'auth/google_auth/mobile', user, options)
      .map(res => res.json())
    }else {
      console.log("error: didn't get any social account info");
    }
  }

  getCurrentUser(token: any):Observable<any> {
    let headers = new Headers({ 'Authorization': 'Bearer '+token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.endpoint + 'api/me', options)
    .map(res => res.json())
  }


  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.storage.remove('userToken');
    this.storage.remove('currentUserData');
    this.events.publish('user:logout');
  };

  setUserToken(token: string): void {
    this.storage.set('userToken', token);
  }

  getUserToken(): Promise<string> {
    return this.storage.get('userToken').then((value) => {
      return value;
    });
  };

  setUserData(userData: any) {
    this.storage.set('currentUserData',userData);
  };

  getUserData(): Promise<string> {
    return this.storage.get('currentUserData').then((value) => {
      return value;
    });
  };

  //-------------- user authentication functions end ----------------//
  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
