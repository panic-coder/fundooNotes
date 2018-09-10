import { Component, OnInit, Input, ViewChild, AfterViewInit, SecurityContext } from '@angular/core';
import { AppService } from '../../services/app.service';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  notes = [];
  enterExpression = true;
  expression = false;
  value;
  constructor(private service: AppService) { }

  ngOnInit() {
    this.readAll();
  }

  childStatusChanged(finished: boolean) {
    // console.log("on Change");
    
    if (finished){
      this.readAll();
    }
  }

  readAll(){
    this.notes = [];
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(element => {
        if(element.isTrash == false && element.isArchive == false)
          this.notes.push(element);
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
      "color":null
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
