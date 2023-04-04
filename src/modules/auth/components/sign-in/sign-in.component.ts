import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getAuth, RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import { FirebaseService } from 'src/services/shared/firebase.service';
import { WindowService } from 'src/services/shared/window.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
  isHuman:boolean=false;
  otpInputToggle:boolean=false;
  windowRef:any;
  App:any;
  loginForm:FormGroup;
  errorToggle:boolean=false;
  otp:string='';
  otpInputConfig={
    length:6,
    inputStyles: {
    width: "30px",
    height: "30px",
  },
  allowNumbersOnly:true,
}

  constructor(private window:WindowService,private firbaseService:FirebaseService){
    this.windowRef=window.windowRef;
    this.loginForm=new FormGroup({
      phone:new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]{10}')]),
    })
  }
  auth = getAuth(this.firbaseService.app()||undefined);
  ngOnInit(){

    this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size':'normal',
      'callback': (response:any) => {
       this.isHuman=true;
       console.log(response)
      },
      'expired-callback': () => {
     console.log('Error !')
     this.isHuman=false
      }
    }, this.auth);

    this.windowRef.recaptchaVerifier.render()

  }

   logIn(){
   console.log('Verifying !!')
   this.otpInputToggle=false;
   console.log(this.loginForm.value.otp)
    if(this.otp?.length===6){
      this.verifyOtp(this.otp)
    }
    else{
      console.log('Error!')
    }
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
      if(this.isHuman){
      signInWithPhoneNumber(this.auth,'+918628921043', appVerifier).then((result:any) => {
        this.otpInputToggle=true;
        console.log(result)
        this.windowRef.confirmationResult = result;
        this.windowRef.recaptchaVerifier.clear()
        this.loginForm.get('phone')?.disable()
    })
    .catch( (error:any) => {
      console.log(error)
      this.loginForm.get('phone')?.enable()
    });

  }
  else{
    console.log(this.errorToggler())
  }
   }

 verifyOtp(code:string)
      { code='123456'
        this.windowRef.confirmationResult.confirm(code).then((result:any) => {
        const user = result.user;
        localStorage.setItem('Response',JSON.stringify(result))
        localStorage.setItem('user',JSON.stringify(user))
        console.log(result)
      }).catch((error:any) => {
        console.log(error)
        this.loginForm.get('phone')?.enable()
      });
  }
  onOtpInput(event:any){
    this.otp=event
  }
}
