import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private profileData=new BehaviorSubject<{name:string,profile:string}>({name:'',profile:''})
  private profileDataUpdated=this.profileData.asObservable();
  getProfileUpdate(){
    return this.profileDataUpdated;
  }
  setProfileUpdate(update:any){
    this.profileData.next(update);
  }
}
