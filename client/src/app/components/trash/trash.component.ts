import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
notes = []
  constructor(private service: AppService) {
    this.service.getRequest('readnote').subscribe((data: any) => {
      data.data.forEach(element => {
        if(element.isTrash == true){
          this.notes.push(element);
        }
      });
    }) 
   }

   trash(data) {
    this.service.deleteRequest('deletenote', data._id).subscribe((data: any) => {
      console.log(data);
      
    })
   }

   restore(data) {
     data.isTrash = false;
    this.service.updateRequest('updatenote', data._id, data).subscribe((data: any) => {
      console.log(data);
      
    })
   }

  ngOnInit() {
  }

}
