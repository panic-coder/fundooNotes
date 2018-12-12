import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../note-card/note-card.component';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogOverviewExampleDialog {

  imageInput = false;
  imageData = '';

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: AppService) { }

  onNoClick(): void {
    console.log('Dialog');
    this.dialogRef.close();
  }

  deleteImage(info) {
    info.image = null;
      this.service.updateRequest('updatenote', info._id, info).subscribe((data: any) => {
        console.log(data);
      })
  }
 
}

