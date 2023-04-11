import { Component, OnInit} from '@angular/core';
import { urls } from 'src/commons/constants';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { getDoc,collection,doc, where, query, getDocs, addDoc, setDoc } from 'firebase/firestore';
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
constructor(private router:Router,private fireBaseService:FirebaseService){
  this.dataBase=fireBaseService.getDb();
  this.dataBaseReffrence=doc(this.dataBase,'chats',localStorage.getItem('uid')||'pU3Q54x4yvX8pJa8yZnM5iMjN5D2');
  this.chatsReff=collection(this.dataBase, "chats");
  this.usersChatlistsReff=collection(this.dataBase, 'usersChatlists',localStorage.getItem('uid')??'','chats');

}
ngOnInit() {
  getDocs(this.usersChatlistsReff).then((response:any)=>
  {response.forEach((result:any)=>{
    console.log(result.id,'->',result.data());
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
    this.searchResult.push({id:doc.id,name:String(doc.data().userName).replaceAll(',','')})
    console.log(doc.id, ' => ', doc.data());
}))
}
else{
  this.searchResult=null;
}
  }

createChat(uid:any){
    const senderId=localStorage.getItem('uid')??'';
    this.userschatReff=collection(this.dataBase,'usersChatlists',senderId,'chats');
    const idArray:any=[]
    getDocs(this.userschatReff).then((response:any)=>
    {response.forEach((result:any)=>{
      console.log(result.id);
      idArray.push(result.id);

    })
    console.log(idArray,uid);

    if(idArray.includes(uid)){
      console.log('Chat All ready Exists')
    }
    else{
      let chatId:any;
      console.log('creating new chat with ',uid);
      addDoc(this.chatsReff, {messages:[]}).then((response:any)=>{

        chatId=response.id
        const recieverId=uid;
        const senderData={id:chatId,reciever:recieverId};
        const recieverData={id:chatId,reciever:senderId};
        const sender=collection(this.dataBase,'usersChatlists',senderId,'chats');
        const reciever=collection(this.dataBase,'usersChatlists',recieverId,'chats');
        // console.log(data,senderId,recieverId);

        setDoc(doc(sender,recieverId),senderData).then((response:any)=>console.log(response||'Success-Sender')).catch(()=>console.log('Error'))
        setDoc(doc(reciever,senderId),recieverData).then((response:any)=>console.log(response||'Success-Reciever')).catch(()=>console.log('Error'))


      })

      //{id:chatId,name=userName}
      //create message id
      //add reffrence object to usersChatlists/userId/chats to both the users
    }
    })
  }
}
