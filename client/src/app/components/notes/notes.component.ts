import { Component, OnInit, Input, ViewChild, AfterViewInit, SecurityContext } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DataServiceService } from '../../services/data-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  @Input() view:boolean;

  pinnedNotes = [];
  notes = [];
  enterExpression = true;
  expression = false;
  value;
  pinned = false;
  raw_data;
  constructor(private service: AppService,private data:DataServiceService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.view = message)
    this.readAll();

  }

  childStatusChanged(finished: boolean) {
    if (finished){
      this.readAll();
    }
  }

  readAll(){
    this.notes = [];
    this.pinnedNotes = [];
    this.pinned = false;
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(element => {
        if(element.isTrash == false && element.isArchive == false && element.isPinned == false)
          this.notes.push(element);
        if(element.isPinned == true){
          this.pinnedNotes.push(element);
          this.pinned = true;
        }
      });
      console.log(this.notes);
    });
  }

  newNote() {
    this.expression = true;
    this.enterExpression = false;
  }

// public getSantizeHtml(html : string) {
//   return this.sanitizer.bypassSecurityTrustUrl(html);
// }

// public getSantizeUrl(url : string) {
//   return this.sanitizer.bypassSecurityTrustUrl(url);
// }
// transform(v:string):SafeHtml {
//   return this.sanitizer.bypassSecurityTrustHtml(v);
// }


  closeNote(title,description) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(localStorage.getItem('token'));
    this.raw_data = decodedToken;
    // this.transform(description.innerHTML);
    this.value = description.innerHTML;
    console.log(this.value);
    if(title.innerHTML != '') {
      console.log(title.innerHTML);
      console.log(description.innerHTML);
    }
    var userId = localStorage.getItem('id');
    var note = {
      "userId": userId,
      "title": title.innerHTML,
      "description": description.innerHTML,
      "isPinned": false,
      "isArchive": false,
      "isTrash": false,
      "reminder":null,
      "color":null,
      "image":null,
      "collaborators":null,
      "owner": {
        "name": this.raw_data.name,
        "email": this.raw_data.email
    }
    }
    this.expression = false;
    this.enterExpression = true;
    this.service.postRequest(note, 'savenote').subscribe((data: any) => {
      console.log(data);
    });
   this.readAll();
  }

  update(title, description){
    this.closeNote(title, description);
    this.service.getRequest('readnote').subscribe((data: any) => {
      console.log(data.data);
      //this.notes = data.data;
    });
  }

}
