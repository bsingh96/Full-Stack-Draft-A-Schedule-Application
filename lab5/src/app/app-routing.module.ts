import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewpageComponent} from './components/viewpage/viewpage.component'
import { LoginComponent} from './components/login/login.component'
const routes : Routes = [
  {path : 'viewpage' , component: ViewpageComponent},
  {path : 'login' , component: LoginComponent},
  {path: '', redirectTo:'viewpage', pathMatch:'full'}
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ViewpageComponent,LoginComponent]
