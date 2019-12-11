import { Component, ViewChild } from '@angular/core';

import { AlertController, App, ItemSliding, List, ModalController, Platform, NavController, ToastController, LoadingController, Refresher, ActionSheetController,Tabs } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

import { File } from '@ionic-native/file';

// import { MusicPlayerPage } from '../music-player/music-player';
import { CuesProvider } from '../../providers/cues/cues';
import { TabDataProvider } from "../../providers/tab-data/tab-data";
import { TracksProvider } from "../../providers/tracks/tracks";

@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {

  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'local';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,

    public platform: Platform,
    private _file: File,

    public actionSheetCtrl: ActionSheetController,
    public userData: UserData,
    public Cues: CuesProvider,
    public tabDataProvider: TabDataProvider,
    public tracks: TracksProvider
  ) {}

  currentUser: string;
  userToken: string;
  cues: any;
  loading_media: any = null;

  ionViewDidLoad() {
    this.Init();
    this.app.setTitle('Library');
    this.updateSchedule();
  }

  async Init() {
    try{

      let userToken = await this.userData.getUserToken();
      this.userToken = userToken;

      let userInfo = await this.userData.getUserData();
      this.currentUser = userInfo;

      await this.Cues.loadFromStorage();

      console.log(JSON.stringify(this.userToken));
      console.log(JSON.stringify(this.currentUser));
    }catch(err) {
      console.log(JSON.stringify(err));
    }

  }

  ionViewWillEnter() {
    this.showLoading(10000);
    this.getCuesAll();
  }

  getCuesAll() {
    this.cues = this.Cues.all();
    this.loading_media.dismiss();
  }

  playMedia(cueId) {
    var t: Tabs = this.navCtrl.parent;
    this.tabDataProvider.cueId = cueId;
    t.select(0);
  }

  // ----- EDIT ITEM ----- //

  editItem(cue) {
    console.log(cue);
    let filepath = null;
    if (this.platform.is('ios')) {
      filepath = this._file.documentsDirectory;

    } else if (this.platform.is('android')) {
      filepath = "file://" + cue.path.substr(0, cue.path.length - cue.filename.length);
    }

    this.checkFileAndEditCue(filepath, cue.filename)
  }

  checkFileAndEditCue(filepath, filename) {
    this._file.checkFile(filepath, filename).then(_ => this.editCue(filename))
      .catch((err) => {
        this.noFileEditCue(filename);
        this.defaultToast('no file on device', 1500, 'middle')
        console.log('check file to load failed: ' + JSON.stringify(err))
      });
  }

  // --- DELETE CUE --- //

  deleteCue(trackId) {
    this.tracks.deleteUserTrackByTrackId(trackId, this.userToken).subscribe((res: any) => {
      if (res) {
        console.log(JSON.stringify(res))
      }
    }, (err) => {
      console.log(JSON.stringify(err))
    });
  }

  //--- ASSETS ---- //
  showLoading(time) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: "Loading Cues...",
      duration: time
    });
    this.loading_media = loading;
    loading.present();
  }

  defaultToast(message, duration, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  editCue(filename) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Edit Item',
      subTitle: filename,
      buttons: [
        {
          text: 'Link Media',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  noFileEditCue(filename) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Edit Item',
      subTitle: filename,
      buttons: [
        {
          text: 'Link Media',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  // -------------- //

  updateSchedule() {

  }

  goToSessionDetail() {
  }

  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.userData.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.userData.addFavorite(sessionData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.userData.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  doRefresh(refresher: Refresher) {

      this.cues = this.Cues.all();
      setTimeout(() => {
        refresher.complete();
      }, 1000);

  }

}
