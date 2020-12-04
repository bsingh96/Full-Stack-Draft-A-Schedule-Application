import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  ok!: String;
  Email!:String;
  password !:String;
  mainUrl = 'http://www.localhost:3000'
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.ok = String(localStorage.getItem("Name"));
    this.Email = String(localStorage.getItem("Email"));
  }
  updatePassword(){
    var email= localStorage.getItem("Email")
    const User ={
      Email: email,
      Password: this.password
    }
    this.http.post<any>(this.mainUrl + '/api/secure/updatepassword',User).subscribe(data=>{
      alert("passwordUpdated");
    })
  }
}
