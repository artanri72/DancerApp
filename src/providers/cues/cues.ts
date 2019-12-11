import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../../config/config';
// import { Http, Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/observable';
import _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class CuesProvider {

  endpoint: string = CONFIG.apiEndpoint;
  cues: any = [];

  constructor(
    public storage: Storage
  ) {
  }

  init(tracks) {
    this.clear();
    this.cues = _.map(tracks, function(track) {
      return {
        id: track._id,
        path: track.path,
        markers: track.markers,
        duration: track.duration,
        filename: track.filename
      }
    });
    this.saveToStorage();
  }

  clear() {
    this.cues.length = 0;
  }

  all() {
    console.log('ques: ', this.cues.length);
    return this.cues;
  }

  remove(cue:any) {
    for (var i = 0; i < this.cues.length; i++) {
      if (this.cues[i].id === parseInt(cue.id)) {
        this.cues.splice(i, 1);
      }
    }
  }

  get(cueId) {
    for (var i = 0; i < this.cues.length; i++) {
      if (this.cues[i].id === parseInt(cueId)) {
        return this.cues[i];
      }
    }
    return null;
  }

  update(cue) {
    var found = false;
    for (var i = 0; i < this.cues.length; i++) {
      if (this.cues[i].id === cue.id) {
        found = true;
        this.cues[i].markers = cue.markers;
        this.cues[i].filename = cue.filename;
        this.cues[i].path = cue.path;
        this.cues[i].duration = cue.duration;
      }
    }

    if (!found) {
      this.cues.push({
        id: cue.id,
        path: cue.path,
        filename: cue.filename,
        markers: cue.markers,
        duration: cue.duration
      })
    }
    this.saveToStorage();
  }

  loadFromStorage(): Promise<string> {
    this.clear();
    return this.storage.get('dancersQCues').then((value) => {
      if(value) {
        this.cues = JSON.parse(value);
      }
      return this.cues;
    });
  }

  saveToStorage() {
    this.storage.set('dancersQCues', JSON.stringify(this.cues));
  }

  dancersQCues(): Promise<string> {
    return this.storage.get('dancersQCues').then((value) => {
      return value;
    });
  };

}