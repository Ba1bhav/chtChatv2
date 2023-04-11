import { Component, OnInit,AfterViewChecked,ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { urls } from 'src/commons/constants';
import { FirebaseService } from 'src/services/shared/firebase.service';
import{doc,arrayUnion,updateDoc, onSnapshot} from'firebase/firestore'
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,AfterViewChecked,AfterViewInit{
userData: any;
dataBase:any;
dataBaseReffrence:any;
chatsReff:any;
messages:any=[]
senderId=localStorage.getItem('uid');
unsubscribeListener:any;
attachmentFile:any;
attachmentFileUrl:any;
imageExtensions=['jpg','jpeg','gif','png','webp']
constructor(private httpRequests:HttpRequestsService,private fireBaseService:FirebaseService,private changeDetector:ChangeDetectorRef){
  this.dataBase=fireBaseService.getDb();
  this.dataBaseReffrence=doc(this.dataBase,'chats','NvuhjlRARx7AF2Fo6TGV');
  this.chatsReff=doc(this.dataBase, "chats",'NvuhjlRARx7AF2Fo6TGV');

}

ngOnInit() {
  this.unsubscribeListener = onSnapshot(doc(this.dataBase, "chats",'NvuhjlRARx7AF2Fo6TGV'), (doc) => {
    this.messages=doc?.data()?.['messages']})
}
ngAfterViewInit(){
  this.changeDetector.detectChanges()
}
ngAfterViewChecked() {
  this.changeDetector.detectChanges()
}

errorImageHandler(imageEvent:any) {
  imageEvent.target.src=urls.defaultProfile;
  }
sendMessage(message:any,type:number){
  if(type=1){
    const messageData=message;
    updateDoc(this.chatsReff, {messages:arrayUnion({message:messageData,senderId:this.senderId,type:type,date:String(new Date())})}).then((response:any)=>{console.log('Message Send Successfully');
  })
  }
  else{
  const messageData=message.value;
  updateDoc(this.chatsReff, {messages:arrayUnion({message:messageData,senderId:this.senderId,type:type,date:String(new Date())})}).then((response:any)=>{console.log('Message Send Successfully');
  })
  message.value='';
}
}
fileAttach(fileEvent:any){
this.attachmentFile=fileEvent?.srcElement?.files[0];
this.attachmentFile.isImage=this.imageExtensions.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
let reader = new FileReader();
reader.readAsDataURL(fileEvent?.srcElement?.files[0]);
reader.onload = (_event) => {
  this.attachmentFileUrl = reader.result;
}
}

attchmentUpload(){
    const app=this.fireBaseService.app()
    const storage=getStorage(app)
    const imageref=ref(storage,'/'+this.attachmentFile?.name)
    const uploadTask = uploadBytesResumable(imageref, this.attachmentFile);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      console.log(error)
      }
    ,
    () => {
      this.httpRequests.getDownloadLink(this.attachmentFile?.name).subscribe((response:any)=>{
        const downloadUrl=urls.storage+this.attachmentFile?.name+'?alt=media&token='+response?.downloadTokens;
        this.attachmentFile=null;
        this.sendMessage(downloadUrl,1)
      })
    })
}
  deleteMessage(index:any){
    this.messages.splice(index,1)
  }

}
