import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import { FirebaseService } from 'services/shared/firebase.service';
import { WindowService } from 'services/shared/window.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
  windowRef:any;
  App:any;
  loginForm:FormGroup;
  errorToggle:boolean=false;
  constructor(private window:WindowService,private firbaseService:FirebaseService){
    this.windowRef=window.windowRef;
    this.loginForm=new FormGroup({
      phone:new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]{10}')]),
      otp:new FormControl('',[Validators.required,Validators.maxLength(6),Validators.minLength(6)])

    })
  }
  auth = getAuth(this.firbaseService.app()||undefined);
  ngOnInit(){

    this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response:any) => {
       console.log(response)
      },
      'expired-callback': () => {
     console.log('Error !')
      }
    }, this.auth);
    this.windowRef.recaptchaVerifier.render()
  }

   logIn(){
   console.log('Hii !')
   }
    get _loginControls(){
     return this.loginForm.controls
   }
   errorToggler(){
     this.errorToggle=true;
     setTimeout(()=>this.errorToggle=false,2000)
   }
   numberCheck(value:any){
     value.value=value.value.match('[0-9]+')
   }
   sendOtp(){
      const appVerifier = this.windowRef.recaptchaVerifier;
      signInWithPhoneNumber(this.auth,'+919780255788', appVerifier).then((result:any) => {
        this.windowRef.confirmationResult = result;

    })
    .catch( (error:any) => console.log(error) );


   }

}
