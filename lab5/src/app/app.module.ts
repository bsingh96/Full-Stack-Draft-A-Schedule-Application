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
import {AuthorizeService} from './services/authorize.service'
@NgModule({
  declarations: [
    AppComponent,
    ViewpageComponent,
    LoginComponent,
    SignupComponent,
    AboutComponent,
    SearchComponent,
    ReviewsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    FlashMessagesModule.forRoot()
   
  ],
  providers: [ VerifyService, AuthorizeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
