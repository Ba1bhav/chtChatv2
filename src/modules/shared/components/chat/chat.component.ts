import { Component, ChangeDetectorRef, Input, OnChanges, AfterViewChecked, AfterViewInit } from '@angular/core';
import { urls ,fileFormats} from 'src/commons/constants';
import { FirebaseService } from 'src/services/shared/firebase.service';
import { doc, arrayUnion, updateDoc, onSnapshot, deleteDoc, collection, setDoc, getDocs } from 'firebase/firestore'
import { HttpRequestsService } from 'src/services/shared/http-requests.service';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ToastrService } from 'src/services/shared/toastr.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnChanges, AfterViewChecked, AfterViewInit {
  userData: any;
  dataBase: any;
  dataBaseReffrence: any;
  messages: any = []
  senderId = localStorage.getItem('uid');
  unsubscribeListener: any;
  attachmentFile: any;
  attachmentFileUrl: any;
  attachmentUploadProgress = 0;
  seenMessages!: number;
  @Input() chatId: any;
  @Input() chatName: any;
  @Input() chatProfile: any;
  @Input() recieverId: any;
  matmenuwidth = {
    'min-width': '200px'
  }

  chatRoomInfo: any;
  switchResponse = '0';
  chatsReff: any;
  window = window;
  sharedProfiles: any = [];
  sharedProfilesIds: any = [];
  showEmojiPicker = false;
  mouseOverEmojiPicker=false;
  constructor(private toastr: ToastrService, private httpRequests: HttpRequestsService, private fireBaseService: FirebaseService, private changeDetector: ChangeDetectorRef) {
    this.dataBase = fireBaseService.getDb();

  }
  ngAfterViewInit() {
    this.changeDetector.detectChanges()
    this.changeDetector.detach()
  }
  ngAfterViewChecked() {
    this.changeDetector.detectChanges()
  }
  ngOnChanges() {

    if (this.chatId) {
      this.dataBaseReffrence = doc(this.dataBase, 'chats', this.chatId);
      this.unsubscribeListener = onSnapshot(doc(this.dataBase, "chats", this.chatId), (doc) => {
        this.chatRoomInfo = doc?.data()?.['info'];
        this.messages = doc?.data()?.['messages'];
        this.seenMessages = doc?.data()?.['seenMessages'];
        getDocs(collection(this.dataBase, 'chats', this.chatId, 'sharedProfiles')).then((response: any) => {
          response.forEach((doc: any) => {
            this.sharedProfiles.push(doc?.data()?.data)
            this.sharedProfilesIds.push(doc?.id)
          })

        })
        if (this.messages) {
          if (this.messages[this.messages?.length - 1]?.senderId !== this.senderId) {
            updateDoc(this.dataBaseReffrence, { seenMessages: this.messages?.length })
            // .then((response:any)=>{console.log('Message Seen');})
          }
        }
      })
    }

  }

  errorImageHandler(imageEvent: any) {
    imageEvent.target.src = urls.defaultProfile;
  }
  errorChatImageHandler(imageEvent: any) {
    imageEvent.target.src = urls.contentError;
  }
  sendMessage(message: any, type: number) {
    if (message) {
      if (type === 1 || type == 2 || type == 3 || type == 4) {
        const messageData = message;
        updateDoc(this.dataBaseReffrence, { messages: arrayUnion({ message: messageData, senderId: this.senderId, type: type, date: String(new Date()) }) }).then(() => {
          console.log('Message Send Successfully');
        })
      }
      else {
        if (message?.value) {
          const messageData = message.value;
          updateDoc(this.dataBaseReffrence, { messages: arrayUnion({ message: messageData, senderId: this.senderId, type: type, date: String(new Date()) }) })
            .then(() => {
              // console.log('Message Send Successfully');
            })
          message.value = '';
        }
      }
    }
  }
  fileAttach(fileEvent: any) {
    this.attachmentFile = fileEvent?.srcElement?.files[0];
    this.attachmentFile.isImage = fileFormats?.image?.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
    this.attachmentFile.isAudio = fileFormats?.audio?.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
    this.attachmentFile.isVideo = fileFormats?.video?.includes(this.attachmentFile.type.split('/')[1].toLowerCase())
    const reader = new FileReader();
    reader.readAsDataURL(fileEvent?.srcElement?.files[0]);
    reader.onload = () => {
      this.attachmentFileUrl = reader.result;
    }
  }

  attchmentUpload() {
    const app = this.fireBaseService.app()
    const storage = getStorage(app)
    const imageref = ref(storage, '/' + this.attachmentFile?.name)
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


        this.httpRequests.getDownloadLink(this.attachmentFile?.name).subscribe((response: any) => {
          const downloadUrl = urls.storage + encodeURI(this.attachmentFile?.name) + '?alt=media&token=' + response?.downloadTokens;
          console.log('Getting Url', downloadUrl);
          if (this.attachmentFile.isImage) {
            this.sendMessage(downloadUrl, 1);
            this.attachmentFile = null;
          }
          else if (this.attachmentFile.isAudio) {
            this.sendMessage(downloadUrl, 2);
            this.attachmentFile = null;
          }
          else if (this.attachmentFile.isVideo) {
            this.sendMessage(downloadUrl, 3);
            this.attachmentFile = null;
          }
          else {
            this.sendMessage(downloadUrl, 4);
            this.attachmentFile = null;
          }
        })
      })
  }
  deleteMessage(index: any) {
    this.messages.splice(index, 1)
  }
  leaveChat() {

    if (this.chatRoomInfo) {
      const deleteDocRef = doc(this.dataBase, 'usersChatlists', this.senderId ?? '', 'chats', this.chatId);
      // console.log(this.chatRoomInfo[0]?.members.findIndex((value:any)=>value==this.senderId));
      this.chatRoomInfo[0].members.splice(this.chatRoomInfo[0]?.members.findIndex((value: any) => value == this.senderId), 1);
      // console.log(this.chatRoomInfo, this.senderId);
      setDoc(doc(this.dataBase, "chats", this.chatId), { info: this.chatRoomInfo }).then(() => {
        this.toastr.setToastMessage('Chat Room Left ')
        deleteDoc(deleteDocRef).then(() => {
          // console.log('chat with id ',this.chatId,' has been removed !')
        })
        this.chatId = null;

      })

    }
    else {
      const deleteDocRef = doc(this.dataBase, 'usersChatlists', this.senderId ?? '', 'chats', this.recieverId);
      deleteDoc(deleteDocRef).then(()=>this.toastr.setToastMessage('Chat Room Left '))
      this.chatId = null;
    }


  }
  shareProfile() {
    if (!this.chatRoomInfo) {
      const uId = localStorage.getItem('uid');
      const isAnonymous = uId?.startsWith('0x') ? true : false;
      if (uId && this.recieverId) {
        this.httpRequests.getUser(isAnonymous).subscribe((userDetails: any) => {
          const data: any = Object.values(userDetails)[0] || '';
          data.id = this.chatId;
          updateDoc(doc(this.dataBase, 'usersChatlists', this.recieverId, 'chats', uId || ''), data).then(() => {
            // console.log(response||'Success-Reciever')
            this.toastr.setToastMessage('Profile Shared Success')


          })
        })
      }
    }
    else {
      const uId = localStorage.getItem('uid');
      const isAnonymous = uId?.startsWith('0x') ? true : false;
      if (uId && this.recieverId) {
        this.httpRequests.getUser(isAnonymous).subscribe((userDetails: any) => {
          const data: any = Object.values(userDetails)[0] || '';
          data.id = uId;
          const chatRoomReff = collection(this.dataBase, 'chats', this.chatId, 'sharedProfiles')
          setDoc(doc(chatRoomReff, uId), { data: data }).then(() => {
            this.toastr.setToastMessage('Profile Shared Success')
          })
        })
      }
    }

  }
  getMemberInfo(id: any) {

    return this.sharedProfiles[this.sharedProfilesIds.findIndex((value: any) => value == id)]
  }
  toggleEmojiPicker() {
    //console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  addEmoji(emojiEvent: any, message: any) {
    message.value += emojiEvent?.emoji?.native;
  }
  showMemberDetail(memberData:any){
    Swal.fire({
      title: '<strong>- User Profile -</strong>',
      html:`
      <div>
      <img class="msg-img" style="height: 100px; border-radius: 70%;width: 100px;"
      src='${memberData?.profile}' (error)="errorImageHandler($event)"
      >
      <br>
      <hr>
      <br>
      <div>User Name : ${memberData?.name}</div>
      </div>
      `,
      showConfirmButton:false,
      showCloseButton: true,
      focusConfirm: false,
    })

  }
}
