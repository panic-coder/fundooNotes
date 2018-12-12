import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private service: AppService) { }

  ngOnInit() {
  }
  isValid = false;
  email = new FormControl('', [Validators.required, Validators.email]); //Email validation

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  passwordReset(email) {
    console.log(email);
    var user = {
      "email":email
    }
    this.service.postRequest(user, 'forgot').subscribe((data: any) => {
      console.log(data);
      
      this.isValid = true;
    })
    
    
  }
}
