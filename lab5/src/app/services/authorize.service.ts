import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(private http: HttpClient) { }


  registerUser(user: any){
    let headers = new HttpHeaders();
    headers.append('Content-type','application/json');
  return this.http.post('/api/public/register', user,{headers:headers}).subscribe()
  }
}
