import { Component} from '@angular/core';
import { urls } from 'src/commons/constants';
@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent {
  urls=urls
logOut(){
  localStorage.clear()
}
}
