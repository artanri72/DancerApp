import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Device } from '@ionic-native/device';
import { FileChooser } from '@ionic-native/file-chooser';
import { IOSFilePicker } from '@ionic-native/file-picker';
import { IonicStorageModule } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Insomnia } from '@ionic-native/insomnia';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Dialogs } from '@ionic-native/dialogs'

import { TimeConvertDirective } from '../directives/time-convert/time-convert';

import { DancerApp } from './app.component';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { MusicPlayerPage } from '../pages/music-player/music-player';
import { LibraryPage } from '../pages/library/library';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { TracksProvider } from '../providers/tracks/tracks';
import { CuesProvider } from '../providers/cues/cues';
import { MediaSrvProvider } from '../providers/media-srv/media-srv';
import { TabDataProvider } from '../providers/tab-data/tab-data';


@NgModule({
  declarations: [
    DancerApp,
    AccountPage,
    LoginPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    MusicPlayerPage,
    LibraryPage,
    TimeConvertDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(DancerApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account/:userId' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: MusicPlayerPage, name: 'MusicPlayerPage', segment: 'musicPlayer/:userId'},
        { component: LibraryPage, name: 'LibraryPage', segment: 'library/:userId'}
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DancerApp,
    AccountPage,
    LoginPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    MusicPlayerPage,
    LibraryPage

  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    UserData,
    InAppBrowser,
    SplashScreen,
    Media,
    File,
    Device,
    FileChooser,
    FilePath,
    IOSFilePicker,
    GooglePlus,
    Facebook,
    TracksProvider,
    CuesProvider,
    MediaSrvProvider,
    Insomnia,
    BackgroundMode,
    Dialogs,
    TabDataProvider
  ]
})
export class AppModule { }
