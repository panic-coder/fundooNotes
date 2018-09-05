import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { NoteCardComponent } from '../note-card/note-card.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes
  constructor(private service: AppService) { }

  enterExpression = true;
  expression = false;
  // notes;


  ngOnInit() {
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }

  newNote() {
    this.expression = true;
    this.enterExpression = false;
  }

  closeNote(title,description) {
    if(title.innerHTML != '') {
      console.log(title.innerHTML);
      console.log(description.innerHTML);
    }
    var userId = localStorage.getItem('id');
    var note = {
      "userId": userId,
      "title": title.innerHTML,
      "description": description.innerHTML
    }
    this.expression = false;
    this.enterExpression = true;
    this.service.postRequest(note, 'savenote').subscribe((data: any) => {
      console.log(data);
    });
  }

  update(title, description){
    this.closeNote(title, description);
    this.service.getRequest('readnote').subscribe((data: any) => {
      console.log(data.data);
      this.notes = data.data;
    });
  }

}
