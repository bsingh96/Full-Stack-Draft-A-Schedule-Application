import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  sendCredentials(){

  var name = (<HTMLInputElement>document.getElementById("name")).value;
  var email = (<HTMLInputElement>document.getElementById("login-email")).value;
  var password = (<HTMLInputElement>document.getElementById("password")).value;
  var passwordconfirm = (<HTMLInputElement>document.getElementById("password2")).value;




  if( password !=passwordconfirm){
    alert("Passwords do not match !");
    window.location.reload();
  }
  console.log(name);
  console.log(email);
  console.log(passwordconfirm);
  }

}
