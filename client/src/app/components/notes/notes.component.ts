import { Component, OnInit, Input, ViewChild, AfterViewInit, SecurityContext } from '@angular/core';
import { AppService } from '../../services/app.service';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  notes = [];
  constructor(private service: AppService) { 
    // this.notes = [];
    // console.log('constructor');
    // this.service.getRequest('readnote').subscribe((data: any) => {
    //   // console.log(data.data);
    //   data.data.forEach(element => {
    //     if(element.isTrash == false)
    //       this.notes.push(element);
    //   });
    //   console.log(this.notes);
      
    //   // this.notes = data.data;
    // });
  }

  enterExpression = true;
  expression = false;
  value;

  ngOnInit() {
    this.notes = [];
    this.service.getRequest('readnote').subscribe((data: any) => {
      // console.log(data.data);
      data.data.forEach(element => {
        if(element.isTrash == false)
          this.notes.push(element);
      });
      console.log(this.notes);
      
      // this.notes = data.data;
    });
    
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
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
    this.notes = [];
    // console.log('constructor');
    this.service.getRequest('readnote').subscribe((data: any) => {
      // console.log(data.data);
      data.data.forEach(element => {
        if(element.isTrash == false)
          this.notes.push(element);
      });
      console.log(this.notes);
      
      // this.notes = data.data;
    });
  }

  update(title, description){
    this.closeNote(title, description);
    this.service.getRequest('readnote').subscribe((data: any) => {
      console.log(data.data);
      //this.notes = data.data;
    });
  }

}
