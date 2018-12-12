import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  notes = []
  constructor(private service: AppService, private data: DataServiceService) {}
  
  name1 = "Archive";
  name2 = ""
  @Input() view:boolean;


  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.view = message)
    this.readAll();
  }

  childStatusChanged(finished: boolean) {
    if (finished){
      this.readAll();
    }
  }

  readAll() {
    this.notes = [];
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(element => {
        if(element.isArchive == true)
          this.notes.push(element)
      });
    })

  }


}
