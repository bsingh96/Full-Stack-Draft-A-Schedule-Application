import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewpageComponent } from './components/viewpage/viewpage.component';
import { LoginComponent } from './components/login/login.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './components/signup/signup.component';
import { AboutComponent } from './components/about/about.component';
import {SearchComponent} from './components/search/search.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { FormsModule } from '@angular/forms';
import {VerifyService} from './services/verify.service'
import { FlashMessagesModule } from 'angular2-flash-messages';
import {AuthorizeService} from './services/authorize.service';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VerifyComponent } from './components/emailVerify/verify.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CreateComponent } from './components/create/create.component';
import { AddComponent } from './components/add/add.component'
import {MatExpansionModule} from '@angular/material/expansion'
import {HashLocationStrategy , LocationStrategy} from '@angular/common';
import { ViewComponent } from './components/view/view.component'
import {MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewpageComponent,
    LoginComponent,
    SignupComponent,
    AboutComponent,
    SearchComponent,
    ReviewsComponent,
    HomepageComponent,
    VerifyComponent,
    AdminHomeComponent,
    ManageUsersComponent,
    SettingsComponent,
    CreateComponent,
    AddComponent,
    DialogComponent,
    ViewComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    MatExpansionModule,
    MatDialogModule
   
  ],
  providers: [ VerifyService, AuthorizeService, {provide:LocationStrategy,useClass:HashLocationStrategy }],
  bootstrap: [AppComponent],
  entryComponents:[DialogComponent]
})
export class AppModule { }
