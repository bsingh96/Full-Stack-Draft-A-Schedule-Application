import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { ViewpageComponent} from './components/viewpage/viewpage.component'
import { LoginComponent} from './components/login/login.component'
import { SignupComponent} from './components/signup/signup.component'
import { AboutComponent} from './components/about/about.component'
import { SearchComponent} from './components/search/search.component'
import {ReviewsComponent} from './components/reviews/reviews.component'
import {HomepageComponent} from './components/homepage/homepage.component'
import { VerifyComponent } from './components/emailVerify/verify.component'
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import {SettingsComponent} from './components/settings/settings.component'
import { AdminGuardGuard } from './admin-guard.guard';
import { UserGuard } from './user.guard';
import { CreateComponent } from './components/create/create.component';
import {AddComponent} from './components/add/add.component'
const routes : Routes = [
  {path: '', redirectTo:'viewpage', pathMatch:'full'},
  {path : 'viewpage' , component: ViewpageComponent},
  {path : 'login' , component: LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'about', component:AboutComponent},
  {path:'browse', component:SearchComponent},
  {path: 'reviews', component:ReviewsComponent},
  {path: 'add', component:AddComponent,canActivate:[UserGuard]},
  {path: 'homepage', component:HomepageComponent,canActivate:[UserGuard]},
  {path: 'verify', component:VerifyComponent},
  {path:'adminhome', component:AdminHomeComponent,canActivate:[AdminGuardGuard]},
  {path:'manageusers', component:ManageUsersComponent,canActivate:[AdminGuardGuard]},
  {path:'create', component:CreateComponent,canActivate:[UserGuard]},
  {path:'settings', component:SettingsComponent,canActivate:[UserGuard]}
  
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ViewpageComponent,LoginComponent,SignupComponent,
  AboutComponent,SearchComponent,ReviewsComponent, HomepageComponent,VerifyComponent,
  AdminHomeComponent,ManageUsersComponent,SettingsComponent,CreateComponent]
