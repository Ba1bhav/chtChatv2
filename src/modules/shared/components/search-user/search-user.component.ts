import { Component, OnInit} from '@angular/core';
import { urls } from 'src/commons/constants';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { getDoc,collection,doc } from 'firebase/firestore';
@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit{
  urls=urls
  dataBase:any;
  dataBaseReffrence:any;
  chatsReff:any;
  userData: any;
  chatsList:any;
constructor(private router:Router,private fireBaseService:FirebaseService){
  this.dataBase=fireBaseService.getDb();
  this.dataBaseReffrence=doc(this.dataBase,'chats',localStorage.getItem('uid')||'pU3Q54x4yvX8pJa8yZnM5iMjN5D2');
  this.chatsReff=collection(this.dataBase, "chats");
}
ngOnInit() {

  getDoc(this.dataBaseReffrence).then((response:any)=>{
    console.log(response.data(),'chats');
    this.chatsList=response.data()?.rooms;
  }).catch((error)=>console.log(error))


}

  errorImageHandler(imageEvent:any) {
    imageEvent.target.src=urls.defaultProfile;
    }
logOut(){
  localStorage.clear()
  this.router.navigate(['/login'])
}
}
