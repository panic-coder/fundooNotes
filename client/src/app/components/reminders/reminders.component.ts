import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  notes = []
  constructor(private service: AppService, private data: DataServiceService) {}
 
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
        if(element.reminder != null)
          this.notes.push(element)
      });
    })
  }

}
