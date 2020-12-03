import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  ScheduleName !: String;
  ScheduleDescription !: String;
  mainUrl = 'http://www.localhost:3000'
  constructor(
    private http: HttpClient,
    private flashMessages: FlashMessagesService,
    ) { }

  ngOnInit(): void {
  }

  addSchedule(){
  var user = localStorage.getItem("Name");
  const info = {
    ScheduleName : this.ScheduleName,
    ScheduleDescription: this.ScheduleDescription,
    Name: user
  }
    this.http.put<any>(this.mainUrl +'/api/createschedule',info).subscribe( data=>{
      if(data.message == "add"){
        this.flashMessages.show("Schedule successfully created!", {cssClass:'error', timeout:'5000'});
      }else{
        this.flashMessages.show("Schedule with the given name already exists !", {cssClass:'error', timeout:'5000'});
      }
    })
  }
}
