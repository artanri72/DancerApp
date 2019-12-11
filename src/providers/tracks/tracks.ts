import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class TracksProvider {

  endpoint: string = CONFIG.apiEndpoint;

  constructor(public http: Http) {
    console.log('Hello MusicPlayerProvider Provider');
  }

  updateTrackName(trackID, params, userToken):Observable<any> {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);
    let options = new RequestOptions({ headers: myHeaders });

    return this.http.put(this.endpoint + 'api/tracks/' + trackID + '/name', params, options)
    .map(res => res.json())

  }

  updateUserTrackByTrackId(trackID, params, userToken):Observable<any> {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);
    let options = new RequestOptions({ headers: myHeaders });

    return this.http.put(this.endpoint + 'api/tracks/' + trackID, params, options)
    .map(res => res.json())

  }

  getUserTrackByPath(userID:string, path:string, userToken:string):Observable<any> {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);
    let myParams = new URLSearchParams();
    myParams.set('user',userID)
    myParams.set('path',path)

    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    return this.http.get(this.endpoint + 'api/track', options)
    .map(res => res.json())
  }

  saveTrack(trackId:string, data:any, userToken:string):Observable<any> {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);
    let options = new RequestOptions({ headers: myHeaders });

    return this.http.post(this.endpoint + 'api/tracks/' + trackId, data, options)
      .map(res => res.json())

  }

  getAllUserTracksByDeviceID(userID:string, deviceID:string, userToken:string):Observable<any> {

    let myHeaders = new Headers();

    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);

    let myParams = new URLSearchParams();

    myParams.set('userID',userID)
    myParams.set('deviceID',deviceID)

    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    
    return this.http.get(this.endpoint + 'api/tracks/device', options)
    .map(res => res.json())
  }

  getAllUserTracksOnAnotherDevices(userID:string, deviceID:string, userToken:string):Observable<any> {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);

    let myParams = new URLSearchParams();
    myParams.set('userID',userID)
    myParams.set('deviceID',deviceID)
    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    return this.http.get(this.endpoint + 'api/tracks/other', options)
    .map(res => res.json())
  }

  getAllUserTracks(userID:string, userToken:string):Observable<any> {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);
    let myParams = new URLSearchParams();
    myParams.set('userID',userID)
    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    return this.http.get(this.endpoint + 'api/tracks/user', options)
    .map(res => res.json())
  }

  deleteUserTrackByTrackId(trackId:string, userToken:string):Observable<any> {
    
    let myHeaders = new Headers();
    myHeaders.set('Content-Type','application/json');
    myHeaders.set('Authorization','Bearer '+userToken);

    let myParams = new URLSearchParams();
    myParams.set('trackId',trackId)

    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    
    return this.http.get(this.endpoint + 'api/tracks/user', options)
    .map(res => res.json())
  }

}
