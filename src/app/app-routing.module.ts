import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from 'src/modules/auth/components/sign-in/sign-in.component';
import { SearchUserComponent } from 'src/modules/shared/components/search-user/search-user.component';

const routes: Routes = [
  {path:'login',component:SignInComponent},
  {path:'',component:SearchUserComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
