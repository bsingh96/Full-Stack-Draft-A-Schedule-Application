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
  count =0;
  constructor(
    private http: HttpClient,
    private flashMessages: FlashMessagesService,
    ) { }

  ngOnInit(): void {
    var user ={
      Name:localStorage.getItem("Name")
    }
    this.http.put<any>(this.mainUrl +'/api/secure/savedschedules',user).subscribe(data =>{
      var select = document.getElementById("Schedulenaming");
      console.log(data.length)
      this.count = data.length;
      console.log(this.count)
      for(let i=0;i<data.length;i++){
          var newOptions = document.createElement('option');
        //  newOptions.setAttribute("value",result[i].scheduleName);
        //console.log(user);
          var optionTexts = document.createTextNode(data[i].scheduleName + "-" + data[i].visibility);
          newOptions.appendChild(optionTexts);
          select?.appendChild(newOptions);
          //console.log(newOptions)
      }
    })
  }
   // function to make a schedule public
  work(){
      var x = (<HTMLInputElement>document.getElementById("Schedulenaming")).value;
      var y = x.split('-')[0]
      console.log(y)
      const pass ={
        scheduleName : y
      }
      console.log(pass)
      this.http.put<any>(this.mainUrl + '/api/schedule/makepublic',pass).subscribe( data =>{
        alert(y + " successfully made public!");
        window.location.reload();
      })
    
      
    
  }
  // function to make a schedule private
  work2(){
    var x = (<HTMLInputElement>document.getElementById("Schedulenaming")).value;
      var y = x.split('-')[0]
      console.log(y)
      const pass ={
        scheduleName : y
      }
      console.log(pass)
      this.http.put<any>(this.mainUrl + '/api/schedule/makeprivate',pass).subscribe( data =>{
        alert(y+ " successfully made private!");
        window.location.reload();
      })
  }

  // function to add schedule and ensure limit constraints are met

  addSchedule(){
  
  var user = localStorage.getItem("Name");
  const info = {
    ScheduleName : this.ScheduleName,
    ScheduleDescription: this.ScheduleDescription,
    Name: user
  }
  const regex = /^[^<>:/?#@!&;]*$/;
  
  
  if(this.ScheduleName==undefined){
    this.flashMessages.show("Fill in all applicable fields !", {cssClass:'error', timeout:'5000'});
  }else if(!info.ScheduleName.match(regex)){
    alert("Invalid Input!");
    window.location.reload();
  }else if(this.count <20){
    this.http.put<any>(this.mainUrl +'/api/createschedule',info).subscribe( data=>{
      if(data.message == "add"){
        this.flashMessages.show("Schedule successfully created!", {cssClass:'error', timeout:'5000'});
        
      }else{
        this.flashMessages.show("Schedule with the given name already exists !", {cssClass:'error', timeout:'5000'});
      }
    })
  }
}
}
