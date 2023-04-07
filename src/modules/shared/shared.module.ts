import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoomInfoComponent } from './components/chat-room-info/chat-room-info.component';
import { ChatComponent } from './components/chat/chat.component';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ChatRoomInfoComponent,
    ChatComponent,
    SearchUserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
