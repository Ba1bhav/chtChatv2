import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoomInfoComponent } from './components/chat-room-info/chat-room-info.component';
import { ChatComponent } from './components/chat/chat.component';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [
    ChatRoomInfoComponent,
    ChatComponent,
    SearchUserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
  ]
})
export class SharedModule { }
