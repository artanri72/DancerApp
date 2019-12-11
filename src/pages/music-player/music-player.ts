import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ToastController, AlertController, Events, FabContainer } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import _ from 'lodash';
import moment from 'moment';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { FilePath } from '@ionic-native/file-path';
import { Storage } from '@ionic/storage';
import { Insomnia } from '@ionic-native/insomnia';
import { BackgroundMode } from '@ionic-native/background-mode';
// import { Dialogs } from '@ionic-native/dialogs';

import { UserData } from '../../providers/user-data';
import { TracksProvider } from '../../providers/tracks/tracks';
import { CuesProvider } from '../../providers/cues/cues';
import { MediaSrvProvider } from '../../providers/media-srv/media-srv';
import { TabDataProvider } from "../../providers/tab-data/tab-data";

@Component({
  selector: 'page-music-player',
  templateUrl: 'music-player.html',
})

export class MusicPlayerPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: Media,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private device: Device,
    public alertCtrl: AlertController,
    private fileChooser: FileChooser,
    private filePicker: IOSFilePicker,
    private _filePath: FilePath,
    private _file: File,
    public storage: Storage,
    public insomnia: Insomnia,
    public backgroundMode: BackgroundMode,
    // public dialogs: Dialogs,
    public userData: UserData,
    public tracks: TracksProvider,
    public Cues: CuesProvider,
    public MediaSrv: MediaSrvProvider,
    public events: Events,
    public tabDataProvider: TabDataProvider
  ) {
    this.Init();
    // this.clearMediaSrc();
    this.listenToLoginEvents();
    // this.saveBase64AsAudioFile();
  }

  file: MediaObject;
  filePath: string;
  userToken: string;
  currentUser: any;
  mStatus: number = 0;
  playBtnStatus: boolean = true;
  moment: any;

  mediaTimer: any;
  getDurationTime: any;
  currentMedia: any;
  currentMedia5678: any;
  selectedMarker: number = 0;
  selectedMarkerIndex: number = 0;
  repeatBtnStatus: boolean = false;
  timeElapsed: number;
  cue: any;
  prevCue: any;
  fileDuration: number = 0;
  loading_media: any = null;
  cuePopupStatus: boolean = false;
  cuePopupIndex: number = 0;
  cueLongPressing: boolean = false;
  cueId: string = null;



  getCurrentUser() {
    this.userData.getUserToken().then((userToken) => {
      this.userToken = userToken;
      this.userData.getCurrentUser(this.userToken).subscribe((res: any) => {
        var keys = Object.keys(res);
        if (keys.length > 0) {
          this.currentUser = res
        } else {
          console.log('no userData');
        }
      },
        (err) => {
          console.log(err)
        });
    })
  }

  clearMediaSrc() {

    this.currentMedia = this.MediaSrv.unloadMedia(this.currentMedia);
    this.cue = {
      markers: [0]
    };
    this.timeElapsed = 0;
    this.selectedMarker = 0;
    this.cueId = null;
    if (this.mediaTimer) {
      // clearInterval(this.mediaTimer);
      clearTimeout(this.mediaTimer);
    }
  }

  // ----------- PLAYER -------------

  // playWithTimer() {
  //   // this.currentMedia.play();
  //   this.setupMediaTimer();
  // }

  // setupMediaTimer() {
  //   this.mediaTimer = setInterval(function () {
  //     // get media position
  //     this.currentMedia.getCurrentPosition(
  //       //success callback
  //       function (position) {
  //         if (position > -1) {
  //           this.timeElapsed = Math.round(position);
  //         }
  //       },
  //       //error callback
  //       function (e) {
  //         console.log('Error getting pos=' + e);
  //       }
  //     );
  //     this.timeElapsed++;
  //   }, 1000);
  // }

  clearMedia() {
    this.cue = {
      markers: [0]
    };
    this.timeElapsed = 0;
    this.selectedMarker = 0;
    this.fileDuration = 0;
  }

  clearMarkers(fab: FabContainer) {
    fab.close();
    this.cue.markers = [0];
    this.cue.min_markers = [0];
    this.selectedMarker = 0;
  }

  // ---------- FILE CHOOSE -------------
  onFail(e) {
    this.clearMediaSrc();
    if (this.prevCue && this.prevCue.path) {
      this.cue = Object.assign({}, this.prevCue);
      this.defaultHandler(this.prevCue.path);
    }
    this.defaultToast(e, 2000, 'middle')
    console.log('On fail ', JSON.stringify(e));
  }

  async defaultHandler(data) {

    if (this.cue.filename == undefined || this.cue.filename == '') {
      if (this.platform.is('android')) {

        let url = await this._filePath.resolveNativePath(data);

        this.cue.path = url.replace(/file:\/\//g, '');

        let fileInfo = await this._file.resolveLocalFilesystemUrl(url);

        this.cue.filename = fileInfo.name;
      }
      if (this.platform.is('ios')) {

        let filename = _.split(data, 'Inbox/')[1];
        this.cue.filename = filename;
        this.cue.path = data;
      }
    }
    console.log('debug 1 ============== >', JSON.stringify(this.cue))
    // this.cue.path = "/Users/doronin/Library/Developer/CoreSimulator/Devices/7AE61619-BC07-4846-9A28-CA626AF6C7D5/data/Containers/Data/Application/4C47FCD1-3E8B-4CA1-BA60-7C802AC4FD1C/tmp/appv2.dancersq.com-Inbox/Best English Songs Acoustic 2018 Hit Covers New song 2018 Music PlaylistTop 100 Romantic Song.mp3";
    this.loadMedia(this.cue);
  }

  successCallback(data) {

    // this.showLoading(10000)
    this.clearMediaSrc();
    //ios
    if (Array.isArray(data)) {
      data = data[0].exportedurl;
      data = data.replace('file://', '/');
      data = decodeURI(data);
    }

    var ques = this.Cues.all();

    if (ques.length > 0) {
      var existingTrack: any = _.find(ques, { path: data });
      if (existingTrack) {
        this.cue.id = existingTrack.id;
        this.cue.path = existingTrack.path;
        this.cue.filename = existingTrack.filename;
        this.cue.markers = existingTrack.markers;
        this.cue.duration = existingTrack.duration;
        this.loadMedia(this.cue);
        return;
      }
    }
    //get data from server API
    this.tracks.getUserTrackByPath(this.currentUser._id, data, this.userToken).subscribe((res: any) => {
      if (res.track) {
        this.cue.path = res.track.path;
        this.cue.markers = res.track.markers;
        this.cue.filename = res.track.filename;
        this.cue.duration = res.track.duration;
        this.Cues.update(this.cue);
        this.loadMedia(this.cue);
      } else {
        this.defaultHandler(data);
      }
    }, (err) => {
      console.log(JSON.stringify(err))
      this.defaultHandler(data);
    });

  }

  async chooseFile(fab: FabContainer) {
    this.clearMediaSrc();
    this.fileDuration = 0;
    this.prevCue = Object.assign({}, this.cue);
    // this.showPlayLoader(2000);
    try {

      let uri;
      if (this.platform.is('android')) {
        uri = await this.fileChooser.open();
      }
      if (this.platform.is('ios')) {
        uri = await this.filePicker.pickFile();
      }

      this.successCallback(uri);
      fab.close();
    } catch (err) {
      this.onFail(err);
    }
  }

  // ---------------- CREATE/LOAD MEDIA PLARR ----------------------
  loadMedia(cue) {
    // this.clearMediaSrc();
    this.MediaSrv.unloadMedia(this.currentMedia);
    if (this.platform.is('ios')) {
      if (!cue.path.includes('tmp/')) {
        let path = this._file.documentsDirectory.replace(/file:\/\//g, '') + this.cue.filename;
        cue.path = path;
        console.log('loadmedia=============>', cue.path)
      }
    }
    this.currentMedia = this.media.create(cue.path);

    this.onFilePickerSuccess();
    this.onMediaStatusHandler(this.currentMedia);

  }

  onFilePickerSuccess() {
    console.log('current cue==========================>', JSON.stringify(this.cue))
    console.log('current media =======================>', JSON.stringify(this.currentMedia));

    this.showLoading(10000);
    let context = this;
    //this.playBtnStatus = false;
    this.currentMedia.play();

    this.currentMedia.setVolume(0);

    this.getDurationTime = setTimeout(function () {
      // get file duration
      context.fileDuration = context.currentMedia.getDuration() * 1000;
      context.currentMedia.pause();
      context.playBtnStatus = true;
      context.loading_media.dismiss();



      console.log('=== file duration ===', context.fileDuration);
    }, 1000);
  }

  // -------------- SAVE TRACK ----------------
  save(fab: FabContainer) {
    var _fab = fab;
    if (this.currentMedia == null) {
      return;
    }
    var deviceInfo = {
      id: this.device.uuid,
      model: this.device.model,
      platform: this.device.platform,
      version: this.device.version
    }

    let uri = this.cue.path;
    let filename = uri.substr(uri.lastIndexOf('/') + 1);
    let filePath = uri.substr(0, uri.length - filename.length);

    let src_path = filePath;
    let dest_path = filePath;

    if (this.platform.is('ios')) {
      src_path = "file://" + filePath;
      dest_path = this._file.documentsDirectory;

      console.log('deviceInfo :===>', JSON.stringify(deviceInfo), JSON.stringify(this.cue));
      console.log('src_path===>' + src_path);
      console.log("dest_path===>" + dest_path);
      console.log("filename===>" + filename);

      this._file.copyFile(src_path, this.cue.filename, dest_path, this.cue.filename)
        .then(_ => console.log('copy done')).catch(err => console.log('copy failed: ' + JSON.stringify(err)));
    }

    this.tracks.saveTrack(
      this.cue.id, {
        filename: filename,
        path: dest_path + filename,
        markers: this.cue.markers,
        duration: this.fileDuration,
        device: deviceInfo
      },
      this.userToken
    ).subscribe((res: any) => {

      this.defaultToast('Markers saved!', '1500', 'middle');
      this.cue.id = res.track._id;
      this.Cues.update(this.cue);

      _fab.close();

    }, (err) => {
      console.log(JSON.stringify(err))
      this.defaultToast('Markers was not saved!', '1500', 'middle');
    });
  }



  // --------------- PLAYER MEDIA ----------------------------- //
  playMedia() {

    if (this.currentMedia == null) {
      this.defaultToast('Please select music file', '2000', 'bottom');
      return;
    }

    // Pause if already playing or starting
    if (this.currentMedia.mediaStatus == 1 || this.currentMedia.mediaStatus == 2) {
      this.insomniaAllowSleep();
      this.backgroundMode.disable();
      this.currentMedia.pause();
      return;
    }
    //Paused
    if (this.currentMedia.mediaStatus == 3 || this.currentMedia.mediaStatus == 4) {
      this.backgroundMode.enable();
      this.insomniaKeepAwake();
      this.currentMedia.play();
    }

    // this.currentMedia.play();
    this.currentMedia.setVolume(1);

    this.setupMediaTimerProgressbar(this);
  }

  setupMediaTimerProgressbar(obj) {

    let self = obj;
    self.mediaTimerProgressbar(self);
    if (self.mediaTimer) {
      clearTimeout(self.mediaTimer);
      self.mediaTimer = null;
    }
    self.mediaTimer = setTimeout(self.setupMediaTimerProgressbar, 1000, self);
  }

  mediaTimerProgressbar(context) {
    console.log('setupMediaTimerprogressbar before======>')
    context.currentMedia.getCurrentPosition().then((position) => {
      if (position < 0) return;

      // context.timeElapsed = position * 1000;
      context.timeElapsed = Math.round(position) * 1000;
      // Loop Mode for markers
      if (context.repeatBtnStatus == true) {

        let startRepeatTime = context.selectedMarker * 1000;
        let endRepeatTime = context.cue.markers[context.selectedMarkerIndex + 1] * 1000;

        if (startRepeatTime == 0 || context.currentMedia.mediaStatus != 2) {
          context.repeatBtnStatus = false;
        } else {
          if (context.timeElapsed > startRepeatTime && context.timeElapsed < endRepeatTime) {
            if (context.timeElapsed > endRepeatTime - 1000) {

              //Back to previous marker after 1 second of a pause.
              context.currentMedia.pause();
              context.currentMedia.seekTo(startRepeatTime);

              setTimeout(function () {
                context.currentMedia5678.play();
                setTimeout(function () {
                  context.currentMedia.play();
                }, 1900);
              }, 500);

            }
          }
        }
      }

    }).catch((err) => { console.log('getCurrentPosition===>', JSON.stringify(err)) });
  }

  sortNumber(a, b) {
    return a - b;
  }


  async capturePosition() {
    if (this.currentMedia == null) {
      this.defaultToast("Please select music file", '2000', "bottom");
      return;
    }
    if (this.mStatus == 2) {

      let position = await this.currentMedia.getCurrentPosition();
      if (Boolean(this.cue.markers.filter(m => Math.round(position) === Math.round(m)).length)) return;

      if (this.cue.markers.indexOf(position) == -1) {
        this.cue.markers.push(position);
        this.cue.markers.sort(this.sortNumber)
      }
      console.log("capturePosition =================== > ", position);

    }
  }

  convertMinutes(miliseconds) {
    let minutes = moment.duration(miliseconds).minutes();
    return minutes;
  }

  convertSeconds(seconds) {
    let _seconds = seconds % 60;
    return _seconds;
  }

  playMarkerPosition(marker) {
    if (this.currentMedia == null) {
      this.defaultToast('Please select music file', '2000', 'bottom');
      return;
    }

    let pos = marker * 1000;
    this.currentMedia.pause();
    this.currentMedia.seekTo(pos);
    this.currentMedia.play();
  }

  markerOnDragLeft(marker) {
    if (marker == 0) {
      return;
    }
    if (this.cue.markers.indexOf(marker) != -1) {
      this.cue.markers.splice(this.cue.markers.indexOf(marker), 1);
    }
  }

  longPress(index,marker) {
    if (marker == 0) {
      return;
    }
    this.cueLongPressing = true;
    this.cuePopupIndex = index;

    this.cuePopupStatus = !this.cuePopupStatus;
  }

  popupDisappear() {
    this.cuePopupStatus = !this.cuePopupStatus;
  }

  cuePopup(direction, i) {
    let neighbor = (direction == 'left') ? Math.round(this.cue.markers[i - 1]) + 1 : Math.round(this.cue.markers[i + 1]) - 1;
    if (Math.round(this.cue.markers[i]) == neighbor) {
      this.cuePopupStatus = false;
      return;
    }

    this.cue.markers[i] = (direction == 'left') ? this.cue.markers[i] - 1 : this.cue.markers[i] + 1;
    this.cue.markers.sort(this.sortNumber);
  }

  selectMarker(marker, index) {
    if (this.currentMedia == null) {
      return;
    }

    if (!this.cueLongPressing)
      this.cuePopupStatus = false;
    else
      this.cueLongPressing = false;


    this.selectedMarkerIndex = index;
    this.selectedMarker = marker;
    let pos = this.selectedMarker * 1000;
    this.currentMedia.seekTo(pos);
    this.insomniaKeepAwake();
    this.backgroundMode.enable();

    if (this.currentMedia.mediaStatus == 3 || this.currentMedia.mediaStatus == 4)
      this.playMedia()
  }

  repeat() {
    this.repeatBtnStatus = !this.repeatBtnStatus;
  }

  replay() {
    if (this.currentMedia == null) {
      return;
    }
    if (this.currentMedia.mediaStatus == 4) {
      this.defaultToast('please click play button...', 2000, 'middle')
      return;
    }
    if (this.selectedMarker) {
      let pos = this.selectedMarker * 1000;
      this.currentMedia.pause();
      this.currentMedia.seekTo(pos);
    } else {
      this.currentMedia.seekTo(0);
    }
    this.currentMedia.play();

  }

  mediaRestart() {
    if (this.cue.path == '' || this.currentMedia == null) {
      this.defaultToast('Please select music file', '2000', 'bottom');
      return;
    }
    this.currentMedia.seekTo(0);
    this.currentMedia.play();
  }

  mediaStop() {
    if (this.currentMedia == null) {
      this.defaultToast('Please select music file', '2000', 'bottom');
      return;
    }

    this.currentMedia.onStatusUpdate.subscribe(status => {
      console.log('media_status: ', status)
      if (status) {
        this.currentMedia.mediaStatus = status;
        this.mStatus = status;
      }
    });

    this.currentMedia.stop();
    this.currentMedia.seekTo(0);
    this.timeElapsed = 0;
    this.insomniaAllowSleep();
    clearInterval(this.mediaTimer);
  }

  mediaSkip(seek_seconds) {
    if (this.cue.path == '' || this.currentMedia == null) {
      this.defaultToast('Please select music file', '2000', 'bottom');
      return;
    }
    this.currentMedia.getCurrentPosition().then((position) => {
      this.currentMedia.seekTo(position * 1000 + seek_seconds * 1000);
    });
  }

  //------- ASSETS FUNCTIONS ------------

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

  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  showPlayLoader(time) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait...',
      duration: time
    });

    loading.present();
  }

  showLoading(time) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: "Loading Media...",
      duration: time
    });
    this.loading_media = loading;
    loading.present();
  }

  onMediaStatusHandler(mediaObj) {
    mediaObj.onStatusUpdate.subscribe(status => {

      this.mStatus = status;
      console.log('*************current media status ************', this.mStatus);
      if (this.currentMedia) {
        this.currentMedia.mediaStatus = status;
        console.log('=============current media status =============', this.currentMedia.mediaStatus);
      }
    });
    mediaObj.onSuccess.subscribe(() => {
      this.selectedMarker = 0;
      console.log('Action is successful')
    });
    mediaObj.onError.subscribe(error => {
      // this.defaultToast('Soundtrack problem! Please select another one', 2000, 'middle');
      this.loading_media.dismiss();
      // this.clearMediaSrc();
      console.log('media error', JSON.stringify(error));

    });
  }
  // ---------------- ISOMNIA -----------------
  insomniaKeepAwake() {
    this.insomnia.keepAwake()
      .then(
        () => console.log('Keep awake success'),
        () => console.log('Keep awake error')
      );
  }

  insomniaAllowSleep() {
    this.insomnia.allowSleepAgain()
      .then(
        () => console.log('Allow sleep success'),
        () => console.log('Allow sleep error')
      );
  }
  // ----------------- EVENTS -------------------

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
    });
    this.events.subscribe('user:signup', () => {
    });
    this.events.subscribe('user:logout', () => {
      if (this.currentMedia != null) {
        this.currentMedia.stop();
      }
      // this.currentMedia.stop();
      this.clearMediaSrc();
      this.storage.remove('dancersQCues')
    });
    this.events.subscribe('tab-page:library', () => {
      if (this.currentMedia != null) {
        this.currentMedia.pause()
      }
    });
    this.events.subscribe('tab-page:account', () => {
      if (this.currentMedia != null) {
        this.currentMedia.pause()
      }
    });
  }

  // ----------------- INIT ---------------------
  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicPlayerPage');
  }


  ionViewWillEnter() {
    console.log('selected cueid =====================>')
    this.cueId = this.tabDataProvider.cueId;
    console.log(this.cueId)
    if(this.cueId) {
      this.getInitTrack(this.currentUser._id);
    }
  }

  async Init() {
    this.clearMediaSrc();
    try {

      let userToken = await this.userData.getUserToken();
      this.userToken = userToken;

      let userInfo = await this.userData.getUserData();
      this.currentUser = userInfo;

      this.getInitTrack(this.currentUser._id);

      this.currentMedia5678 = this.media.create('assets/sounds/5678.mp3');

    } catch (err) {
      console.log(JSON.stringify(err));
    }

  }

  getUserTracks(userID) {

    this.tracks.getAllUserTracksByDeviceID(
      userID,
      this.device.uuid,
      this.userToken
    ).subscribe((res: any) => {
      console.log('getUserTracks========>', JSON.stringify(res.tracks))
      if (res.tracks.length > 0) {
        this.Cues.init(res.tracks);
        this.cue = this.Cues.all()[res.tracks.length - 1];

        let filename = this.cue.filename;
        let filepath = this.cue.path;
        if (this.platform.is('ios')) {
          filepath = this._file.documentsDirectory;
          this.cue.path = filepath.substr(7) + filename;

          this.checkFileAndLoadMedia(filepath, filename);

        } else if (this.platform.is('android')) {
          filepath = "file://" + filepath.substr(0, filepath.length - filename.length);
          console.log("getUserTracks: ", JSON.stringify(this.cue));
          this.checkFileAndLoadMedia(filepath, filename);
          // this.loadMedia(this.cue);
        }
        console.log("getUserTracks count: " + res.tracks.length);

      } else {
        this.clearMediaSrc();
      }
    }, (err) => {
      console.log('getUserTracks==>', JSON.stringify(err))
      this.storage.remove('dancersQCues');
    });
  }

  checkFileAndLoadMedia(filepath, filename) {
    this._file.checkFile(filepath, filename).then(_ => this.loadMedia(this.cue))
      .catch((err) => {
        this.defaultToast('no file on device', 1500, 'middle')
        console.log('check file to load failed: ' + JSON.stringify(err))
      });
  }

  async getInitTrack(userID) {

    // var trackId = this.navParams.data.cueId;
    var trackId = this.cueId;
    console.log('getTrackId=====================>',trackId);
    let ques: any = await this.Cues.loadFromStorage();

    // let ques_length = Object.keys(ques);
    console.log('init track===========>', trackId)
    if (trackId == null || ques == null) {
      this.getUserTracks(userID);
    } else {
      console.log('=============init trackId======', trackId);
      let stateCue: any = _.find(ques, { id: trackId });
      this.cue = {
        id: stateCue.id,
        path: stateCue.path,
        markers: stateCue.markers,
        duration: stateCue.duration,
        filename: stateCue.filename
      };
      this.loadMedia(this.cue);
    }
  }

}
