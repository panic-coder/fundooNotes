import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  notes = []
  constructor(private service: AppService) {
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(element => {
        if(element.isArchive == true)
          this.notes.push(element)
      });
    })
   }
  
  name1 = "Archive";
  name2 = ""
  ngOnInit() {
  }

}
