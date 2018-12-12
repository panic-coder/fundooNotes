import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DialogData } from '../note-card/note-card.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper/src/image-cropper.component';

@Component({
  selector: 'app-change-image-dialog',
  templateUrl: './change-image-dialog.component.html',
  styleUrls: ['./change-image-dialog.component.css']
})
export class ChangeImageDialogComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageEvent: any;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<ChangeImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private service: AppService) { }

  onNoClick(): void {
    console.log('Dialog');
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImageEvent = event;
      this.croppedImage = event.base64;
      
  }
  imageLoaded() {
      console.log("cropper");
  }
  loadImageFailed() {
      // show message
      console.log("Failed");
      
  }
}
