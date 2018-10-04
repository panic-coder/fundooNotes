import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  notes = []
  constructor(private service: AppService, private data: DataServiceService) {}
  
 
  @Input() view:boolean;
  search;

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.view = message)
    this.data.currentDataSearch.subscribe((search:any) => {
      this.search = search
      console.log(search);
    })
    this.readAll();
  }

  childStatusChanged(finished: boolean) {
    if (finished){
      this.data.currentDataSearch.subscribe((search:any) => {
        this.search = search
        console.log(search);
      })
      this.readAll();
    }
  }

  readAll() {
    this.notes = [];
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(element => {
          this.notes.push(element)
      });
    })
  }

}
