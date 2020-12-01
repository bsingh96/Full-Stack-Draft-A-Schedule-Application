import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  mainUrl= 'http://www.localhost:3000'
  constructor(
    private http: HttpClient
  ) { }

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


