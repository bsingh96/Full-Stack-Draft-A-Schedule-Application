import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
ok:boolean=false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.ok=true;
   
  }
  show(){
    var x =localStorage.getItem('Name');
    alert(x);
  }
  logout(){
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("Name");
    this.router.navigate(['/viewpage'])
  }
}
