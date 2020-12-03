import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  mainUrl = 'http://www.localhost:3000'
   Username = localStorage.getItem("Name");
   view: boolean = false;
  constructor(
    private http: HttpClient
  ) { }
  
  courses!: any[];

  expand(){
    this.view = true;
  }

  addCourse(course_subject:String,button_id:String,coursename:String){
    var buttonid= button_id;
    var schedule = (<HTMLInputElement>document.getElementById("Schedulenaming")).value;
    //var link = "/api/schedule/savedCourse?"+"Schedulenaming="+schedule+"&course_subject="+course_subject+"&button_id="+button_id+"&name="+coursename;
    var send ={
    ScheduleName:schedule,
    subject: course_subject,
    Code: button_id,
    Name : coursename
    }
    //console.log(link);
    this.http.put<any>(this.mainUrl + '/api/schedule/save/course' , send).subscribe(() => {
     alert("Added " +course_subject+" "+ button_id + " : " + coursename + " to "+ schedule);

    })
  
  }
  showResults1() : void {
    var div = document.getElementById("show12");
    var courseCode = (<HTMLInputElement>document.getElementById("courseID")).value;
    var courseNum = (<HTMLInputElement>document.getElementById("courseNumber")).value;
    var courseComp = (<HTMLInputElement>document.getElementById("courseComp")).value;
    if(courseCode == "all_subjects" && courseNum == ""){
      //alert("Unable to display your search results as it exceeds 200 courses. Please refine your search.");
      var header = document.createElement("H2");
      div?.setAttribute("class","newdiv11");
      var text = document.createTextNode("Unable to display your search results as it exceeds 100 courses. Please refine your search.");
      header.appendChild(text);
      div?.appendChild(header);
      return;
      }
    console.log(courseCode);
    console.log(courseNum + " " + courseComp);
    var link = "/api/courses?"+ "course=" + courseCode +"&courseNum=" + courseNum+ "&courseComponent=" + courseComp;

    this.http.get<any>(this.mainUrl + link).subscribe((data: any) => {
      //console.log(data);
      this.courses = data;
      console.log(this.courses);
    })
  }
    
  ngOnInit(): void {
    
    this.http.get<any>(this.mainUrl + '/api/courses/subject').subscribe(data => {
      //console.log(data);

    var selected = document.getElementById("courseID");
    for(let i=0;i<data.length; i++){
        var newOptions = document.createElement('option');
        var optionTexts = document.createTextNode(data[i]);
        newOptions.appendChild(optionTexts);
       // console.log(newOptions);
        selected?.appendChild(newOptions);
    }
    })

    var user ={
      Name:localStorage.getItem("Name")
    }
    this.http.put<any>(this.mainUrl +'/api/secure/savedschedules',user).subscribe(data =>{
      var select = document.getElementById("Schedulenaming");
      console.log(data)
      for(let i=0;i<data.length;i++){
          var newOptions = document.createElement('option');
        //  newOptions.setAttribute("value",result[i].scheduleName);
        console.log(user);
          var optionTexts = document.createTextNode(data[i]);
          newOptions.appendChild(optionTexts);
          select?.appendChild(newOptions);
          console.log(newOptions)
      }
    })

   
    
  }
  }



