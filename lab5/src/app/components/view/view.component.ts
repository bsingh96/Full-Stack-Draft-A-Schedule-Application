import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

import { MatDialog } from '@angular/material/dialog';
import {DialogComponent} from '.././dialog/dialog.component'
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  mainUrl= 'http://www.localhost:3000'

  show!: any[];
  
  schedulename !: String;
  description !: String;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { 
    this.store = []
  }
  store : any[];

deleteSchedule(){
let dialogref = this.dialog.open(DialogComponent)
dialogref.afterClosed().subscribe(result =>{
  console.log(`Dialog result: ${result}`);

  if(result == "true"){
    //alert("hi")
    var schedule = (<HTMLInputElement>document.getElementById("Schedulenaming")).value;
    var y = schedule.split('-')[0]
    if(schedule == ""){// if dropdown menu is empty, alert user 
     alert("There are no schedules available to delete.");
     return;
   }
    var link = "/api/schedule/savedCourse/delete?"+"Schedulenaming="+y;
    //delete request to delete the specific schedule from the database 
    this.http.delete<any>(this.mainUrl + link).subscribe(data =>{
     if(data.alert == "sucessfully deleted."){
     alert("This schedule was sucesfully deleted. ");
     window.location.reload();
   }else{
   alert("This schedule could not be deleted. Try again.")
   }
   
    })
  }
})

}
/*
  deleteSchedule() {
    var schedule = (<HTMLInputElement>document.getElementById("Schedulenaming")).value;
    var y = schedule.split('-')[0]
    if(schedule == ""){// if dropdown menu is empty, alert user 
     alert("There are no schedules available to delete.");
     return;
   }
    var link = "/api/schedule/savedCourse/delete?"+"Schedulenaming="+y;
    //delete request to delete the specific schedule from the database 
    this.http.delete<any>(this.mainUrl + link).subscribe(data =>{
     if(data.alert == "sucessfully deleted."){
     alert("This schedule was sucesfully deleted. ");
     window.location.reload();
   }else{
   alert("This schedule could not be deleted. Try again.")
   }
   
    })
     
     } */

  ngOnInit(): void {
    var user ={
      Name:localStorage.getItem("Name")
    }

    
    this.http.put<any>(this.mainUrl +'/api/secure/savedschedules',user).subscribe(data =>{
      var select = document.getElementById("Schedulenaming");
      console.log(data.length)
      //this.count = data.length;
      //console.log(this.count)
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

  displaySchedule(){
    var schedule = (<HTMLInputElement>document.getElementById("Schedulenaming")).value;
    var y = schedule.split('-')[0]
    var user ={
      Name:localStorage.getItem("Name"),
      ScheduleName: y
    }
   
    this.http.put<any>(this.mainUrl + '/api/secure/loadschedule',user).subscribe(data =>{
      //console.log(data)
      this.schedulename = y;
      //console.log(this.schedulename)
      this.description =data[0].Description;
      //console.log(data[0].coursesInformation.length)
      this.store = data;
      console.log(this.store)
      for(let i=0;i<data[0].coursesInformation.length;i++){
      
     console.log(data[0].coursesInformation[i].courseSubject)
        this.http.get<any>(this.mainUrl + "/api/courses?"+ "course=" + data[0].coursesInformation[i].courseSubject +"&courseNum=" + data[0].coursesInformation[i].courseCode+ "&courseComponent=all_components" ).subscribe((data3: any) => {
          
         //this.store.push(data);
         //this.store = data;
          this.store=data3  ;
          console.log(this.store)
        })

        //console.log(this.store)
      }
     
      
     
    })
  }

}
