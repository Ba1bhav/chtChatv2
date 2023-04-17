import { Component,ChangeDetectorRef, Input, OnChanges, OnInit} from '@angular/core';
import { urls } from 'src/commons/constants';
import { FirebaseService } from 'src/services/shared/firebase.service';
import {doc,arrayUnion,updateDoc, onSnapshot, deleteDoc, collection, setDoc, getDocs} from'firebase/firestore'
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ToastrService } from 'src/services/shared/toastr.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnChanges,OnInit{
userData: any;
dataBase:any;
dataBaseReffrence:any;
messages:any=[]
senderId=localStorage.getItem('uid');
unsubscribeListener:any;
attachmentFile:any;
attachmentFileUrl:any;
attachmentUploadProgress=0;
imageExtensions=['jpg','jpeg','gif','png','webp'];
audioExtensions=['aac','flac','ogg','wma','mp3','wav','mpeg'];
videoExtensions=['x-ms-wmv','x-msvideo','quicktime','3gpp','MP2T','x-mpegURL','mp4','x-flv']
seenMessages!:number;
@Input() chatId:any;
@Input() chatName:any;
@Input() chatProfile:any;
@Input() recieverId:any;
matmenuwidth={
  'min-width':'200px'
  }

chatRoomInfo: any;
switchResponse='0';
chatsReff: any;
window=window;
sharedProfiles: any=[];
sharedProfilesIds:any=[];
showEmojiPicker=false;
constructor(private toastr:ToastrService,private httpRequests:HttpRequestsService,private fireBaseService:FirebaseService,private changeDetector:ChangeDetectorRef){
  this.dataBase=fireBaseService.getDb();

}
  ngOnInit(){
    this.changeDetector.detectChanges();

}
ngOnChanges(){

  if(this.chatId){
    this.dataBaseReffrence=doc(this.dataBase,'chats',this.chatId);
    this.unsubscribeListener = onSnapshot(doc(this.dataBase, "chats",this.chatId), (doc) => {
        this.chatRoomInfo=doc?.data()?.['info'];
        this.messages=doc?.data()?.['messages'];
        this.seenMessages=doc?.data()?.['seenMessages'];
        getDocs(collection(this.dataBase,'chats',this.chatId,'sharedProfiles')).then((response:any)=>{
          response.forEach((doc:any)=>{
            this.sharedProfiles.push(doc?.data()?.data)
            this.sharedProfilesIds.push(doc?.id)
          })

        })
      if(this.messages){
        if(this.messages[this.messages?.length-1]?.senderId!==this.senderId){
          updateDoc(this.dataBaseReffrence, {seenMessages:this.messages?.length})
          // .then((response:any)=>{console.log('Message Seen');})
      }}})
  }

}

  errorImageHandler(imageEvent:any) {
    imageEvent.target.src=urls.defaultProfile;
    }
  errorChatImageHandler(imageEvent:any) {
    imageEvent.target.src=urls.contentError;
    }
sendMessage(message:any,type:number){
 if(message){
    if(type===1||type==2||type==3||type==4){
      const messageData=message;
        updateDoc(this.dataBaseReffrence, {messages:arrayUnion({message:messageData,senderId:this.senderId,type:type,date:String(new Date())})}).then((response:any)=>{console.log('Message Send Successfully');
      })
    }
    else{
    if(message?.value){
    const messageData=message.value;
    updateDoc(this.dataBaseReffrence, {messages:arrayUnion({message:messageData,senderId:this.senderId,type:type,date:String(new Date())})})
    .then(()=>{
      // console.log('Message Send Successfully');
    })
    message.value='';
  }
  }
}
}
fileAttach(fileEvent:any){
this.attachmentFile=fileEvent?.srcElement?.files[0];
this.attachmentFile.isImage=this.imageExtensions.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
this.attachmentFile.isAudio=this.audioExtensions.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
this.attachmentFile.isVideo=this.videoExtensions.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
const reader = new FileReader();
reader.readAsDataURL(fileEvent?.srcElement?.files[0]);
reader.onload = () => {
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
      this.attachmentUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('Upload is ' + this.attachmentUploadProgress + '% done');
    },
    (error) => {
      console.log(error)
      }
    ,
    () => {


      this.httpRequests.getDownloadLink(this.attachmentFile?.name).subscribe((response:any)=>{
        const downloadUrl=urls.storage+encodeURI(this.attachmentFile?.name)+'?alt=media&token='+response?.downloadTokens;
        console.log('Getting Url',downloadUrl);
        if(this.attachmentFile.isImage){
          this.sendMessage(downloadUrl,1);
          this.attachmentFile=null;
        }
        else if(this.attachmentFile.isAudio){
          this.sendMessage(downloadUrl,2);
          this.attachmentFile=null;
        }
        else if(this.attachmentFile.isVideo){
          this.sendMessage(downloadUrl,3);
          this.attachmentFile=null;
        }
        else{
          this.sendMessage(downloadUrl,4);
          this.attachmentFile=null;
        }
      })
    })
}
  deleteMessage(index:any){
    this.messages.splice(index,1)
  }
  closeChat(){
    this.chatId=null;
    this.unsubscribeListener()
  }
  leaveChat(){
    const deleteDocRef=doc(this.dataBase, 'usersChatlists', this.senderId??'', 'chats',this.chatId);
    if(this.chatRoomInfo){
      // console.log(this.chatRoomInfo[0]?.members.findIndex((value:any)=>value==this.senderId));

      this.chatRoomInfo[0].members.splice(this.chatRoomInfo[0]?.members.findIndex((value:any)=>value==this.senderId),1) ;
      console.log(this.chatRoomInfo,this.senderId);
        setDoc(doc(this.dataBase, "chats",this.chatId),{info:this.chatRoomInfo}).then(()=>{
          this.toastr.setToastMessage('Chat Room Left ')
        deleteDoc(deleteDocRef).then(()=>{
          // console.log('chat with id ',this.chatId,' has been removed !')
        })
        this.chatId=null;

      })

    }
    else{
      deleteDoc(deleteDocRef).then(()=>console.log('chat with id ',this.chatId,' has been removed !'))
      this.chatId=null;
    }


  }
  shareProfile(){
if(!this.chatRoomInfo){
    const uId=localStorage.getItem('uid');
    const isAnonymous=uId?.startsWith('0x')?true:false;
    if(uId&&this.recieverId){
    this.httpRequests.getUser(isAnonymous).subscribe((userDetails:any)=>{
      const data:any=Object.values(userDetails)[0]||'';
      data.id=this.chatId;
      updateDoc(doc(this.dataBase,'usersChatlists',this.recieverId,'chats',uId||''),data).then((response:any)=>{
        // console.log(response||'Success-Reciever')
        this.toastr.setToastMessage('Profile Shared Success')


    })})
  }}
  else{
    const uId=localStorage.getItem('uid');
    const isAnonymous=uId?.startsWith('0x')?true:false;
    if(uId&&this.recieverId){
    this.httpRequests.getUser(isAnonymous).subscribe((userDetails:any)=>{
      const data:any=Object.values(userDetails)[0]||'';
      data.id=uId;
      const chatRoomReff=collection(this.dataBase,'chats',this.chatId,'sharedProfiles')
      setDoc(doc(chatRoomReff,uId),{data:data}).then((response:any)=>{
        // console.log(response||'Success-Reciever')
        this.toastr.setToastMessage('Profile Shared Success')
      })})
    }}

  }
  getMemberInfo(id:any){
    const index=this.sharedProfilesIds.findIndex((value:any)=>value==id);
    return this.sharedProfiles[this.sharedProfilesIds.findIndex((value:any)=>value==id)]
  }
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
  }
  addEmoji(emojiEvent:any,message:any){
    message.value+=emojiEvent?.emoji?.native;
  }
}
