import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FlashMessagesService} from 'angular2-flash-messages';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  mainUrl= 'http://www.localhost:3000'
  constructor(
    private http: HttpClient,
    private flashMessages: FlashMessagesService
  ) { }


  activate(){
    var email_activate = (<HTMLInputElement>document.getElementById("users")).value;
    const user = {
      email: email_activate
    }
    this.http.put<any>(this.mainUrl + '/api/secure/activateuser',user).subscribe(data => {
      if(data.message== "Sucessfully activated"){
      this.flashMessages.show(email_activate+" is now activated!", {cssClass:'success', timeout:'5000'});
      }
    })
  }

  deactivate(){
    var email_deactivate = (<HTMLInputElement>document.getElementById("users")).value;
    const user = {
      email: email_deactivate
    }
    this.http.put<any>(this.mainUrl + '/api/secure/deactivateuser',user).subscribe(data => {
      if(data.message=="Sucessfully deactivated"){
      this.flashMessages.show(email_deactivate+" is now deactivated!", {cssClass:'success', timeout:'5000'});
      }
      
    })
  }
  ngOnInit(): void {
    this.http.get<any>(this.mainUrl + '/api/secure/allusers').subscribe(data => {
      //console.log(data);

    var selected = document.getElementById("users");
    for(let i=0;i<data.length; i++){
        var newOptions = document.createElement('option');
        var optionTexts = document.createTextNode(data[i]);
        newOptions.appendChild(optionTexts);
        console.log(newOptions);
        selected?.appendChild(newOptions);
    }
    })
  }
  }


