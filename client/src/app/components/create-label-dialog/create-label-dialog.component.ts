import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../note-card/note-card.component';

@Component({
  selector: 'app-create-label-dialog',
  templateUrl: './create-label-dialog.component.html',
  styleUrls: ['./create-label-dialog.component.css']
})
export class CreateLabelDialogComponent implements OnInit {
  labelData;
  constructor(public dialogRef: MatDialogRef<CreateLabelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.labelData = data;
     }
    
    onNoClick(): void {
      console.log('Dialog');
      this.dialogRef.close();
    }

    addLabel(newLabel) {
      var index;
      index = this.labelData.indexOf(newLabel);
      if(index == -1 ){
        this.labelData.push(newLabel);
        console.log(newLabel);
      }
    }
    
    deleteLabel(item) {
      console.log(item);
      this.labelData.splice(item,1)
      console.log(this.labelData);
    }

    editLabel(item, newItem) {
      var index;
      index = this.labelData.indexOf(item);
      this.labelData.splice(index,1)
      this.labelData.push(newItem.innerHTML)
      console.log(this.labelData);
    }

  ngOnInit() { }

}
