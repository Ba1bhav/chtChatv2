import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {
  url='https://chitchatv2-f816e-default-rtdb.asia-southeast1.firebasedatabase.app/users/'
  gsurl='https://firebasestorage.googleapis.com/v0/b/chitchatv2-f816e.appspot.com/o/profile/'
  constructor(private request:HttpClient) { }
  registerUser(){
    const data={"uid": "pU3Q54x4yvX8pJa8yZnM5iMjN5D2",
    "phone_number": "8628921043",
    "name":"Baibhav Kumar Guleria"
    }
    const uid=localStorage.getItem('uid')
    const token=localStorage.getItem("idToken")
    return this.request.post(this.url+uid+'.json'+'?auth='+token,data)
  }

getUser(){
    const uid=localStorage.getItem('uid')
    const token=localStorage.getItem("idToken")
    return this.request.get(this.url+uid+'.json'+'?auth='+token)
  }
profilePic(){
    const uid=localStorage.getItem('uid')
    const token=localStorage.getItem("idToken")
    return this.request.post(this.gsurl+uid+'?auth='+token,{'test':'data'})
  }
}
