import { Component } from '@angular/core';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import{getStorage,ref, uploadBytesResumable} from'firebase/storage'
import {FormControl,FormGroup,Validators } from '@angular/forms';
import { urls } from 'src/commons/constants';

@Component({
  selector: 'app-chat-room-info',
  templateUrl: './chat-room-info.component.html',
  styleUrls: ['./chat-room-info.component.scss']
})
export class ChatRoomInfoComponent{
file:any;
userData:any={};
userDataKey:any;
urls=urls
isAnonymous:boolean=localStorage.getItem('uid')?.startsWith('0x')?true:false;
profileForm!:FormGroup ;
constructor(private firebase:FirebaseService,private httpRequests:HttpRequestsService){
  httpRequests.getUser(this.isAnonymous).subscribe((response:any)=>{
    this.userDataKey=Object.keys(response)
    this.userData=Object.values(response)[0];
    this.userData.id=parseInt(this.userData.uid,16).toString()
    this.setProfileForm()
    this.profileForm.disable()

  })


}


setProfileForm(){
  this.profileForm=new FormGroup({
    uid:new FormControl(this.userData.uid,[Validators.required]),
    id:new FormControl(this.userData?.id??'Anonymous',[Validators.required]),
    name:new FormControl(this.userData?.name??'Anonymous',[Validators.required]),
    profile:new FormControl(this.userData.profile),

  })
}
getFile(event:any){
this.file=event.srcElement.files[0]
}
updateProfilePic(){
  const app=this.firebase.app()
  const storage=getStorage(app)
  const data=localStorage.getItem('uid')||'';
  const imageref=ref(storage,'/'+this.userData.uid||'')
  const metadata = {
    contentType: 'image/jpeg',
  };

  const uploadTask = uploadBytesResumable(imageref, this.file, metadata);

  uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  },
  () => {
    this.httpRequests.getDownloadLink(this.userData.uid).subscribe((response:any)=>{
      const downloadUrl=urls.storage+String(this.userData.uid).replace('+','%2B')+'?alt=media&token='+response?.downloadTokens;
      this.httpRequests.postUpdates(this.userDataKey[0],this.isAnonymous,{'profile':downloadUrl}).subscribe((updateResponse:any)=>{
        console.log('profile token activated successfully')
      })
    })
  })
}
profileUpdates(){
  console.log('pushing updates')
  console.log('profile details',this.profileForm)
  this.profileForm.disable()
}
errorImageHandler(imageEvent:any) {
  imageEvent.target.src=urls.defaultProfile;
  }

}
