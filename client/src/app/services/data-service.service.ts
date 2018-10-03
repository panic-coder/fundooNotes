import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  label:any

  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  private labelSource = new BehaviorSubject(this.label)
  currentLabel = this.labelSource.asObservable();

  constructor() { }

  changeMessage(message: boolean) {
    this.messageSource.next(message)
  }

  labelName(label: String) {
    this.label = label;
    this.labelSource.next(label);
  }

}
