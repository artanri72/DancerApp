import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class MediaSrvProvider {

  service: any;
  mediaStatus: any;

  constructor( public platform: Platform) {
  }

  unloadMedia(media:any) {
    if (media && media.mediaStatus) {
      media.stop();
      media.release();
    }
    return null;
  }

  getMediaDuration(media:any, cue:any, cb:any) {
    console.log('################# mediaSRV-getMedia Duration ###################',JSON.stringify(media),cue,cb)
    media.stop();
    var normalDuration = media.getDuration();
    if (normalDuration > 0) {
      cb(Math.round(normalDuration))
    } else {
      if (cue.duration) {
        return cb(cue.duration)
      }
      media.play();
      media.stop();
      var counter = 0;
      var timerDur = setInterval(function() {
        counter = counter + 100;
        if (counter > 2000) {
          clearInterval(timerDur);
          return cb(0);
        }
        var dur = media.getDuration();
        if (dur > 0) {
          clearInterval(timerDur);
          return cb(Math.round(dur));
        }
      }, 100);
    }
  }

  // loadMedia(src, onStop, onError, onStatus) {
  //   this.platform.ready().then((readySource) => {
  //     if(readySource){
  //       this.mediaStatus = {
  //         code: 0,
  //         text: this.getStatusMessage(0)
  //       };

  //       if (this.platform.is('android')) {
  //         src = '/android_asset/www/' + src;
  //       }
  //       var media = new $window.Media(src, mediaSuccess, mediaError, mediaStatus);
  //       media.status = mediaStatus;
        
  //     }
  //   })
  // }

  // mediaSuccess() {
  //   this.mediaStatus.code = 4;
  //   this.mediaStatus.text = this.getStatusMessage(4);
  //   if (onStop) {
  //     onStop();
  //   }
  // };

  // mediaError(err) {
  //   this._logError(src, err);
  //   if (onError) {
  //     onError(err);
  //   }
  // };

  // mediaStatusFun(status) {
  //   this.mediaStatus.code = status;
  //   this.mediaStatus.text = this.getStatusMessage(status);
  //   if (onStatus) {
  //     onStatus(status);
  //   }
  // };

  // _logError(src, err) {
  //   console.error('MediaSrv error', {
  //     code: err.code,
  //     text: this.getErrorMessage(err.code)
  //   });
  // }

  getStatusMessage(status) {
    if (status === 0) {
      return 'Media.MEDIA_NONE';
    } else if (status === 1) {
      return 'Media.MEDIA_STARTING';
    } else if (status === 2) {
      return 'Media.MEDIA_RUNNING';
    } else if (status === 3) {
      return 'Media.MEDIA_PAUSED';
    } else if (status === 4) {
      return 'Media.MEDIA_STOPPED';
    } else {
      return 'Unknown status <' + status + '>';
    }
  }

  getErrorMessage(code) {
    if (code === 1) {
      return 'MediaError.MEDIA_ERR_ABORTED';
    } else if (code === 2) {
      return 'MediaError.MEDIA_ERR_NETWORK';
    } else if (code === 3) {
      return 'MediaError.MEDIA_ERR_DECODE';
    } else if (code === 4) {
      return 'MediaError.MEDIA_ERR_NONE_SUPPORTED';
    } else {
      return 'Unknown code <' + code + '>';
    }
  }

}
