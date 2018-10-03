import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/app.service';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

  notes = [];
  @Input() view:boolean;
  labelName:any;

  constructor(private service: AppService, private data: DataServiceService) {}

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.view = message)
    this.data.currentLabel.subscribe((label:any) => {
      this.labelName = label
      this.readAll(label);
    })
  }

  childStatusChanged(finished: boolean) {
    if (finished){
      this.data.currentLabel.subscribe((label:any) => {
        this.labelName = label
        this.readAll(label);
      })
    }
  }

  readAll(label) {
    this.notes = [];
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(elementnote => {
        if(elementnote.labels != null) {
          elementnote.labels.forEach(element => {
            if(element.name == label) {
              this.notes.push(elementnote);
            }
          });
        }
      });
    })
  }

}
