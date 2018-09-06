import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {
  @Input() data: any;

  hover;
  showPanel = false;
  current;
  constructor(private service: AppService) {
    this.service.getRequest('readnote').subscribe((data: any) => {
      // console.log(data);
      console.log(data.data);
      // this.notes = data.data;
    })
  }

  // hoverFunction(data) {
  //   this.current = data;
  //   if (this.hover) {
  //     this.hover = this.hover = false;
  //   } else {
  //     this.hover = this.hover = true;
  //   }
  // }

  // readAll() {
  //   this.service.getRequest('readnote').subscribe((data: any) => {
  //     // console.log(data);
  //     console.log(data.data);
  //     this.notes = data.data;
  //   })
  // }

  addMore(data){
    console.log(data);
    if (this.showPanel) {
      this.showPanel = false;
    } else {
      this.showPanel = true;
    }
  }

  addColor(data){
    console.log(data);
  }
  trash(data){
    console.log(data);
    data.isTrash = true;
    this.service.updateRequest('updatenote', data._id, data).subscribe((data: any) => {
      console.log(data);
      
    })
    // this.service.deleteRequest('deletenote', data._id).subscribe((data:any) => {
    //   console.log(data);
    // })
    
  }

  ngOnInit() { }


}
