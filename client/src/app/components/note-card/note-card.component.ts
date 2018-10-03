import { Component, OnInit, Input, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogOverviewExampleDialog } from '../dialog/dialog.component';
import { CollaboratorDialogComponent } from '../collaborator-dialog/collaborator-dialog.component';

export interface DialogData {
  collaborators
  _id
  title
  description
  isPinned
  isArchive
  isTrash
  reminder
  color
  image
  owner
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
  currentDate : any;
  labels = [];
  collabShow = false;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  minDate = new Date();
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

  openCollaboraterDialog() {
    console.log(this.data);
    const dialogRef = this.dialog.open(CollaboratorDialogComponent, {
      width: '600px',
      data: this.data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result.email.innerHTML);
      
      // console.log('The dialog was closed : '+result.title.innerHTML);
      // console.log("Description : "+result.description.innerHTML);
      
      // this.data.title = result.title.innerHTML;
      // this.data.description = result.description.innerHTML;
      // console.log(this.data); 
      // this.update();
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
    console.log(this.currentDate);
    console.log(this.months[this.currentDate.getMonth()]);
    console.log(this.currentDate.getDate());
    var reminderCustomInput = this.months[this.currentDate.getMonth()] + ' ' + this.currentDate.getDate() + ', ' + option.time;
    console.log(reminderCustomInput);
    this.reminderShow = true;
    this.reminderData = reminderCustomInput;
    this.data.reminder = this.reminderData;
    this.updateCard();
  }

  readLabel() {
    this.labels = [];
    this.service.getRequest('getLabels').subscribe((data: any) => {
      data.label.forEach(element => {
        this.labels.push(element.name);  
      });
    })
  }

  addLabel(labelName) {
    console.log(labelName);
    console.log(this.data);
    var index = -1;
    var count = -1
    this.data.labels.forEach(element => {
      count++;
      if(element.name == labelName) {
        index = count;
      }
    });

    console.log(index);
    
    if(index == -1){
      this.data.labels.push({
        "name":labelName
      })
    } else {
      this.data.labels.splice(index, 1)
    }
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
   if(this.data.collaborators != null) {
     this.collabShow = true;
   }
   var date = new Date();
   this.currentDate = this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

}




