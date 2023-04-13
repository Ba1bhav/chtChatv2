import { Component, OnInit} from '@angular/core';
import { urls } from 'src/commons/constants';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { getDoc,collection,doc, where, query, getDocs, addDoc, setDoc, onSnapshot } from 'firebase/firestore';

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
  chatsList:any=[];
  usersChatlistsReff: any;
  searchInput:any;
  searchInputDebounce:any;
  searchResult:any=[];
  userschatReff:any;
  chatName:any='some name here'
  chatId:any;
  senderId=localStorage.getItem('uid')??'';
  switchReponse: any='0';
  chatlistListener:any;
constructor(private router:Router,private fireBaseService:FirebaseService){
  this.dataBase=fireBaseService.getDb();
  this.dataBaseReffrence=doc(this.dataBase,'chats',this.senderId);
  this.chatsReff=collection(this.dataBase, "chats");
  this.usersChatlistsReff=collection(this.dataBase, 'usersChatlists',localStorage.getItem('uid')??'','chats');

}
ngOnInit() {
  this.chatlistListener = onSnapshot(collection(this.dataBase, 'usersChatlists',localStorage.getItem('uid')??'','chats'), (collection) => {
    this.chatsList=[];
    collection.docs.forEach((result:any)=>{
      this.chatsList.push(result.data())

    })})

}
errorImageHandler(imageEvent:any) {
    imageEvent.target.src=urls.defaultProfile;
    }
logOut(){
  localStorage.clear()
  this.router.navigate(['/login'])
}
searchUser(inputEvent:any){
    console.log(inputEvent?.value);
    clearTimeout(this.searchInputDebounce)
    this.searchInputDebounce=setTimeout(()=>{
      console.log('Searching ... ');
      this.searchQuery(Array.from(inputEvent.value))
    },1000)
}
searchQuery(searchArray:any){
  console.log('response');
  if(searchArray.length>0){
    const search=query(collection(this.dataBase, 'usersChatlists'), where('userName','array-contains-any',searchArray));
    this.searchResult=[]
    getDocs(search).then((response:any)=>response.forEach((doc:any) => {
      if(doc.id!==this.senderId){
      this.searchResult.push({id:doc.id,name:String(doc.data().userName).replaceAll(',','')});
      console.log(doc.id, ' => ', doc.data());
    }
  }))
  }
  else{
    this.searchResult=null;
  }
}

createChat(uid:any){

    this.userschatReff=collection(this.dataBase,'usersChatlists',this.senderId,'chats');
    const idArray:any=[]
    const messagIdArray:any=[]
    getDocs(this.userschatReff).then((response:any)=>
    {response.forEach((result:any)=>{
      console.log(result?.id);
      if(result.id==uid){
        this.chatId=result?.data()?.id
        this.switchReponse='0'
      }
      idArray.push(result?.id);
      messagIdArray.push(result?.data()?.id)

    })
    console.log(idArray,uid);

    if(idArray.includes(uid)){
      console.log('Chat All ready Exists',this.chatId)
    }
    else{
        console.log('creating new chat with ',uid);
        addDoc(this.chatsReff, {messages:[]}).then((response:any)=>{
        this.chatId=response?.id
        this.switchReponse='0'
        const recieverId=uid;
        const senderData={id:this.chatId,reciever:recieverId};
        const recieverData={id:this.chatId,reciever:this.senderId};
        const sender=collection(this.dataBase,'usersChatlists',this.senderId,'chats');
        const reciever=collection(this.dataBase,'usersChatlists',recieverId,'chats');
        setDoc(doc(sender,recieverId),senderData).then((response:any)=>console.log(response||'Success-Sender')).catch(()=>console.log('Error'))
        setDoc(doc(reciever,this.senderId),recieverData).then((response:any)=>console.log(response||'Success-Reciever')).catch(()=>console.log('Error'))
      })
    }
    })
  }
  createGroup(){
    this.switchReponse='1';
  }
}
