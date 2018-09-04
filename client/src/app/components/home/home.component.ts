import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  raw_data
  firstCharacter = '';
  name = ''
  email = ''
  sign = false;
  shiftDiv = false;

  ngOnInit() {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(localStorage.getItem('token'));
    this.raw_data = decodedToken;
    localStorage.setItem('name',this.raw_data.name);
    localStorage.setItem('id',this.raw_data.data);
    var user = localStorage.getItem('name');
    this.firstCharacter = user[0];
  }

  name1 = "Google"
  name2 = "Keep"

  notes() {
    this.name1 = "Google"
    this.name2 = "Keep"
    this.router.navigate(['home/notes']);
    console.log(this.raw_data);
    
  }

  reminders() {
    this.name1 = "Reminders"
    this.name2 = ""
    this.router.navigate(['home/reminders']);
  }

  archive() {
    this.name1 = "Archive"
    this.name2 = ""
    this.router.navigate(['home/archive']);
  }

  trash() {
    this.name1 = "Trash"
    this.name2 = ""
    this.router.navigate(['home/trash']);
  }

  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    this.router.navigate(['']);
  }

  signoutCard() {
    if(this.sign){
      this.sign = false;
    } else {
      this.sign = true;
    }
    
    this.name =  this.raw_data.name;
    this.email = this.raw_data.email;
  }

  appClick() {
    
  }

  shift(){
    if(this.shiftDiv){
      this.shiftDiv = false;
    } else {
      this.shiftDiv = true;
    }
    // console.log(this.shiftDiv);
    
  }
}
