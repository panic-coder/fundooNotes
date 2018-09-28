import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../note-card/note-card.component';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-create-label-dialog',
  templateUrl: './create-label-dialog.component.html',
  styleUrls: ['./create-label-dialog.component.css']
})
export class CreateLabelDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateLabelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private service: AppService) { }
    
    onNoClick(): void {
      console.log('Dialog');
      this.dialogRef.close();
    }

  ngOnInit() {
  }

}
