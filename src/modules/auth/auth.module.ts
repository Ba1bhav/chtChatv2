import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AuthModule { }
