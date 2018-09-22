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

  small = false;
  inputImage = false;
  imagePath; 
  base64;
  imageSource;
  title;
  description;
  hover;
  fillTheColor;
  showPanel = false;
  current;
  colorMenu = false;
  reminderMenu = false;
  reminderShow = false;
  reminderData;
  customDateTimeDiv = false;
  currentDate = "";
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  reminderOption = [
    {
      "period":"Morning",
      "time":"8:00 AM"
    },
    {
      "period":"Afternoon",
      "time":"1:00 PM"
    },
    {
      "period":"Evening",
      "time":"6:00 PM"
    },
    {
      "period":"Night",
      "time":"8:00 PM"
    }

  ]
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

  constructor(private service: AppService, public dialog: MatDialog) { }

  update() {
    this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((data: any) => {
      console.log(data);
      this.changeStatus(true);
    })
  }

  changeStatus(finished: boolean) {
    this.onStatusChange.emit(finished);
  }

  addImage() {
    this.inputImage = !this.inputImage;
    // this.onFileSelected(event);
  }

  onFileSelected(event) {
    console.log(event);
    // console.log(event.target.files[0])
    this.data.image = event.target.files[0];
    this.imagePath = this.data.image;
    var fd = new FormData();
    fd.append('image',event.target.files[0])
    // this.inputImage = true;
    
    console.log(this.imagePath);
    this.service.postRequest(fd, 'upload').subscribe((data:any) => {
      console.log(data);
      this.base64 = data[0].b64;
      console.log(this.base64);
      this.imagePath = 'data:image/png;base64,';
      console.log(this.imagePath);
      this.imageSource = this.imagePath + this.base64;
      console.log(this.imageSource);
      this.data.image = this.imageSource;
      this.update();
    })
    // this.update();
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

  addReminder() {
    console.log(this.data);
    this.reminderMenu = !this.reminderMenu;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: this.data,
      disableClose: true
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

  laterToday(day) {
    var date = new Date();
    console.log(date);
    this.reminderShow = true;
    this.reminderData = day+',8:00 PM'
    this.data.reminder = this.reminderData;
    this.updateCard();
  }

  removeReminder() {
    this.reminderShow = false;
    this.reminderData = '';
    this.data.reminder = null;
    this.updateCard();
  }

  updateCard() {
    this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((data: any) => {
      console.log(data);
    })
  }

  customDataTime() {
    this.reminderMenu = false;
    this.customDateTimeDiv = true;
  }

  custumDivBack() {
    this.reminderMenu = true;
    this.customDateTimeDiv = false;
  }

  reminderTimeSelect(option) {
    console.log(option);
    this.reminderShow = true;
    this.reminderData = option.time;
    this.data.reminder = this.reminderData;
    this.updateCard();
  }

  ngOnInit() {
    if(this.data.color != null){
     this.fillTheColor = this.data.color;
   }
   if(this.data.image != null){
     this.inputImage = true;
   }
   if(this.data.reminder != null){
     this.reminderShow = true;
     this.reminderData = this.data.reminder;
   }
   var date = new Date();
   this.currentDate = this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

}




