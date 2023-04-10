import { Component, OnInit} from '@angular/core';
import { urls } from 'src/commons/constants';
import { FirebaseService } from 'src/services/shared/firebase.service';
import{doc,getDoc,setDoc,updateDoc,collection, arrayUnion,FieldValue} from'firebase/firestore'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
userData: any;
dataBase:any;
dataBaseReffrence:any;
chatsReff:any;
constructor(private fireBaseService:FirebaseService){
  this.dataBase=fireBaseService.getDb();
  this.dataBaseReffrence=doc(this.dataBase,'chats','11900191');
  this.chatsReff=collection(this.dataBase, "chats");
}
ngOnInit() {
    updateDoc(doc(this.chatsReff, "pU3Q54x4yvX8pJa8yZnM5iMjN5D2"), {
      rooms:arrayUnion({roomName: "Room 2", roomMembers:['11900192'], roomMessages:[{owner:'11900191',message:'hello'}],
      roomLogo:"temp.jpg"})


    }).then((response)=>{
      console.log(response);
      getDoc(this.dataBaseReffrence).then((response:any)=>{console.log(response.data())}).catch((error)=>console.log(error))
    })

}
errorImageHandler(imageEvent:any) {
  imageEvent.target.src=urls.defaultProfile;
  }
}
