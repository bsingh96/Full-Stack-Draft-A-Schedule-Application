import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Component, OnInit } from '@angular/core';
import{VerifyService} from '../../services/verify.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {Router} from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  url = 'http://localhost:3000/'
  name!: String;
  email!: String;
  password!: String;
  password2!: String;
  
  constructor(
    private http : HttpClient , 
    private verifyService: VerifyService , 
    private flashMessages: FlashMessagesService,
    private router : Router
    

    ) { 
   
  }
  display: boolean = false;

  ngOnInit(): void {
  
  }
  // authenticate user to login
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
  
  sendCredentials(){
  // register user

 
  const user = {
    name: this.name,
    email: this.email,
    password: this.password,
    role: "user",
    status: "inactive"
  }
  //console.log(user.password)

  if(this.password2 != user.password){
    this.flashMessages.show("Passwords are not a match !", {cssClass:'error', timeout:'5000'});
  }
  if(!this.verifyService.validateSignup(user)){
    this.flashMessages.show("Please fill in all fields !", {cssClass:'error', timeout:'5000'});
    return;
    //return false;
  }

  if(!this.verifyService.validateEmail(user.email)){
    this.flashMessages.show("Please enter a valid email !", {cssClass:'error', timeout:'5000'});
    return;
    //return false;
  }
  // register user
  if(this.password2 == user.password && this.verifyService.validateSignup(user)&& this.verifyService.validateEmail(user.email)){
  let headers = new HttpHeaders();
  headers.append('Content-type','application/json');
  this.http.post<any>(this.url+'api/public/register', user, {headers:headers}).subscribe(data=>{
    if(data.message =="User added"){
      this.flashMessages.show("Sucessfully Registered !", {cssClass:'success', timeout:'5000'});
      this.flashMessages.show("** Account not active ** ", {cssClass:'success', timeout:'5000'});
      this.display=true;
    }else{
      this.flashMessages.show("Account already exists with the given email, Try Again!", {cssClass:'success', timeout:'5000'});
    }
    
  })

  }

  }
  



  
}
