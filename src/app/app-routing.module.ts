import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from 'src/modules/auth/components/sign-in/sign-in.component';
import { DashboardComponent } from 'src/modules/shared/components/dashboard/dashboard.component';

const routes: Routes = [
  {path:'login',component:SignInComponent},
  {path:'',component:DashboardComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
