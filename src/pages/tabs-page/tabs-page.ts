import { Component } from '@angular/core';

import { NavParams, Events } from 'ionic-angular';

import { MusicPlayerPage } from '../music-player/music-player';
import { LibraryPage } from '../library/library';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = MusicPlayerPage;
  tab2Root: any = LibraryPage;
  tab3Root: any = AccountPage;

  mySelectedIndex: number;

  constructor(navParams: NavParams, public events: Events) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  tabEvent(tabName) {
    console.log(tabName)
    this.events.publish('tab-page:'+tabName);
  }

}
