import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  notes() {
    this.router.navigate(['home/notes']);
  }

  reminders() {
    this.router.navigate(['home/reminders']);
  }

  archive() {
    this.router.navigate(['home/archive']);
  }

  trash() {
    this.router.navigate(['home/trash']);
  }

}
