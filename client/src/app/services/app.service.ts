import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  link = 'http://localhost:3000/';

  postRequest(user, url) {
    // var requestHeader = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.link+url, user);
  }

  getRequest(url){
    var id = localStorage.getItem('id')
    // var requestHeader = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(this.link+url+'/'+id);
  }

  deleteRequest(url, noteId) {
    return this.http.delete(this.link+url+'/'+noteId);
  }

  updateRequest(url, noteId, note) {
    var requestHeader = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(this.link+url+'/'+noteId, note , { headers: requestHeader});
  }
}
