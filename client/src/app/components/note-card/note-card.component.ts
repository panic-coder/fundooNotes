import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {

  constructor(private service: AppService) { }
  noteData;
  ngOnInit() {
    this.service.getRequest('readnote').subscribe((data: any) => {
      console.log(data);
      console.log(data.data);
      
      this.noteData = data.data;
    })
  }

}
