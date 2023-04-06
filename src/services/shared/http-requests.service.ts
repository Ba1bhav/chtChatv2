import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {urls} from '../../commons/constants'
@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {
  constructor(private request:HttpClient) { }
  registerUser(anonymous:boolean){
    const uid=localStorage.getItem('uid')
    const data={"uid": uid}
    const token=localStorage.getItem("idToken")
    return this.request.post(urls.realtimeDb+(anonymous?urls.metaMaskUrl:urls.phoneUrl)+uid+'.json'+(anonymous?'':'?auth='+token),data)
  }

  getUser(anonymous:boolean){
    const uid=localStorage.getItem('uid')
    const token=localStorage.getItem("idToken")
    return this.request.get(urls.realtimeDb+(anonymous?urls.metaMaskUrl:urls.phoneUrl)+uid+'.json'+(anonymous?'':'?auth='+token))
  }

}
