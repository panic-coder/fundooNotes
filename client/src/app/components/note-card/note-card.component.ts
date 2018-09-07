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
  colorMenu = false;
  colors = [ '#fff',

  "rgb(255, 138, 128)",
  // '#e8e8e8',

  "rgb(255, 209, 128)",

  "rgb(255, 255, 141)",

  'rgb(204, 255, 144)',

  'rgb(167, 255, 235)',

  'rgb(128, 216, 255)',

  'rgb(130, 177, 255)',

  'rgb(179, 136, 255)',

  'rgb(248, 187, 208)',

  'rgb(215, 204, 200)',

  'rgb(207, 216, 220)'
]
  constructor(private service: AppService) {
    // this.service.getRequest('readnote').subscribe((data: any) => {
      // console.log(data);
      // console.log(data.data);
      // this.notes = data.data;
    // })
  }

 addArchive(){
   this.data.isArchive = true;
   this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((data: any) => {
     console.log(data);
     
   })
 }
 removeArchive(){
   this.data.isArchive = false;
   this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((data: any) => {
     console.log(data);
     
   })
 }

 colorChange() {
   if(this.colorMenu)
      this.colorMenu = false
   else
      this.colorMenu = true;
 }
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
