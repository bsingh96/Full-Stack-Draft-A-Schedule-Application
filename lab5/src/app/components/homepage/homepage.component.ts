import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

User !: String;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.User=  String(localStorage.getItem("Name"));;

   
  }
  show(){
    var x =localStorage.getItem('Name');
    alert(x);
  }

  // logout empties the localstorage variables and redirects to homepage
  logout(){
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("Name");
    localStorage.removeItem("Email");
    this.router.navigate(['/viewpage'])
  }
}
