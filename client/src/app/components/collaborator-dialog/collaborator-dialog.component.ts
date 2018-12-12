import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../note-card/note-card.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppService } from '../../services/app.service';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-collaborator-dialog',
  templateUrl: './collaborator-dialog.component.html',
  styleUrls: ['./collaborator-dialog.component.css']
})
export class CollaboratorDialogComponent implements OnInit {

  email = '';
  name = '';
  raw_data;
  constructor(public dialogRef: MatDialogRef<CollaboratorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private service: AppService) { }
    
    onNoClick(): void {
      console.log('Dialog');
      this.dialogRef.close();
    }

    verifyUser(newUserEmail) {
      console.log({"email": newUserEmail.innerHTML});
      
      this.service.postRequest({"email": newUserEmail.innerHTML},'collabEmailSearch').subscribe((resData:any) => {
        console.log(resData.data);
        console.log(this.data);
        if(resData.success){
          console.log(resData.data.name);
          console.log(newUserEmail.innerHTML);
          console.log(this.data.collaborators);
          
          this.data.collaborators.push({
            "name":resData.data.name,
            "email":newUserEmail.innerHTML
          });
          console.log(this.data.collaborators);
          
          this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((updateResponse: any) => {
            console.log(updateResponse);
            console.log(this.data.collaborators);
            
            var note = {
              "userId": resData.data._id,
              "title": this.data.title,
              "description": this.data.description,
              "isPinned": this.data.isPinned,
              "isArchive": this.data.isArchive,
              "isTrash": this.data.isTrash,
              "reminder":this.data.reminder,
              "color":this.data.color,
              "image":this.data.image,
              "collaborators":this.data.collaborators,
              "owner": this.data.owner
            }
            console.log(note.collaborators);
            this.service.postRequest(note,'savenote').subscribe((colabResponse: any) => {
              console.log(colabResponse);
            })
        })
        } else {
          alert('Not a registered user')
        }
      })
    }

    deleteCollab(email) {
      console.log(email);
      var index;
      index = this.data.collaborators.findIndex(item => item.email == email)
      this.data.collaborators.splice(index,1);
      console.log(this.data.collaborators);
      this.service.updateRequest('updatenote', this.data._id, this.data).subscribe((updateResponse: any) => {
        console.log(updateResponse);
      })
      this.service.postRequest({"email":email,"title":this.data.title},'deletecollab').subscribe((response: any) => {
        console.log(response);
        this.service.deleteRequest('deletenote',response.doc._id).subscribe((collabDeleteResponse:any) => {
          console.log(collabDeleteResponse);
        })
      })
    }

  ngOnInit() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(localStorage.getItem('token'));
    this.raw_data = decodedToken;
    this.email = this.raw_data.email;
    this.name = this.raw_data.name;
  }

}
