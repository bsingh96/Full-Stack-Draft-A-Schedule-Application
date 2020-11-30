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
const routes : Routes = [
  {path : 'viewpage' , component: ViewpageComponent},
  {path : 'login' , component: LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'about', component:AboutComponent},
  {path:'browse', component:SearchComponent},
  {path: 'reviews', component:ReviewsComponent},
  {path: 'homepage', component:HomepageComponent},
  {path: 'verify', component:VerifyComponent},
  {path: '', redirectTo:'viewpage', pathMatch:'full'}
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ViewpageComponent,LoginComponent,SignupComponent,AboutComponent,SearchComponent,ReviewsComponent, HomepageComponent,VerifyComponent]
