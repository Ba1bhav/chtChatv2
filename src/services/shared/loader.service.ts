import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private spinner=new BehaviorSubject<object>({loading:false})
  private loading= this.spinner.asObservable();
  getLoadingStatus(){
    return this.loading
  }
  setLoadingStatus(response:boolean){
    return this.spinner.next({loading:response})
  }
}
