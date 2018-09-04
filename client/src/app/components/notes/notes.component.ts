import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  constructor(private service: AppService) { }

  enterExpression = true;
  expression = false;

  ngOnInit() {
  }

  newNote() {
    this.expression = true;
    this.enterExpression = false;
  }

  closeNote(t,d) {
    if(t.innerHTML != '') {
      console.log(t.innerHTML);
      console.log(d.innerHTML);
    }
    var userId = localStorage.getItem('id');
    var note = {
      "userId": userId,
      "title": t.innerHTML,
      "description": d.innerHTML
    }
    this.expression = false;
    this.enterExpression = true;
    this.service.postRequest(note, 'savenote').subscribe((data: any) => {
      console.log(data);
    });
  }

}
