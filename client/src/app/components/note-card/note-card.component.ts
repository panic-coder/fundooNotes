import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {
  @Input() notes: any;
  hover = false;
  current;
  constructor(private service: AppService) {
    this.service.getRequest('readnote').subscribe((data: any) => {
      // console.log(data);
      console.log(data.data);
      this.notes = data.data;
    })
  }

  hoverFunction(data) {
    this.current = data;
    if (this.hover) {
      this.hover = this.hover = false;
    } else {
      this.hover = this.hover = true;
    }
  }

  readAll() {
    this.service.getRequest('readnote').subscribe((data: any) => {
      // console.log(data);
      console.log(data.data);
      this.notes = data.data;
    })
  }

  addMore(data){
    console.log(data);
    
  }

  ngOnInit() { }


}
