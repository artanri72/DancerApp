import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
@Injectable()
export class TabDataProvider {

  public cueId:any;
  
  constructor() {
    console.log('Hello TabDataProvider Provider');
  }

}
