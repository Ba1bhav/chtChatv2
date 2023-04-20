import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  private toastr = new BehaviorSubject<object>({ message: 'Welcome To ChitChatV2',type:true})
  private notify = this.toastr.asObservable()
  setToastMessage(message: string) {
    return this.toastr.next({ message: message ,type:true})
  }
  getNotification() {
    return this.notify;
  }

  setToastError(message:string){
    return this.toastr.next({ message: message,type:false })
  }
}
