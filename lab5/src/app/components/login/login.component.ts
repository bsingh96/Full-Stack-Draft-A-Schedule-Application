import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{VerifyService} from '../../services/verify.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email !: String;
  password !: String;
  display: boolean = false;
  url = 'http://www.localhost:3000/'
  constructor(private http: HttpClient,
    private verifyService: VerifyService , 
    private flashMessages: FlashMessagesService,
    private router: Router ) { }

  ngOnInit(): void {
  }
  validateUser(){
    const mail ={
      email:this.email
    }
    //console.log(mail);
    let headers = new HttpHeaders();
    headers.append('Content-type','application/json');
    this.http.put<any>(this.url+'api/public/authenticate', mail, {headers:headers}).subscribe(data=>{
      if(data.message =="Sucessfully Activated"){
       // this.flashMessages.show("Sucessfully Activated!", {cssClass:'success', timeout:'5000'});
       // this.flashMessages.show("** Account Active , You May Login ** ", {cssClass:'success', timeout:'5000'});
       this.router.navigate(['/verify'])
      }else{
        this.flashMessages.show("Something Went Wrong , Try Again !", {cssClass:'success', timeout:'5000'});
      }
  
  
    })
  
    }
  login(){
    const user = {
      email: this.email,
      password: this.password
    } 

    if(!this.verifyService.validateLogin(user)){
      this.flashMessages.show("Please fill in all fields !", {cssClass:'error', timeout:'5000'});
      return;
      //return false;
    }
  
    if(!this.verifyService.validateEmail(user.email)){
      this.flashMessages.show("Please enter a valid email !", {cssClass:'error', timeout:'5000'});
      return;
      //return false;
    }
    if(this.verifyService.validateLogin(user) && this.verifyService.validateEmail(user.email)){
      let headers = new HttpHeaders();
    headers.append('Content-type','application/json');
    this.http.post<any>(this.url+'api/secure/login', user, {headers:headers}).subscribe(data=>{
   // alert(data.message);

    if(data.message == "access granted"){
      //console.log("in")
      this.router.navigate(['/homepage']);
      localStorage.setItem("Name", data.name);
      localStorage.setItem("AccessToken",data.access_token);
      localStorage.setItem("RefreshToken", data.refreshToken_token);
      localStorage.setItem("Email", data.email);
      
    }else if(data.message == "password incorrect"){
      this.flashMessages.show("Incorrect Password, Try Again !", {cssClass:'error', timeout:'5000'});
    } else if(data.message == "access not granted"){
      this.flashMessages.show(" Account not verified, Try Again !", {cssClass:'error', timeout:'5000'});
      this.display=true;

    }else if(data.message == "Welcome Admin"){
      this.router.navigate(['/adminhome']);
      localStorage.setItem("Name", data.name);
      localStorage.setItem("AccessToken",data.access_token);
      localStorage.setItem("RefreshToken", data.refreshToken_token);
    }else if(data.message == "Incorrect Pasword for admin"){
      this.flashMessages.show("Incorrect Admin Password, Try Again !", {cssClass:'error', timeout:'5000'});
    }else if(data.message == "Account does not exist"){
      this.flashMessages.show("Account Does Not Exist With The Given Email, Try Again !", {cssClass:'error', timeout:'5000'});
    }else if(data.message == "user deactivated"){
      this.flashMessages.show("This Account Is Deactivated, Contact The Administrator !", {cssClass:'error', timeout:'5000'});
    }
    
  })
    }

  }
}
