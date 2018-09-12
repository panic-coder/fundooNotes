import { Component, OnInit, Input, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogOverviewExampleDialog } from '../dialog/dialog.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent implements OnInit {
  @Input() data: any;
  @Output() onStatusChange = new EventEmitter<boolean>();
  @Input() view:boolean;


  title;
  description;
  hover;
  fillTheColor;
  showPanel = false;
  current;
  colorMenu = false;
  colors = [
    '#fff',

    'rgb(255, 138, 128)',

    'rgb(255, 209, 128)',

    'rgb(255, 255, 141)',

    'rgb(204, 255, 144)',

    'rgb(167, 255, 235)',

    'rgb(128, 216, 255)',

    'rgb(130, 177, 255)',

    'rgb(179, 136, 255)',

    'rgb(248, 187, 208)',

    'rgb(215, 204, 200)',

    'rgb(207, 216, 220)'
  ]

  constructor(private service: AppService, public dialog: MatDialog) { 
    // if(this.data.color != null){
    //   this.fillTheColor = this.data.color;
    // }
    // console.log(data);
  }

  update() {
    this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((data: any) => {
      console.log(data);
      this.changeStatus(true);
    })
  }

  changeStatus(finished: boolean) {
    this.onStatusChange.emit(finished);
  }

  addArchive() {
    this.data.isArchive = true;
    this.data.isPinned = false;
    this.update();
  }

  removeArchive() {
    this.data.isArchive = false;
    this.update();
  }

  colorChange() {
    if (this.colorMenu)
      this.colorMenu = false
    else
      this.colorMenu = true;
  }

  addMore(data) {
    console.log(data);
    if (this.showPanel) {
      this.showPanel = false;
    } else {
      this.showPanel = true;
    }
  }

  addColor(color) {
    console.log(color);
    this.fillTheColor = color;
    this.data.color = color;
    this.update();
  }

  trash(data) {
    console.log(data);
    this.data.isTrash = true;
    this.data.isArchive = false;
    this.update();
  }

  pinIt() {
    console.log(this.data);
    if(this.data.isPinned)
      this.data.isPinned = false;
    else{
      this.data.isPinned = true;
      this.data.isArchive = false;
    }
    this.update();
  }

  ngOnInit() {
     if(this.data.color != null){
      this.fillTheColor = this.data.color;
    }
   }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : '+result.title.innerHTML);
      console.log("Description : "+result.description.innerHTML);
      
      this.data.title = result.title.innerHTML;
      this.data.description = result.description.innerHTML;
      console.log(this.data); 
      this.update();
    });
  }

}




