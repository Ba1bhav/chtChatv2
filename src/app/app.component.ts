import { Component, HostListener} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  uidHandler: string | null;
  constructor(private router:Router){
    this.uidHandler=localStorage.getItem('uid');
  }
  @HostListener('window:storage')
  onStorageChange() {
    console.log('Smart Guy');

    if(localStorage.getItem('uid')&&!this.uidHandler){
      this.uidHandler=localStorage.getItem('uid');
    }
    if(localStorage.getItem('uid')&&this.uidHandler){
      if(localStorage.getItem('uid')!==this.uidHandler){
          localStorage.clear()
          this.router.navigate(['login'])
      }
    }
  }


}
