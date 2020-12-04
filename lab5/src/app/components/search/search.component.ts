import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  keyword !: String;
  hi : boolean =false;
  reviews: any[];
  mainUrl = 'http://www.localhost:3000'
  storage: any[];
  constructor(private http: HttpClient){
    this.storage = [];
    this.reviews =[];
  
  }

  show(){
    this.hi = true;
  }

  getKeyword(){
    var div = document.getElementById("show13");
    div?.innerHTML;
   const info = this.keyword;

    this.http.get<any>(this.mainUrl +'/api/courses/keywordmatch?Input='+info).subscribe(data =>{
      if(data.length == null || data.length == undefined){
        var header = document.createElement("H2");
        div?.setAttribute("class","newdiv11");
        var text = document.createTextNode("No Results Found !");
        header.appendChild(text);
        div?.appendChild(header);
        return;
      }else{
        this.storage = data;
      }
    
    })
  }

  loadReviews(course_subject:String,button_id:String,coursename:String){
    var info_2 ={
      CourseName: coursename
    }

    this.http.put<any>(this.mainUrl +'/api/courses/reviews', info_2).subscribe(data=>{
      this.reviews = data;
    })
   // alert("I work")
  }
  getSubjects() : void {
    var div = document.getElementById("show13");
    div?.innerHTML;
    var courseCode = (<HTMLInputElement>document.getElementById("courseID1")).value;
    var courseNum = (<HTMLInputElement>document.getElementById("courseNumber")).value.toUpperCase();
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

  
    //console.log(courseCode);
    //console.log(courseNum + " " + courseComp);
    var link = "/api/courses?"+ "course=" + courseCode +"&courseNum=" + courseNum+ "&courseComponent=" + courseComp;

    this.http.get<any>(this.mainUrl + link).subscribe((data: any) => {
      console.log(data);
      
      if(data.length == 0 || data.length == undefined || data.error1 == "Cannot Find Course"){
        var header = document.createElement("H2");
        div?.setAttribute("class","newdiv11");
        var text = document.createTextNode("No Results Found !");
        header.appendChild(text);
        div?.appendChild(header);
        return;
      }else{
        this.storage = data;

      }
      //console.log(this.storage);
    })
   
  }

  
  title = 'Lab 4';
// populates the dropdown menu on load
  ngOnInit(){
    this.http.get<any>(this.mainUrl + '/api/courses/subject').subscribe(data => {
      //console.log(data);

    var selected = document.getElementById("courseID1");
    for(let i=0;i<data.length; i++){
        var newOptions = document.createElement('option');
        var optionTexts = document.createTextNode(data[i]);
        newOptions.appendChild(optionTexts);
       // console.log(newOptions);
        selected?.appendChild(newOptions);
    }
    })
  }

}
