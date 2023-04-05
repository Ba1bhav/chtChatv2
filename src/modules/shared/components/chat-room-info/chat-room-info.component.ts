import { Component } from '@angular/core';
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import{getStorage,uploadBytes} from'firebase/storage'
@Component({
  selector: 'app-chat-room-info',
  templateUrl: './chat-room-info.component.html',
  styleUrls: ['./chat-room-info.component.scss']
})
export class ChatRoomInfoComponent {
userData:any;
constructor(private requests:HttpRequestsService){
  requests.profilePic().subscribe((response:any)=>{
    this.userData=Object.values(response)[0]
    // console.log(Object.values(response)[0])
  })
}
updateProfilePic(){

}
}
