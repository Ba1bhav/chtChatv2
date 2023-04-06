import { Component } from '@angular/core';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import{getStorage,uploadBytes,ref,getDownloadURL, uploadBytesResumable} from'firebase/storage'
@Component({
  selector: 'app-chat-room-info',
  templateUrl: './chat-room-info.component.html',
  styleUrls: ['./chat-room-info.component.scss']
})
export class ChatRoomInfoComponent {
  image='https://firebasestorage.googleapis.com/v0/b/chitchatv2-f816e.appspot.com/o/'//uid?alt=media&token=userdata.profile'
userData:any;
localStorage=localStorage;
constructor(private firebase:FirebaseService,private requests:HttpRequestsService){
  requests.getUser(false).subscribe((response:any)=>{
    this.userData=Object.values(response)[0]
    // console.log(Object.values(response)[0])
  })
}
file:any;
getFile(event:any){
this.file=event.srcElement.files[0]
}
response:any;
updateProfilePic(){
  const app=this.firebase.app()
  const storage=getStorage(app)
  const data=localStorage.getItem('uid');
  const imageref=ref(storage,'/'+data||'')
  const metadata = {
    contentType: 'image/jpeg'
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
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
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
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      this.requests.putProfilePic({profile:downloadURL}).subscribe((res:any)=>console.log(res))
      console.log('File available at', downloadURL);
    });
  })
}
}
