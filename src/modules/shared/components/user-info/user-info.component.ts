import { Component } from '@angular/core';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fileFormats, urls } from 'src/commons/constants';
import { doc, setDoc } from 'firebase/firestore';
import { ToastrService } from 'src/services/shared/toastr.service';
import { DataSharingService } from 'src/services/shared/data-sharing.service';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  file: any;
  userData: any = {};
  userDataKey: any;
  urls = urls
  isAnonymous: boolean = localStorage.getItem('uid')?.startsWith('0x') ? true : false;
  profileForm!: FormGroup;
  dataBase: any;
  profilePic: any;
  profilePicUrl: any;
  imageFormatErrorToggle = false;
  uploadProgress = 100;
  constructor(private toastr: ToastrService,
              private firebase: FirebaseService,
              private httpRequests: HttpRequestsService,
              private dataSharing:DataSharingService,

      ) {
    this.dataBase = firebase.getDb();
    this.dataSharing.getProfileUpdate().subscribe(()=>{
      httpRequests.getUser(this.isAnonymous).subscribe((response: any) => {

        if (response) {
          this.userDataKey = Object.keys(response)
          this.userData = Object.values(response)?.[0]
          this.setProfileForm()
          this.profileForm.disable()
        }
        else {
          this.setProfileForm()
          this.profileForm.disable()
        }
      })
    })
  }


  setProfileForm() {
    this.profileForm = new FormGroup({
      uid: new FormControl(this.userData?.uid),
      id: new FormControl(this.userData?.id),
      phone_number: new FormControl(this.userData?.phone_number),
      name: new FormControl(this.userData?.name || 'Anonymous', [Validators.required]),
      profile: new FormControl(this.userData?.profile),
    })
    this.profileForm.disable()
  }
  getFile(fileinputEvent: any) {
    this.profilePic = fileinputEvent.srcElement.files[0]
    this.profilePic = fileinputEvent?.srcElement?.files[0];
    this.profilePic.isImage = fileFormats?.image?.includes(this.profilePic.type.split('/')[1].toLowerCase());
    if (this.profilePic.isImage) {
      const reader = new FileReader();
      reader.readAsDataURL(fileinputEvent?.srcElement?.files[0]);
      reader.onload = () => {
        this.profilePicUrl = reader.result;
        this.updateProfilePic()
      }
    }
    else {
      this.imageFormatError();
      this.profilePic = null;
      this.profilePicUrl = '';
      this.profileForm.disable()

    }


  }
  imageFormatError() {
    this.imageFormatErrorToggle = true;
    setTimeout(() => this.imageFormatErrorToggle = false, 1300)
  }
  updateProfilePic() {
    const app = this.firebase.app()
    const storage = getStorage(app)
    const imageref = ref(storage, '/' + this.userData.uid || '')
    const metadata = {
      contentType: 'image/jpeg',
    };

    const uploadTask = uploadBytesResumable(imageref, this.profilePic, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {
        this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      () => null,
      () => {
        this.httpRequests.getDownloadLink(this.userData.uid).subscribe((response: any) => {
          const downloadUrl = urls.storage + String(this.userData.uid).replace('+', '%2B') + '?alt=media&token=' + response?.downloadTokens;
          this.profileForm.value.profile = downloadUrl;
          this.profileUpdates()

        })
      })
  }
  profileUpdates() {
    this.httpRequests.postUpdates(this.userDataKey, this.isAnonymous, this.profileForm.value).subscribe(() => {
      setDoc(doc(this.dataBase, 'usersChatlists', localStorage.getItem('uid') ?? ''), { userName: Array.from(this.profileForm.value?.name) })
      this.toastr.setToastMessage('Profile Updated Successfully')
      this.dataSharing.setProfileUpdate(this.profileForm?.value)
      this.profilePicUrl=''
    })
    this.profileForm.disable()
  }
  errorImageHandler(imageEvent: any) {
    imageEvent.target.src = urls.defaultProfile;
  }

}


